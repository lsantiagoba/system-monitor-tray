import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class SystemMonitorExtension {
    constructor(metadata) {
        this._metadata = metadata;
        this._indicator = null;
        this._timeout = null;
        this._cpuUsage = 0;
        this._prevTotal = 0;
        this._prevIdle = 0;
        this._settings = null;
        this._settingsChangedId = null;
    }
    
    _getSettings() {
        if (!this._settings) {
            const GioSSS = Gio.SettingsSchemaSource;
            let schemaDir = this._metadata.dir.get_child('schemas');
            let schemaSource = GioSSS.new_from_directory(
                schemaDir.get_path(),
                GioSSS.get_default(),
                false
            );
            let schema = schemaSource.lookup('org.gnome.shell.extensions.system-monitor-tray', false);
            this._settings = new Gio.Settings({settings_schema: schema});
        }
        return this._settings;
    }

    enable() {
        const settings = this._getSettings();
        
        // Create the panel button
        this._indicator = new PanelMenu.Button(0.0, 'System Monitor', false);
        
        // Create container for labels
        let box = new St.BoxLayout({
            style_class: 'panel-status-menu-box',
            x_align: Clutter.ActorAlign.START
        });
        
        // Create labels for each metric
        this._cpuLabel = new St.Label({
            text: 'CPU: --',
            y_align: Clutter.ActorAlign.CENTER
        });
        
        this._memLabel = new St.Label({
            text: 'Mem: --',
            y_align: Clutter.ActorAlign.CENTER
        });
        
        this._swapLabel = new St.Label({
            text: 'Swap: --',
            y_align: Clutter.ActorAlign.CENTER
        });
        
        this._loadLabel = new St.Label({
            text: 'Load: --',
            y_align: Clutter.ActorAlign.CENTER
        });
        
        // Add labels to box with spacing
        box.add_child(this._cpuLabel);
        box.add_child(new St.Label({ text: '  ', y_align: Clutter.ActorAlign.CENTER }));
        box.add_child(this._memLabel);
        box.add_child(new St.Label({ text: '  ', y_align: Clutter.ActorAlign.CENTER }));
        box.add_child(this._swapLabel);
        box.add_child(new St.Label({ text: '  ', y_align: Clutter.ActorAlign.CENTER }));
        box.add_child(this._loadLabel);
        
        this._indicator.add_child(box);
        
        // Add to panel based on position setting
        const position = settings.get_string('position');
        let index = 0;
        
        // For left position, use high index to place after existing extensions
        if (position === 'left') {
            index = -1; // -1 adds to the end of the box
        }
        
        Main.panel.addToStatusArea('system-monitor', this._indicator, index, position);
        
        // Apply initial styling
        this._updateStyling();
        
        // Listen for settings changes
        this._settingsChangedId = settings.connect('changed', () => {
            this._updateStyling();
            // Reposition if position changed
            if (settings.get_string('position') !== position) {
                this.disable();
                this.enable();
            }
        });
        
        // Start monitoring
        this._updateStats();
        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
            this._updateStats();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._settingsChangedId) {
            this._getSettings().disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        
        if (this._timeout) {
            GLib.Source.remove(this._timeout);
            this._timeout = null;
        }
        
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        
        this._cpuLabel = null;
        this._memLabel = null;
        this._swapLabel = null;
        this._loadLabel = null;
        this._settings = null;
    }
    
    _updateStyling() {
        const settings = this._getSettings();
        const boldLabels = settings.get_boolean('bold-labels');
        const boldPercentages = settings.get_boolean('bold-percentages');
        const showIcons = settings.get_boolean('show-icons');
        
        // Apply styling to labels
        const labels = [this._cpuLabel, this._memLabel, this._swapLabel, this._loadLabel];
        labels.forEach(label => {
            if (label) {
                let style = '';
                if (boldLabels || boldPercentages) {
                    // We'll handle bold in the text update functions
                }
                label.set_style(style);
            }
        });
        
        // Update text to reflect current settings
        this._updateStats();
    }
    
    _formatText(label, value, showIcon = false, iconChar = '') {
        const settings = this._getSettings();
        const boldLabels = settings.get_boolean('bold-labels');
        const boldPercentages = settings.get_boolean('bold-percentages');
        const showIcons = settings.get_boolean('show-icons');
        
        let text = '';
        
        if (showIcons && iconChar) {
            text = iconChar + ' ';
        } else {
            if (boldLabels) {
                text = `<b>${label}</b> `;
            } else {
                text = `${label} `;
            }
        }
        
        if (boldPercentages) {
            text += `<b>${value}</b>`;
        } else {
            text += value;
        }
        
        return text;
    }
    
    _formatPercentage(value) {
        const settings = this._getSettings();
        const roundValues = settings.get_boolean('round-values');
        
        if (roundValues) {
            return Math.round(value).toString();
        } else {
            return value.toFixed(1);
        }
    }

    _updateStats() {
        this._updateCPU();
        this._updateMemory();
        this._updateSwap();
        this._updateLoad();
    }

    _updateCPU() {
        try {
            let file = Gio.File.new_for_path('/proc/stat');
            let [success, contents] = file.load_contents(null);
            
            if (success) {
                let contentStr = new TextDecoder().decode(contents);
                let lines = contentStr.split('\n');
                let cpuLine = lines[0];
                
                if (cpuLine.startsWith('cpu ')) {
                    let values = cpuLine.split(/\s+/).slice(1).map(v => parseInt(v));
                    let idle = values[3] + values[4]; // idle + iowait
                    let total = values.reduce((a, b) => a + b, 0);
                    
                    if (this._prevTotal !== 0) {
                        let diffIdle = idle - this._prevIdle;
                        let diffTotal = total - this._prevTotal;
                        let usage = ((diffTotal - diffIdle) / diffTotal) * 100;
                        this._cpuUsage = usage;
                        const text = this._formatText('CPU:', `${this._formatPercentage(usage)}%`, true, '⚙');
                        this._cpuLabel.set_text(text);
                        this._cpuLabel.clutter_text.set_markup(text);
                    }
                    
                    this._prevIdle = idle;
                    this._prevTotal = total;
                }
            }
        } catch (e) {
            logError(e, 'Error updating CPU');
        }
    }

    _updateMemory() {
        try {
            let file = Gio.File.new_for_path('/proc/meminfo');
            let [success, contents] = file.load_contents(null);
            
            if (success) {
                let contentStr = new TextDecoder().decode(contents);
                let lines = contentStr.split('\n');
                
                let memTotal = 0, memAvailable = 0;
                
                for (let line of lines) {
                    if (line.startsWith('MemTotal:')) {
                        memTotal = parseInt(line.split(/\s+/)[1]);
                    } else if (line.startsWith('MemAvailable:')) {
                        memAvailable = parseInt(line.split(/\s+/)[1]);
                    }
                }
                
                if (memTotal > 0) {
                    let memUsed = memTotal - memAvailable;
                    let memPercent = (memUsed / memTotal) * 100;
                    const text = this._formatText('Mem:', `${this._formatPercentage(memPercent)}%`, true, '🗍');
                    this._memLabel.set_text(text);
                    this._memLabel.clutter_text.set_markup(text);
                }
            }
        } catch (e) {
            logError(e, 'Error updating Memory');
        }
    }

    _updateSwap() {
        try {
            let file = Gio.File.new_for_path('/proc/meminfo');
            let [success, contents] = file.load_contents(null);
            
            if (success) {
                let contentStr = new TextDecoder().decode(contents);
                let lines = contentStr.split('\n');
                
                let swapTotal = 0, swapFree = 0;
                
                for (let line of lines) {
                    if (line.startsWith('SwapTotal:')) {
                        swapTotal = parseInt(line.split(/\s+/)[1]);
                    } else if (line.startsWith('SwapFree:')) {
                        swapFree = parseInt(line.split(/\s+/)[1]);
                    }
                }
                
                if (swapTotal > 0) {
                    let swapUsed = swapTotal - swapFree;
                    let swapPercent = (swapUsed / swapTotal) * 100;
                    const text = this._formatText('Swap:', `${this._formatPercentage(swapPercent)}%`, true, '💾');
                    this._swapLabel.set_text(text);
                    this._swapLabel.clutter_text.set_markup(text);
                } else {
                    const settings = this._getSettings();
                    const roundValues = settings.get_boolean('round-values');
                    const zeroValue = roundValues ? '0' : '0.0';
                    const text = this._formatText('Swap:', `${zeroValue}%`, true, '💾');
                    this._swapLabel.set_text(text);
                    this._swapLabel.clutter_text.set_markup(text);
                }
            }
        } catch (e) {
            logError(e, 'Error updating Swap');
        }
    }

    _updateLoad() {
        try {
            let file = Gio.File.new_for_path('/proc/loadavg');
            let [success, contents] = file.load_contents(null);
            
            if (success) {
                let contentStr = new TextDecoder().decode(contents);
                let values = contentStr.trim().split(/\s+/);
                let load1 = parseFloat(values[0]);
                
                // Get number of CPU cores
                let cpuFile = Gio.File.new_for_path('/proc/cpuinfo');
                let [cpuSuccess, cpuContents] = cpuFile.load_contents(null);
                let cores = 1;
                
                if (cpuSuccess) {
                    let cpuStr = new TextDecoder().decode(cpuContents);
                    let processors = cpuStr.match(/^processor/gm);
                    if (processors) {
                        cores = processors.length;
                    }
                }
                
                // Calculate load percentage
                let loadPercent = (load1 / cores) * 100;
                const settings = this._getSettings();
                const roundValues = settings.get_boolean('round-values');
                const load1Str = roundValues ? load1.toFixed(1) : load1.toFixed(2);
                const text = this._formatText('Load:', `${this._formatPercentage(loadPercent)}% (${load1Str})`, true, '📊');
                this._loadLabel.set_text(text);
                this._loadLabel.clutter_text.set_markup(text);
            }
        } catch (e) {
            logError(e, 'Error updating Load');
        }
    }
}

import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

/**
 * SystemMonitorIndicator - UI component for the system monitor panel button
 * 
 * This class manages the panel button and its child labels for displaying
 * CPU, memory, swap, and load statistics in the GNOME Shell top bar.
 */
export class SystemMonitorIndicator {
    /**
     * @param {Gio.Settings} settings - GSettings object for extension preferences
     */
    constructor(settings) {
        this._settings = settings;
        this._indicator = null;
        this._cpuLabel = null;
        this._memLabel = null;
        this._swapLabel = null;
        this._loadLabel = null;
        this._settingsChangedId = null;
    }

    /**
     * Create and add the indicator to the panel
     * @param {Function} onSettingsChanged - Callback for settings changes
     */
    create(onSettingsChanged) {
        this._indicator = new PanelMenu.Button(0.0, 'System Monitor', false);
        
        let box = new St.BoxLayout({
            style_class: 'panel-status-menu-box',
            x_align: Clutter.ActorAlign.START
        });
        
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
        
        // Add labels with spacing
        box.add_child(this._cpuLabel);
        box.add_child(this._createSpacer());
        box.add_child(this._memLabel);
        box.add_child(this._createSpacer());
        box.add_child(this._swapLabel);
        box.add_child(this._createSpacer());
        box.add_child(this._loadLabel);
        
        this._indicator.add_child(box);
        
        // Add to panel at specified position
        const position = this._settings.get_string('position');
        const index = position === 'left' ? -1 : 0;
        
        Main.panel.addToStatusArea('system-monitor', this._indicator, index, position);
        
        // Connect settings change handler
        if (onSettingsChanged) {
            this._settingsChangedId = this._settings.connect('changed', onSettingsChanged);
        }
    }

    /**
     * Create a spacer label for separating metrics
     * @returns {St.Label} Spacer label
     * @private
     */
    _createSpacer() {
        return new St.Label({ 
            text: '  ', 
            y_align: Clutter.ActorAlign.CENTER 
        });
    }

    /**
     * Update CPU label
     * @param {string} text - Formatted text to display
     */
    updateCPU(text) {
        if (this._cpuLabel) {
            this._cpuLabel.set_text(text);
            this._cpuLabel.clutter_text.set_markup(text);
        }
    }

    /**
     * Update memory label
     * @param {string} text - Formatted text to display
     */
    updateMemory(text) {
        if (this._memLabel) {
            this._memLabel.set_text(text);
            this._memLabel.clutter_text.set_markup(text);
        }
    }

    /**
     * Update swap label
     * @param {string} text - Formatted text to display
     */
    updateSwap(text) {
        if (this._swapLabel) {
            this._swapLabel.set_text(text);
            this._swapLabel.clutter_text.set_markup(text);
        }
    }

    /**
     * Update load average label
     * @param {string} text - Formatted text to display
     */
    updateLoad(text) {
        if (this._loadLabel) {
            this._loadLabel.set_text(text);
            this._loadLabel.clutter_text.set_markup(text);
        }
    }

    /**
     * Check if indicator needs repositioning based on settings
     * @returns {boolean} True if repositioning is needed
     */
    needsReposition() {
        if (!this._indicator) {
            return false;
        }
        
        const currentPosition = this._settings.get_string('position');
        return Main.panel._rightBox.contains(this._indicator.container) !== (currentPosition === 'right');
    }

    /**
     * Destroy the indicator and clean up
     */
    destroy() {
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        
        this._cpuLabel = null;
        this._memLabel = null;
        this._swapLabel = null;
        this._loadLabel = null;
    }
}

import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';


export class SystemMonitorIndicator {
    
    constructor(settings) {
        this._settings = settings;
        this._indicator = null;
        this._cpuLabel = null;
        this._memLabel = null;
        this._swapLabel = null;
        this._loadLabel = null;
        this._settingsChangedId = null;
    }

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

  
    _createSpacer() {
        return new St.Label({ 
            text: '  ', 
            y_align: Clutter.ActorAlign.CENTER 
        });
    }

  
    updateCPU(text) {
        if (this._cpuLabel) {
            this._cpuLabel.set_text(text);
            this._cpuLabel.clutter_text.set_markup(text);
        }
    }


    updateMemory(text) {
        if (this._memLabel) {
            this._memLabel.set_text(text);
            this._memLabel.clutter_text.set_markup(text);
        }
    }


    updateSwap(text) {
        if (this._swapLabel) {
            this._swapLabel.set_text(text);
            this._swapLabel.clutter_text.set_markup(text);
        }
    }


    updateLoad(text) {
        if (this._loadLabel) {
            this._loadLabel.set_text(text);
            this._loadLabel.clutter_text.set_markup(text);
        }
    }

    needsReposition() {
        if (!this._indicator) {
            return false;
        }
        
        const currentPosition = this._settings.get_string('position');
        return Main.panel._rightBox.contains(this._indicator.container) !== (currentPosition === 'right');
    }


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

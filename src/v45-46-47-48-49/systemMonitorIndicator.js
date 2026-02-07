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
        this._gpuLabel = null;
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
        
        this._gpuLabel = new St.Label({
            text: 'GPU: --',
            y_align: Clutter.ActorAlign.CENTER
        });
        
        // Store references for visibility control
        this._cpuContainer = new St.BoxLayout();
        this._cpuContainer.add_child(this._cpuLabel);
        
        this._memContainer = new St.BoxLayout();
        this._memContainer.add_child(this._memLabel);
        
        this._swapContainer = new St.BoxLayout();
        this._swapContainer.add_child(this._swapLabel);
        
        this._loadContainer = new St.BoxLayout();
        this._loadContainer.add_child(this._loadLabel);
        
        this._gpuContainer = new St.BoxLayout();
        this._gpuContainer.add_child(this._gpuLabel);
        
        // Add labels with spacing
        box.add_child(this._cpuContainer);
        this._cpuSpacer = this._createSpacer();
        box.add_child(this._cpuSpacer);
        
        box.add_child(this._memContainer);
        this._memSpacer = this._createSpacer();
        box.add_child(this._memSpacer);
        
        box.add_child(this._swapContainer);
        this._swapSpacer = this._createSpacer();
        box.add_child(this._swapSpacer);
        
        box.add_child(this._loadContainer);
        this._loadSpacer = this._createSpacer();
        box.add_child(this._loadSpacer);
        
        box.add_child(this._gpuContainer);
        
        // Set initial visibility
        this._updateVisibility();
        
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
        const separatorText = this._settings.get_string('custom-separator');
        return new St.Label({
            text: separatorText,
            y_align: Clutter.ActorAlign.CENTER
        });
    }

    _updateVisibility() {
        const showCpu = this._settings.get_boolean('show-cpu');
        const showMemory = this._settings.get_boolean('show-memory');
        const showSwap = this._settings.get_boolean('show-swap');
        const showLoad = this._settings.get_boolean('show-load');
        const showGpu = this._settings.get_boolean('show-gpu');
        
        this._cpuContainer.visible = showCpu;
        this._cpuSpacer.visible = showCpu && (showMemory || showSwap || showLoad || showGpu);
        
        this._memContainer.visible = showMemory;
        this._memSpacer.visible = showMemory && (showSwap || showLoad || showGpu);
        
        this._swapContainer.visible = showSwap;
        this._swapSpacer.visible = showSwap && (showLoad || showGpu);
        
        this._loadContainer.visible = showLoad;
        this._loadSpacer.visible = showLoad && showGpu;
        
        this._gpuContainer.visible = showGpu;
    }

    _updateLabelWithText(label, text) {
        const consistentSpacing = this._settings.get_boolean('consistent-spacing');
        const markup = consistentSpacing ? `<span font_family="monospace">${text}</span>` : text;
        label.set_text(text);
        label.clutter_text.set_markup(markup);
    }


    updateCPU(text) {
        if (this._cpuLabel && this._settings.get_boolean('show-cpu')) {
            this._updateLabelWithText(this._cpuLabel, text);
        }
    }


    updateMemory(text) {
        if (this._memLabel && this._settings.get_boolean('show-memory')) {
            this._updateLabelWithText(this._memLabel, text);
        }
    }


    updateSwap(text) {
        if (this._swapLabel && this._settings.get_boolean('show-swap')) {
            this._updateLabelWithText(this._swapLabel, text);
        }
    }


    updateLoad(text) {
        if (this._loadLabel && this._settings.get_boolean('show-load')) {
            this._updateLabelWithText(this._loadLabel, text);
        }
    }

    updateGPU(text) {
        if (this._gpuLabel && this._settings.get_boolean('show-gpu')) {
            this._updateLabelWithText(this._gpuLabel, text);
        }
    }

    updateAllVisibility() {
        this._updateVisibility();
    }


    needsReposition() {
        if (!this._indicator) {
            return false;
        }
        
        const desiredPosition = this._settings.get_string('position');
        const container = this._indicator.container;
        
        // Check which box currently contains the indicator
        const inLeft = Main.panel._leftBox.contains(container);
        const inCenter = Main.panel._centerBox.contains(container);
        const inRight = Main.panel._rightBox.contains(container);
        
        // Return true if the indicator is not in the desired position
        if (desiredPosition === 'left' && !inLeft) return true;
        if (desiredPosition === 'center' && !inCenter) return true;
        if (desiredPosition === 'right' && !inRight) return true;
        
        return false;
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
        this._gpuLabel = null;
    }
}

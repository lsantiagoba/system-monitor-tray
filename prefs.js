import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class SystemMonitorPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const _ = this.gettext.bind(this);
        
        const page = new Adw.PreferencesPage();
        window.add(page);
        
        const group = new Adw.PreferencesGroup({
            title: _('Appearance Settings'),
            description: _('Configure how the system monitor appears')
        });
        page.add(group);
        
        const positionRow = new Adw.ComboRow({
            title: _('Panel Position'),
            subtitle: _('Position of the indicator in the top panel'),
            model: new Gtk.StringList({
                strings: [_('Left'), _('Center'), _('Right')]
            })
        });
        
        const currentPosition = settings.get_string('position');
        positionRow.selected = ['left', 'center', 'right'].indexOf(currentPosition);
        
        positionRow.connect('notify::selected', (widget) => {
            const positions = ['left', 'center', 'right'];
            settings.set_string('position', positions[widget.selected]);
        });
        group.add(positionRow);
        
        const iconsRow = new Adw.SwitchRow({
            title: _('Show Icons'),
            subtitle: _('Display icons instead of text labels')
        });
        settings.bind('show-icons', iconsRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(iconsRow);
        
        const boldLabelsRow = new Adw.SwitchRow({
            title: _('Bold Labels'),
            subtitle: _('Display labels in bold text')
        });
        settings.bind('bold-labels', boldLabelsRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(boldLabelsRow);
        
        const boldPercentagesRow = new Adw.SwitchRow({
            title: _('Bold Percentages'),
            subtitle: _('Display percentage values in bold')
        });
        settings.bind('bold-percentages', boldPercentagesRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(boldPercentagesRow);
        
        const roundValuesRow = new Adw.SwitchRow({
            title: _('Round Values'),
            subtitle: _('Round percentages to whole numbers (e.g., 13% instead of 12.5%)')
        });
        settings.bind('round-values', roundValuesRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(roundValuesRow);
        
        const visibilityGroup = new Adw.PreferencesGroup({
            title: _('Visibility Settings'),
            description: _('Show or hide individual indicators')
        });
        page.add(visibilityGroup);
        
        const showCpuRow = new Adw.SwitchRow({
            title: _('Show CPU'),
            subtitle: _('Display CPU usage indicator')
        });
        settings.bind('show-cpu', showCpuRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        visibilityGroup.add(showCpuRow);
        
        const showMemoryRow = new Adw.SwitchRow({
            title: _('Show Memory'),
            subtitle: _('Display memory usage indicator')
        });
        settings.bind('show-memory', showMemoryRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        visibilityGroup.add(showMemoryRow);
        
        const showSwapRow = new Adw.SwitchRow({
            title: _('Show Swap'),
            subtitle: _('Display swap usage indicator')
        });
        settings.bind('show-swap', showSwapRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        visibilityGroup.add(showSwapRow);
        
        const showLoadRow = new Adw.SwitchRow({
            title: _('Show Load'),
            subtitle: _('Display system load indicator')
        });
        settings.bind('show-load', showLoadRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        visibilityGroup.add(showLoadRow);
        
        const showGpuRow = new Adw.SwitchRow({
            title: _('Show GPU'),
            subtitle: _('Display GPU usage indicator (NVIDIA, AMD, Intel)')
        });
        settings.bind('show-gpu', showGpuRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        visibilityGroup.add(showGpuRow);
        
        const supportGroup = new Adw.PreferencesGroup({
            title: _('Support'),
            description: _('Help support future updates and development')
        });
        page.add(supportGroup);
        
        const donationRow = new Adw.ActionRow({
            title: _('Support Future Updates'),
            subtitle: _('Consider supporting this extension via PayPal'),
            activatable: true
        });
        
        const donateButton = new Gtk.Button({
            label: _('Donate'),
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action']
        });
        
        donateButton.connect('clicked', () => {
            Gtk.show_uri(window, 'https://www.paypal.com/paypalme/leandrosb3', Gdk.CURRENT_TIME);
        });
        
        donationRow.add_suffix(donateButton);
        donationRow.activatable_widget = donateButton;
        supportGroup.add(donationRow);
    }
}

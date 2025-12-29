# System Monitor Tray

GNOME Shell extension that displays real-time system resource usage in the top panel.

![GNOME Version](https://img.shields.io/badge/GNOME-43%20|%2044%20|%2045%20|%2046-blue)
![License](https://img.shields.io/badge/license-MIT-green)

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/leandrosb3)

## Features

- **CPU**: Real-time processor usage percentage
- **Memory**: RAM usage percentage
- **Swap**: Swap memory usage percentage
- **Load**: System average load (1 minute) displayed as percentage and absolute value

## Customization

Access preferences through GNOME Extensions app or run:
```bash
gnome-extensions prefs system-monitor-tray@lsbcodes
```

Available settings:
- **Panel Position**: Choose between left, center, or right panel position
- **Show Icons**: Display icons instead of text labels
- **Bold Labels**: Make metric labels appear in bold
- **Bold Percentages**: Make percentage values appear in bold
- **Round Values**: Round percentages to whole numbers (e.g., 13% vs 12.5%)

## Installation

### From GNOME Extensions Website (Recommended)
Visit [GNOME Extensions](https://extensions.gnome.org/) and search for "System Monitor Tray"

### Manual Installation

1. Copy the extension folder to your GNOME extensions directory:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsbcodes
   cp -r * ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsbcodes/
   ```

2. Restart GNOME Shell:
   - On X11: Press `Alt+F2`, type `r` and press Enter
   - On Wayland: Log out and log back in

3. Enable the extension:
   ```bash
   gnome-extensions enable system-monitor-tray@lsbcodes
   ```

   Or use the Extensions application from the applications menu.

## Uninstallation

```bash
gnome-extensions disable system-monitor-tray@lsbcodes
rm -rf ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsbcodes
```

## Technical Details

- **Update Frequency**: Indicators refresh automatically every 2 seconds
- **Data Source**: Reads from `/proc/stat`, `/proc/meminfo`, and `/proc/loadavg`
- **Performance**: Minimal CPU overhead, designed for efficiency

## Requirements

- GNOME Shell 43 or higher
- Linux system with `/proc` filesystem

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/lsantiagoba/system-monitor-tray/issues) on GitHub.

## Support This Project

If you find this extension useful, consider supporting its development:

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/leandrosb3)

Your support helps maintain and improve this extension. Thank you! ❤️

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

lsbcodes

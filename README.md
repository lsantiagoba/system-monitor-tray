# System Monitor Tray

GNOME Shell extension that displays real-time system resource usage in the top panel.

![GNOME Version](https://img.shields.io/badge/GNOME-45--49-blue)
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
gnome-extensions prefs system-monitor-tray@lsb.codes
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

#### Quick Install (using install script)

1. Clone the repository:
   ```bash
   git clone https://github.com/lsantiagoba/system-monitor-tray.git
   cd system-monitor-tray
   ```

2. Build the extension:
   ```bash
   ./build.sh
   ```

3. Install locally:
   ```bash
   ./install.sh
   ```

4. Restart GNOME Shell:
   - On X11: Press `Alt+F2`, type `r` and press Enter
   - On Wayland: Log out and log back in

#### Manual Installation

1. Copy the extension folder to your GNOME extensions directory:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsb.codes
   cp -r * ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsb.codes/
   ```

2. Restart GNOME Shell:
   - On X11: Press `Alt+F2`, type `r` and press Enter
   - On Wayland: Log out and log back in

3. Enable the extension:
   ```bash
   gnome-extensions enable system-monitor-tray@lsb.codes
   ```

   Or use the Extensions application from the applications menu.

## Uninstallation

```bash
gnome-extensions disable system-monitor-tray@lsb.codes
rm -rf ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsb.codes
```

## Technical Details

- **Update Frequency**: Indicators refresh automatically every 2 seconds
- **Data Source**: Reads from `/proc/stat`, `/proc/meminfo`, and `/proc/loadavg`
- **Performance**: Minimal CPU overhead, designed for efficiency
- **Architecture**: Modular design with separate components for better maintainability

### Project Structure

The extension uses a modular architecture for better code organization:

- **extension.js** - Main coordinator that manages the extension lifecycle
- **statReader.js** - Reads system statistics from `/proc` filesystem
- **labelFormatter.js** - Handles text formatting based on user preferences
- **systemMonitorIndicator.js** - Manages the panel UI and labels
- **prefs.js** - Extension preferences dialog

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md)

### Development

To work on the extension:

1. Edit source files in `src/v45-46-47-48-49/`
2. Run `./build.sh` to copy files to root
3. Run `./install.sh` to test locally
4. Run `./pack-extension.sh` to create distribution package

## Requirements

- GNOME Shell 45, 46, 47, 48, or 49
- Linux system with `/proc` filesystem

## Troubleshooting

### Preferences Window Shows Schema Error (Fedora/Some Distributions)

If you see an error like `Failed to open file "...schemas/gschemas.compiled"` when opening preferences:

**Root Cause**: Some distributions may not auto-compile schemas immediately after installation.

**Solutions**:

1. **Reinstall using the install script** (Recommended):
   ```bash
   ./install.sh
   ```
   The install script properly compiles schemas during installation.

2. **Manual schema compilation**:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsb.codes/schemas/
   ```

3. **If installed from extensions.gnome.org**: Try reinstalling the extension or use the `diagnose.sh` script:
   ```bash
   ./diagnose.sh
   ```

**Note**: This is a known issue on certain distributions (particularly Fedora) and doesn't affect the main extension functionality.

### Extension Not Showing After Installation

1. Make sure the extension is enabled:
   ```bash
   gnome-extensions enable system-monitor-tray@lsb.codes
   ```

2. Restart GNOME Shell:
   - X11: Press `Alt+F2`, type `r`, press Enter
   - Wayland: Log out and log back in

3. Check extension status:
   ```bash
   gnome-extensions info system-monitor-tray@lsb.codes
   ```

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

Leandro Santiago

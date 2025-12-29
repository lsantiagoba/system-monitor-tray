# System Monitor Tray

GNOME Shell extension that displays system resource usage in the top panel.

## Features

- **CPU**: Processor usage percentage
- **Memory**: RAM usage percentage
- **Swap**: Swap usage percentage
- **Load**: System average load (1 minute) in percentage and absolute value

## Installation

1. Copy the extension folder to your GNOME extensions directory:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsantiago
   cp -r * ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsantiago/
   ```

2. Restart GNOME Shell:
   - On X11: Press `Alt+F2`, type `r` and press Enter
   - On Wayland: Log out and log back in

3. Enable the extension:
   ```bash
   gnome-extensions enable system-monitor-tray@lsantiago
   ```

   Or use the Extensions application from the applications menu.

## Uninstallation

```bash
gnome-extensions disable system-monitor-tray@lsantiago
rm -rf ~/.local/share/gnome-shell/extensions/system-monitor-tray@lsantiago
```

## Updates

Indicators are automatically updated every 2 seconds.

## Requirements

- GNOME Shell 43 or higher
- Linux with `/proc` filesystem

## License

MIT

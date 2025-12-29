#!/bin/bash

# Script de desinstalación para System Monitor Tray

EXTENSION_UUID="system-monitor-tray@lsbcodes"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

# Deshabilitar la extensión
gnome-extensions disable $EXTENSION_UUID 2>/dev/null

# Eliminar archivos
if [ -d "$EXTENSION_DIR" ]; then
    rm -rf "$EXTENSION_DIR"
fi

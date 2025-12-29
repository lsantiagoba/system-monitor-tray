#!/bin/bash

# Script de instalación para System Monitor Tray

EXTENSION_UUID="system-monitor-tray@lsbcodes"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

# Crear directorio de la extensión
mkdir -p "$EXTENSION_DIR"

# Copiar archivos
cp metadata.json "$EXTENSION_DIR/"
cp extension.js "$EXTENSION_DIR/"
cp prefs.js "$EXTENSION_DIR/"
cp stylesheet.css "$EXTENSION_DIR/"

# Copiar schemas
mkdir -p "$EXTENSION_DIR/schemas"
cp schemas/*.xml "$EXTENSION_DIR/schemas/"

# Compilar schemas
glib-compile-schemas "$EXTENSION_DIR/schemas/" 2>/dev/null

gnome-extensions enable $EXTENSION_UUID 2>/dev/null

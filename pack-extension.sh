#!/bin/bash

# Script para crear el paquete .zip para subir a GNOME Extensions
# Usage: ./pack-extension.sh

EXTENSION_UUID="system-monitor-tray@lsbcodes"
PACK_DIR="pack"
OUTPUT_FILE="${EXTENSION_UUID}.shell-extension.zip"

echo "📦 Empaquetando extensión GNOME: ${EXTENSION_UUID}"
echo ""

# Limpiar directorio temporal si existe
if [ -d "$PACK_DIR" ]; then
    echo "🧹 Limpiando directorio temporal..."
    rm -rf "$PACK_DIR"
fi

# Crear directorio temporal
mkdir -p "$PACK_DIR"

# Lista de archivos a incluir
FILES=(
    "extension.js"
    "prefs.js"
    "metadata.json"
    "stylesheet.css"
    "schemas/org.gnome.shell.extensions.system-monitor-tray.gschema.xml"
)

# Copiar archivos necesarios
echo "📋 Copiando archivos..."
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        # Crear directorio si es necesario
        dir=$(dirname "$file")
        if [ "$dir" != "." ]; then
            mkdir -p "$PACK_DIR/$dir"
        fi
        cp "$file" "$PACK_DIR/$file"
        echo "  ✓ $file"
    else
        echo "  ⚠️  Advertencia: $file no encontrado"
    fi
done

# Compilar schemas si existen
if [ -d "$PACK_DIR/schemas" ]; then
    echo ""
    echo "⚙️  Compilando schemas..."
    glib-compile-schemas "$PACK_DIR/schemas/" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  ✓ Schemas compilados correctamente"
    else
        echo "  ⚠️  Advertencia: No se pudieron compilar los schemas (no es crítico para el .zip)"
    fi
fi

# Crear el archivo .zip
echo ""
echo "🗜️  Creando archivo ${OUTPUT_FILE}..."
cd "$PACK_DIR"
zip -r "../${OUTPUT_FILE}" . > /dev/null 2>&1
cd ..

if [ $? -eq 0 ]; then
    echo "  ✓ Archivo creado exitosamente"
    echo ""
    echo "📊 Información del paquete:"
    echo "  Archivo: ${OUTPUT_FILE}"
    echo "  Tamaño: $(du -h ${OUTPUT_FILE} | cut -f1)"
    echo ""
    echo "✅ ¡Listo para subir a https://extensions.gnome.org/upload/"
else
    echo "  ❌ Error al crear el archivo .zip"
    exit 1
fi

# Limpiar
rm -rf "$PACK_DIR"

echo ""
echo "📝 Pasos siguientes:"
echo "   1. Ve a https://extensions.gnome.org/upload/"
echo "   2. Sube el archivo: ${OUTPUT_FILE}"
echo "   3. Completa la información requerida"
echo "   4. Sube screenshots (mínimo 1, recomendado 3-4)"
echo "   5. Espera la revisión del equipo de GNOME"

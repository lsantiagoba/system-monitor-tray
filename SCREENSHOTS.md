# Guía para Screenshots

Para publicar en GNOME Extensions, necesitas proporcionar screenshots de tu extensión.

## Requisitos

- **Mínimo**: 1 screenshot
- **Recomendado**: 3-4 screenshots mostrando diferentes características
- **Formato**: PNG preferiblemente
- **Tamaño recomendado**: 800x600 o superior
- **Máximo**: 10 MB por imagen

## Qué Capturar

### Screenshot 1: Vista Principal (Obligatorio)
Captura la barra superior de GNOME mostrando:
- La extensión activa con los indicadores de CPU, Memory, Swap y Load
- Un fondo de escritorio limpio
- Otras extensiones deshabilitadas si es posible

### Screenshot 2: Panel de Preferencias
Captura la ventana de preferencias mostrando:
- Todas las opciones de configuración disponibles
- Las diferentes opciones de panel position, icons, bold, etc.

### Screenshot 3: Diferentes Configuraciones
Muestra la extensión con diferentes estilos:
- Con iconos vs con texto
- Diferentes posiciones del panel (left, center, right)
- Valores redondeados vs decimales

### Screenshot 4: En Uso Real
Captura durante uso real mostrando:
- Valores altos de CPU/Memory durante actividad
- Cómo se ve con diferentes temas de GNOME
- Integración con otras extensiones del sistema

## Cómo Tomar Screenshots

### Método 1: GNOME Screenshot (Recomendado)
```bash
# Captura toda la pantalla después de 3 segundos (tiempo para preparar)
gnome-screenshot -d 3 -f screenshot1.png

# Captura una ventana específica
gnome-screenshot -w -f preferences.png

# Captura un área seleccionada
gnome-screenshot -a -f custom-area.png
```

### Método 2: Usando Flameshot
```bash
# Instalar si no está disponible
sudo apt install flameshot

# Capturar y editar
flameshot gui
```

### Método 3: Tecla de impresión de pantalla
- `PrtScn` - Captura toda la pantalla
- `Alt + PrtScn` - Captura la ventana activa
- `Shift + PrtScn` - Selecciona un área

## Edición de Screenshots

Considera usar GIMP o similar para:
- Añadir anotaciones o flechas explicativas
- Asegurarte de que los colores sean representativos
- Verificar que la resolución sea adecuada
- Añadir un borde si mejora la presentación

## Consejos

1. **Limpieza**: Cierra aplicaciones innecesarias antes de capturar
2. **Consistencia**: Usa el mismo tema de GNOME en todos los screenshots
3. **Visibilidad**: Asegúrate de que el texto sea legible
4. **Realismo**: Muestra valores reales, no mockups
5. **Claridad**: Cada screenshot debe tener un propósito claro

## Donde Guardar

Guarda tus screenshots en una carpeta separada:
```bash
mkdir screenshots
```

No incluyas los screenshots en el archivo .zip de la extensión.
Los subirás por separado en el sitio web de GNOME Extensions.

## Ejemplo de Nombres

- `screenshot-main-view.png` - Vista principal
- `screenshot-preferences.png` - Panel de preferencias
- `screenshot-icons-mode.png` - Modo con iconos
- `screenshot-high-usage.png` - Durante uso intensivo

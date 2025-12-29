# Checklist para Publicación en GNOME Extensions

Esta es una lista de verificación para asegurarte de que tu extensión esté lista para publicar.

## ✅ Archivos Requeridos

- [x] `extension.js` - Código principal de la extensión
- [x] `metadata.json` - Metadatos con campos requeridos
- [x] `prefs.js` - Diálogo de preferencias (si aplica)
- [x] `stylesheet.css` - Estilos (si aplica)
- [x] `schemas/*.gschema.xml` - Schema de configuración (si aplica)
- [x] `LICENSE` - Archivo de licencia
- [x] `README.md` - Documentación completa

## ✅ metadata.json Completo

Verifica que contenga:
- [x] `name` - Nombre descriptivo
- [x] `description` - Descripción clara (no muy larga)
- [x] `uuid` - UUID único en formato correcto
- [x] `shell-version` - Versiones de GNOME soportadas
- [x] `url` - URL del repositorio GitHub
- [x] `version` - Número de versión (debe ser entero)
- [x] `settings-schema` - ID del schema (si tiene preferencias)
- [x] `gettext-domain` - Dominio para traducciones

## ✅ Preparación para Subida

- [x] El código sigue las mejores prácticas de GNOME Shell
- [x] No hay errores en los logs de GNOME Shell
- [x] La extensión se puede habilitar/deshabilitar sin problemas
- [x] Las preferencias funcionan correctamente
- [ ] Tienes al menos 1 screenshot de calidad (ver SCREENSHOTS.md)
- [ ] Tienes 3-4 screenshots mostrando diferentes características
- [ ] Has probado la extensión en todas las versiones de GNOME declaradas
- [x] El archivo LICENSE existe y es válido
- [x] El README está actualizado y es informativo

## ✅ Cuenta en GNOME Extensions

- [ ] Tienes cuenta en https://extensions.gnome.org/
- [ ] Has verificado tu email
- [ ] Conoces las [directrices de revisión](https://extensions.gnome.org/review-guidelines/)

## 📦 Proceso de Empaquetado

1. Ejecuta el script de empaquetado:
   ```bash
   ./pack-extension.sh
   ```

2. Verifica que se creó el archivo `.zip`:
   ```bash
   ls -lh system-monitor-tray@lsbcodes.shell-extension.zip
   ```

3. Prueba el .zip antes de subir (opcional pero recomendado):
   ```bash
   gnome-extensions install system-monitor-tray@lsbcodes.shell-extension.zip --force
   gnome-extensions enable system-monitor-tray@lsbcodes
   ```

## 🚀 Proceso de Subida

1. Ve a https://extensions.gnome.org/upload/
2. Sube el archivo `.zip` generado
3. Completa la información:
   - Nombre de la extensión
   - Descripción
   - Categoría (selecciona la más apropiada)
   - Licencia (MIT)
4. Sube los screenshots (arrastra y suelta)
5. Revisa toda la información
6. Envía para revisión

## ⏳ Después de Enviar

- La revisión puede tomar entre unos días y varias semanas
- Recibirás un email cuando sea revisada
- Pueden pedirte cambios antes de aprobarla
- Una vez aprobada, aparecerá en extensions.gnome.org

## 🔄 Actualizaciones Futuras

Para publicar nuevas versiones:
1. Actualiza el campo `version` en `metadata.json` (debe incrementar)
2. Ejecuta `./pack-extension.sh` de nuevo
3. Ve a tu extensión en extensions.gnome.org
4. Sube la nueva versión
5. Describe los cambios en el changelog

## 📚 Recursos Útiles

- [GNOME Extensions](https://extensions.gnome.org/)
- [Review Guidelines](https://extensions.gnome.org/review-guidelines/)
- [GNOME Shell Extensions Documentation](https://gjs.guide/extensions/)
- [Your Extensions Dashboard](https://extensions.gnome.org/accounts/profile/)

## 💡 Consejos

- **Responde rápido** a los comentarios de los revisores
- **Mantén actualizado** el repositorio de GitHub
- **Documenta bien** los cambios en cada versión
- **Prueba exhaustivamente** antes de cada subida
- **Sé paciente** con el proceso de revisión

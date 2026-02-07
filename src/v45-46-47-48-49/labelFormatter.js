export class LabelFormatter {

    constructor(settings) {
        this._settings = settings;
    }

    formatText(label, value, iconChar = '') {
        const boldLabels = this._settings.get_boolean('bold-labels');
        const boldPercentages = this._settings.get_boolean('bold-percentages');
        const showIcons = this._settings.get_boolean('show-icons');
        const consistentSpacing = this._settings.get_boolean('consistent-spacing');

        let text = '';
        
        if (showIcons && iconChar) {
            text = iconChar + ' ';
        } else {
            text = boldLabels ? `<b>${label}</b> ` : `${label} `;
        }

        // Apply fixed-width formatting if consistent spacing is enabled
        let formattedValue = value;
        if (consistentSpacing) {
            formattedValue = this._padValue(value);
        }

        text += boldPercentages ? `<b>${formattedValue}</b>` : formattedValue;
        return text;
    }

    formatPercentage(value) {
        const roundValues = this._settings.get_boolean('round-values');
        return roundValues ? Math.round(value).toString() : value.toFixed(1);
    }

    _padValue(value) {
        // Pad numeric values to ensure consistent width (handles both percentage and decimal values)
        const str = value.toString();
        // For percentages like "5.0%" or "100%", pad to ensure consistent width
        // Assumes max value is 3 digits + potential decimal (e.g., "100.0%" or "100%")
        const hasDecimal = str.includes('.');
        const parts = str.split('%');
        const numPart = parts[0];

        // Right-align numbers by padding with spaces on the left
        // Assumes max width of "100.0" (5 chars) or "100" (3 chars)
        const targetWidth = hasDecimal ? 5 : 3;
        const paddedNum = numPart.padStart(targetWidth, ' ');

        return paddedNum + (parts[1] !== undefined ? '%' : '');
    }
}

export class LabelFormatter {

    constructor(settings) {
        this._settings = settings;
    }

    formatText(label, value) {
        const boldLabels = this._settings.get_boolean('bold-labels');
        const boldPercentages = this._settings.get_boolean('bold-percentages');
        const showIcons = this._settings.get_boolean('show-icons');
        const consistentSpacing = this._settings.get_boolean('consistent-spacing');
        
        let text = showIcons
            ? ''
            : boldLabels ? `<b>${label}</b> ` : `${label} `;
        
        const formattedValue = consistentSpacing
            ? this._padPercentage(value)
            : value;

        text += boldPercentages ? `<b>${formattedValue}</b>` : formattedValue;
        return text;
    }

    formatPercentage(value) {
        const roundValues = this._settings.get_boolean('round-values');
        return roundValues ? Math.round(value).toString() : value.toFixed(1);
    }

    _padPercentage(value) {
        const configuredWidth = this._settings.get_int('fixed-width');
        const width = configuredWidth ||
            (this._settings.get_boolean('round-values') ? 3 : 5);
        return value.replace(/^(\d+(?:\.\d+)?)%/, (match, number) =>
            `${number.padStart(width, ' ')}%`);
    }
}

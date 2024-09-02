// Create the translation object if it doesn't exist
if (!window.I18n) {
    window.I18n = {};
}

window.I18n = {
    ...window.I18n,

    // The current locale of the user
    locale: 'fr',

    // The translations object (dynamically loaded)
    translations: {...window.translations},

    // The function that returns the translation of a key
    translate: function (key) {
        return this.translations[this.locale][key] || key;
    },

    // The function that translates all elements with the `data-i18n` attribute
    translateDocument: function () {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function (element) {
            const translationKey = element.getAttribute('data-i18n');
            const translatedText = window.I18n.translate(translationKey);
            if (element.tagName.toLowerCase() === 'img') {
                element.alt = translatedText;
            } else {
                element.textContent = translatedText;
            }
        });

        // updates the lang attribute of the `html` element
        document.documentElement.lang = window.I18n.locale;
    }
}

/**
 * This function is called when the page is loaded.
 * It installs an event listener on the language select element.
 * It sets the locale to the stored locale if it exists.
 * It also translates all elements with the data-i18n attribute.
 */
document.addEventListener("DOMContentLoaded", function () {

    // Get the language from localStorage or use the default language
    window.I18n.locale = localStorage.getItem('language') || 'fr';

    // Update the language when the user selects a new language
    document.getElementById("language-select").addEventListener("change", function (e) {
        window.I18n.locale = this.value;
        localStorage.setItem("language", window.I18n.locale);
        window.I18n.translateDocument();
    });

    // Translate the document when the page is loaded
    window.I18n.translateDocument();

    // Update the language select element to the current language
    document.getElementById("language-select").value = window.I18n.locale;

});

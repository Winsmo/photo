# Internationalisation d’un site web statique avec JavaScript

## Introduction

Pour rendre un site web accessible à un public international, il est essentiel de permettre aux utilisateurs
de choisir la langue dans laquelle ils souhaitent naviguer.
La méthode la plus courante consiste à utiliser une liste déroulante pour sélectionner la langue.
Lorsque l’utilisateur change de langue, le contenu de la page est immédiatement mis à jour avec les textes traduits.
Pour garantir une expérience fluide, la langue choisie doit être conservée d’une page à l’autre.

## Mise en œuvre

### Moteur de traduction et stockage des traductions

Voici les étapes clefs :

- Utiliser les codes de langue internationaux : "fr", "en", "de"…

- Créer un fichier JavaScript par langue contenant un dictionnaire de traductions, où les clefs sont des identifiants
  de texte et les valeurs les traductions correspondantes.

- Stocker la langue en cours et les traductions dans un objet global `I18n` accessible depuis le document.

- Créer une fonction `translate` prenant un identifiant et retournent la traduction en fonction de la langue en cours.

- Créer une fonction `translateDocument` permettant de traduire toutes les balises ayant un attribut `data-i18n`.

Ces étapes permettent de mettre en place un mécanisme de traduction simple.

Exemple d’objet `I18n` :

```javascript
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
};
```

> NOTE : l’attribut `data-i18n` est un attribut HTML personnalisé qui permet d’identifier les éléments à traduire.

### Balisage HTML

Pour traduire le contenu HTML, il suffit d’ajouter un attribut `data-i18n` aux balises qui doivent être traduites.
Cet attribut contient l’identifiant du texte à traduire.

Exemple :

```html
<h1 data-i18n="page.title.home">Home Page</h1>
<p data-i18n="page.text.welcome">Welcome to our website!</p>
```

Cette approche permet d’identifier facilement les éléments à traduire et de les mettre à jour dynamiquement.

### Sélection de la langue

Pour permettre à l’utilisateur de choisir la langue, il est possible d’utiliser une liste déroulante.

Exemple de liste déroulante :

```html
<label for="language-select" data-i18n="header.language">Langue</label>
<select id="language-select">
    <option value="fr">🇫🇷 Français</option>
    <option value="en">🇬🇧 English</option>
    <option value="de">🇩🇪 Deutsch</option>
</select>
```

> NOTE : L’utilisation d’emojis pour les drapeaux permet d’éviter d’utiliser des images.
> Les emojis sont plus légers et s’adaptent automatiquement à la taille du texte.

Un gestionnaire d’événements "change" doit être ajouté au `select` pour traduire la page lorsque la langue est modifiée.

### Persistance de la langue

Dans le cas d’un site web dynamique, la langue choisie par l’utilisateur devrait être stockée dans une base de données.
Mais pour un site web statique, il est possible de stocker la langue dans le `localStorage` du navigateur,
ce qui permet de conserver la langue choisie d’une page à l’autre.

Exemple de gestion de la langue :

```javascript
// Get the language from localStorage or use the default language
window.I18n.locale = localStorage.getItem('language') || 'fr';

// Update the language when the user selects a new language
document.getElementById("language-select").addEventListener("change", function (e) {
    window.I18n.locale = this.value;
    localStorage.setItem("language", window.I18n.locale);
    window.I18n.translateDocument();
});
```

Les fonctions `localStorage.getItem` et `localStorage.setItem` permettent de stocker et récupérer la langue choisie
par l’utilisateur dans le navigateur.

### Chargement des traductions

Les traductions peuvent être chargées simplement en ajoutant un script pour chaque langue.

Exemple de chargement des traductions :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  ...
  <title data-i18n="page.title.foo">Foo Page</title>
  <script src="../js/locales/i18n.js"></script>
  <script src="../js/locales/fr.js"></script>
  <script src="../js/locales/en.js"></script>
  <script src="../js/locales/de.js"></script>
</head>
<body>
<h1 data-i18n="page.title.home">Home Page</h1>
<p data-i18n="page.text.welcome">Welcome to our website!</p>
</body>
</html>
```

Tous les fichiers HTML doivent inclure le fichier `i18n.js` qui contient l’objet `I18n` et les traductions par langue.

### Traduction du document au chargement

Pour traduire le document au chargement de la page, il suffit d’appeler la fonction `translateDocument`.
Cela se fait en ajoutant un gestionnaire d’événements "DOMContentLoaded" sur l’objet `document`.

Exemple de traduction du document :

```javascript
document.addEventListener("DOMContentLoaded", function () {
    // Translate the document when the page is loaded
    window.I18n.translateDocument();

    // Update the language select element to the current language
    document.getElementById("language-select").value = window.I18n.locale;

});
```

La traduction doit se faire lorsque la page est entièrement chargée pour éviter les problèmes d’affichage.

## Conclusion

La mise en place d’un système de traduction pour un site web statique est relativement simple.
Il suffit de suivre les étapes décrites ci-dessus pour permettre aux utilisateurs de naviguer dans leur langue préférée.
La persistance de la langue dans le `localStorage` garantit une expérience utilisateur cohérente d’une page à l’autre.

Pour ajouter une nouvelle langue, par exemple l’espagnol, il suffit de créer un fichier `es.js` contenant
les traductions et de l’importer dans le fichier HTML, et d’ajouter une option dans la liste déroulante.

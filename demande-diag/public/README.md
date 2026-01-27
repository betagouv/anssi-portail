# Installation

## WordPress

Copier les fichiers `demande-diag.css`, `demande-diag.iife.js` et `demande-diag.php` dans le répertoire
`wp-content/themes/<votre-thème>/lab-anssi` de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/demande-diag.php' );
```

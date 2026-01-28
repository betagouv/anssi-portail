# Installation

## WordPress

Télécharger le fichier `demande-diag.php` ici :
https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0/prod/demande-diag.php

Copier le fichier `demande-diag.php` dans le répertoire `wp-content/themes/<votre-thème>/lab-anssi`
de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/demande-diag.php' );
```

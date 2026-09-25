# Installation

## WordPress

Télécharger le fichier `mini-test-maturite.php` en fonction de l'envrionnement cible :

<details>
<summary>Démo</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/mini-test-maturite.php

</details>

<details open>
<summary>Prod</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/mini-test-maturite.php

</details>

Copier le fichier `mini-test-maturite.php` dans le répertoire `wp-content/themes/<votre-thème>/lab-anssi`
de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/mini-test-maturite.php' );
```

## Intégration dans les pages HTML

```html
<lab-anssi-mini-test-maturite></lab-anssi-mini-test-maturite>
```

# Installation

## WordPress

Télécharger le fichier `mini-test-expostion.php` en fonction de l'envrionnement cible :

<details>
<summary>Démo</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.1.2/demo/mini-test-expostion.php

</details>

<details open>
<summary>Prod</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.1.2/prod/mini-test-expostion.php

</details>

Copier le fichier `mini-test-expostion.php` dans le répertoire `wp-content/themes/<votre-thème>/lab-anssi`
de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/mini-test-expostion.php' );
```

## Intégration dans les pages HTML

```html
<lab-anssi-mini-test-expostion></lab-anssi-mini-test-expostion>
```

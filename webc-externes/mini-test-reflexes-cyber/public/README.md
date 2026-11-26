# Installation

## WordPress

Télécharger le fichier `mini-test-reflexes-cyber.php` en fonction de l’environnement cible :

<details>
<summary>Démo</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/mini-test-reflexes-cyber.php

</details>

<details open>
<summary>Prod</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/mini-test-reflexes-cyber.php

</details>

Copier le fichier `mini-test-reflexes-cyber.php` dans le répertoire `wp-content/themes/<votre-thème>/lab-anssi`
de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/mini-test-reflexes-cyber.php' );
```

## Intégration dans les pages HTML

Sur un site sans WordPress, charger `dsfr-variables.css` et `lab-anssi-ui-kit.iife.js` du kit UI, puis
`mini-test-reflexes-cyber.css` et `mini-test-reflexes-cyber.iife.js` de l’environnement cible.

Insérer ensuite le composant à l’emplacement souhaité.

```html
<lab-anssi-mini-test-reflexes-cyber></lab-anssi-mini-test-reflexes-cyber>
```

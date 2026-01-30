# Installation

## WordPress

Télécharger le fichier `demande-diag.php` en fonction de l'envrionnement cible :

<details>
<summary>Démo</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/demande-diag.php

</details>

<details open>
<summary>Prod</summary>

> https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/demande-diag.php

</details>

Copier le fichier `demande-diag.php` dans le répertoire `wp-content/themes/<votre-thème>/lab-anssi`
de votre installation WordPress.

Ouvrir le fichier `wp-content/themes/<votre-thème>/functions.php` et ajouter cette ligne à la fin :

```php
require_once( get_stylesheet_directory() . '/lab-anssi/demande-diag.php' );
```

## Intégration dans les pages HTML

```html
<lab-anssi-demande-diagnostic></lab-anssi-demande-diagnostic>
```

Pour ajouter un SIRET d’aidant, utile pour flécher la demande d’aide :

```html
<lab-anssi-demande-diagnostic siret-aidant="01234..."></lab-anssi-demande-diagnostic>
```

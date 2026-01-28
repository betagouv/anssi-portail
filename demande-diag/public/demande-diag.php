<?php

function ajouter_assets_demande_diag() {
    wp_enqueue_style(
        'lab-anssi-ui-kit-styles', 
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/<VERSION_UI_KIT>/dsfr-variables.css', 
        '', 
        '1.0', 
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-ui-kit-script',
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/<VERSION_UI_KIT>/lab-anssi-ui-kit.iife.js',
        array(),
        null,
        true
    );
    wp_enqueue_style(
        'lab-anssi-demande-diag-styles', 
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/demande-diag.css',
        '', 
        '1.0', 
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-demande-diag-script',
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/demande-diag.iife.js',
        array(),
        null,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ajouter_assets_demande_diag' );

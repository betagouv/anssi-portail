<?php

function ajoute_assets() {
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
        'lab-anssi-mini-test-maturite-styles',
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/mini-test-maturite.css',
        '',
        '1.0',
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-mini-test-maturite-script',
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/mini-test-maturite.iife.js',
        array(),
        null,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ajoute_assets' );

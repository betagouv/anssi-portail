<?php

function lab_anssi_ajoute_assets_mini_test_reflexes_cyber() {
    wp_enqueue_style(
        'lab-anssi-ui-kit-styles',
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/<VERSION_UI_KIT>/dsfr-variables.css',
        array(),
        '<VERSION_UI_KIT>',
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-ui-kit-script',
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/<VERSION_UI_KIT>/lab-anssi-ui-kit.iife.js',
        array(),
        '<VERSION_UI_KIT>',
        true
    );
    wp_enqueue_style(
        'lab-anssi-mini-test-reflexes-cyber-styles',
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/mini-test-reflexes-cyber.css',
        array( 'lab-anssi-ui-kit-styles' ),
        '<VERSION>',
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-mini-test-reflexes-cyber-script',
        'https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/<VERSION>/<ENV>/mini-test-reflexes-cyber.iife.js',
        array( 'lab-anssi-ui-kit-script' ),
        '<VERSION>',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'lab_anssi_ajoute_assets_mini_test_reflexes_cyber' );

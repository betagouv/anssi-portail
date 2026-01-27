<?php

function ajouter_assets_demande_diag() {
    wp_enqueue_style(
        'lab-anssi-ui-kit-styles', 
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/1.36.1/dsfr-variables.css', 
        '', 
        '1.0', 
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-ui-kit-script',
        'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/1.36.1/lab-anssi-ui-kit.iife.js',
        array(),
        null,
        true
    );
    wp_enqueue_style(
        'lab-anssi-demande-diag-styles', 
        get_stylesheet_directory_uri() . '/lab-anssi/demande-diag.css', 
        '', 
        '1.0', 
        'screen'
    );
    wp_enqueue_script(
        'lab-anssi-demande-diag-script',
        get_stylesheet_directory_uri() . '/lab-anssi/demande-diag.iife.js',
        array(),
        null,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ajouter_assets_demande_diag' );

add_action('rest_api_init', function () {
    register_rest_route('demande-diag', '/annuaire/organisations', array(
        'methods' => 'GET',
        'callback' => 'appelle_annuaire_msc',
        'permission_callback' => '__return_true', // public
    ));
    register_rest_route('demande-diag', '/mon-aide-cyber/demandes-aide', array(
        'methods' => 'POST',
        'callback' => 'traiter_demande_aide',
        'permission_callback' => '__return_true', // public
    ));
});

function appelle_annuaire_msc(WP_REST_Request $request) {
    $params = $request->get_query_params();
    $url = 'https://lab-anssi-msc-demo.cleverapps.io/api/annuaire/organisations?' . http_build_query($params);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);
    return wp_send_json($data);
}

function traiter_demande_aide(WP_REST_Request $request) {
    $params = $request->get_json_params(); 
    $email = $params['entiteAidee']['email'] ?? ''; 
    $departement = $params['entiteAidee']['departement'] ?? ''; 
    $raisonSociale = $params['entiteAidee']['raisonSociale'] ?? ''; 
    $siret = $params['entiteAidee']['siret'] ?? ''; 
    $validationCGU = $params['validationCGU'] ?? '';

    $payload = json_encode([
        'entiteAidee' => json_encode([
            'email' => $email,
            'departement' => $departement,
            'raisonSociale' => $raisonSociale,
            'siret' => $siret,
        ]), 
        'validationCGU' => $validationCGU,
    ]);

    $url = 'https://lab-anssi-msc-demo.cleverapps.io/api/mon-aide-cyber/demandes-aide';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [ 'Content-Type: application/json', 'Content-Length: ' . strlen($payload) ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return new WP_Error('api_error', 'Erreur lors de l’appel à l’API externe : ' . $error, ['status' => 500]);
    }

    return [
        'status' => 'relay_success',
        'code_api_externe' => $http_code, 
        'reponse_api_externe' => json_decode($response, true),
    ];
}

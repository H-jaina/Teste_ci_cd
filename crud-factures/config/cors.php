<?php

return [

    'paths' => ['api/*', 'facture/telecharger/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'], // Ou ['http://localhost:3000'] pour sécuriser plus tard

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];

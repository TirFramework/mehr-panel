<?php

return [
    'panel' => [
        'prefix' => array_filter(explode(',', env('MEHR_PANEL_PREFIX', 'admin'))),
    ],
];

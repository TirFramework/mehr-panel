<?php

use Illuminate\Support\Facades\Route;
use Tir\MehrPanel\Controllers\AdminPanelController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your module. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

// Add web middleware for use Laravel feature
Route::group(['middleware' => 'web'], function () {
    $prefixes = config('mehr-panel.panel.prefix', ['admin']);

    foreach ($prefixes as $prefix) {
        Route::group(['prefix' => $prefix], function () use( $prefix ) {
            Route::view('/{path?}', 'mehr-panel::dashboard')
                ->where('path', '.*')
                ->name('react.' . $prefix);
        });
    };
});

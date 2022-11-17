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
    //add admin prefix and middleware for admin area to product package
    Route::group(['prefix' => 'admin'], function () {
        Route::view('/{path?}', 'mehr-panel::dashboard')
            ->where('path', '.*')
            ->name('react');
    });
});


// Add api middleware for use Laravel feature
Route::group(['middleware' => 'auth:api', 'prefix' => 'api/v1'], function () {

    //Add admin prefix and middleware for admin area to user module
    Route::group(['prefix' => 'admin', 'middleware' => 'IsAdmin'], function () {
        Route::get('/mehr-panel', [AdminPanelController::class, 'general']);
    });
});
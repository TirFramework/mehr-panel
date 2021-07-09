<?php

namespace Tir\FirstPanel;


use Illuminate\Support\ServiceProvider;
use Tir\FirstPanel\Services\AdminMenu;

class MehrPanelServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */

    public function register()
    {
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        $this->loadRoutesFrom(__DIR__.'/Routes/web.php');

        $this->loadViewsFrom(__DIR__.'/Resources/Views', 'first-panel');

        $this->loadTranslationsFrom(__DIR__ . '/Resources/Lang/', 'first-panel');

        $this->publishes([
            __DIR__ . '/public/adminpanel' => public_path('adminpanel'),
        ], 'first-panel');


    }

}

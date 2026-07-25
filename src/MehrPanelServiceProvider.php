<?php

namespace Tir\MehrPanel;


use Illuminate\Support\ServiceProvider;
use Tir\MehrPanel\Console\MergePackageJsonCommand;

class MehrPanelServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */

    public function register()
    {

        $this->mergeConfigFrom(
            __DIR__ . '/config/mehr-panel.php',
            'mehr-panel'
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {

        if ($this->app->runningInConsole()) {
            $this->commands([MergePackageJsonCommand::class]);
        }

        $this->loadRoutesFrom(__DIR__ . '/Routes/web.php');

        $this->loadViewsFrom(__DIR__ . '/Resources/Views', 'mehr-panel');

        // $this->loadTranslationsFrom(__DIR__ . '/Resources/Lang/', 'first-panel');

        $this->publishes([
            __DIR__ . '/react' => base_path('resources/admin/'),
            __DIR__ . '/vite.config.js' => base_path('vite.config.js'),
            __DIR__ . '/vite-helpers.js' => base_path('vite-helpers.js'),
            __DIR__ . '/public' => base_path('public'),
        ], 'mehr-panel');

        $this->publishes([
            __DIR__ . '/custom.css' => base_path('resources/admin/src/assets/custom.css'),
            __DIR__ . '/dashboard.jsx' => base_path('resources/admin/src/dynamic-pages/dashboard.jsx'),
            __DIR__ . '/CustomTopHeader.jsx' => base_path('resources/admin/src/dynamic-layouts/CustomTopHeader.jsx'),
        ], 'mehr-panel-customize');

        $this->publishes([
            __DIR__ . '/config/mehr-panel.php' => config_path('mehr-panel.php'),
        ], 'mehr-panel-config');
    }
}

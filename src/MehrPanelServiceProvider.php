<?php

namespace Tir\MehrPanel;


use Illuminate\Support\ServiceProvider;

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

        $this->loadRoutesFrom(__DIR__ . '/Routes/web.php');

        $this->loadViewsFrom(__DIR__ . '/Resources/Views', 'mehr-panel');

        // $this->loadTranslationsFrom(__DIR__ . '/Resources/Lang/', 'first-panel');

        $this->publishes([
            __DIR__ . '/react' => base_path('resources/admin/'),
            __DIR__ . '/package.json' => base_path('package.json'),
            __DIR__ . '/webpack.mix.js' => base_path('webpack.mix.js'),
            __DIR__ . '/tailwind.config.js' => base_path('tailwind.config.js'),
            __DIR__ . '/public' => base_path('public'),

        ], 'mehr-panel');

        $this->publishes([
            __DIR__ . '/custom.scss' => base_path('resources/admin/src/assets/custom.scss'),

        ], 'mehr-panel-customize');
    }
}

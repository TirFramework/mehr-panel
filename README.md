# Mehr Panel

A Laravel package for managing an admin panel.

## Installation

1. Install the package via Composer:

   ```bash
   composer require mehr-panel/mehr-panel
   ```

   or for update

   ```bash
   composer require tir/mehr-panel:12.8.1
   ```

2. Publish the configuration file (optional, to customize prefixes):

   ```bash
   php artisan vendor:publish --tag=mehr-panel-config
   ```

3. Publish assets:

   ```bash
   php artisan vendor:publish --tag=mehr-panel --force
   ```

4. Publish customization files (optional):

   ```bash
   php artisan vendor:publish --tag=mehr-panel-customize
   ```

5. Install frontend dependencies:

   ```bash
   npm install
   ```

6. Build assets for production:
   ```bash
   npm run build
   ```

## Configuration

To customize the URL prefixes for the admin panel, you can either:

- Edit the `config/mehr-panel.php` file after publishing it.
- Set the `MEHR_PANEL_PREFIX` environment variable in your `.env` file.

Example in `.env`:

```env
MEHR_PANEL_PREFIX=admin,dashboard
```

This will make the admin panel accessible at both `/admin` and `/dashboard`. If not set, the default prefix is `admin`.

### Configuration File

The `config/mehr-panel.php` file contains:

```php
<?php
return [
    'panel' => [
        'prefix' => array_filter(explode(',', env('MEHR_PANEL_PREFIX', 'admin'))),
    ],
];
```

## Customization

To override styles, create a `custom.scss` file in the `/admin/assets/` directory after publishing assets.

## Routes

The admin panel is accessible at `/{prefix}` for each prefix defined in the `panel.prefix` array (default: `admin`). For example, if `MEHR_PANEL_PREFIX=admin,dashboard` is set in `.env`, the admin panel will be available at both `/admin` and `/dashboard`.

<?php

namespace Tir\MehrPanel\Console;

use Illuminate\Console\Command;

class MergePackageJsonCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mehr-panel:merge-package {--override : Override existing values in the application package.json}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Merge the package package.json into the application package.json.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $packagePath = __DIR__ . '/../package.json';
        $applicationPath = base_path('package.json');

        if (! file_exists($packagePath)) {
            $this->error('The package package.json file could not be found.');

            return static::FAILURE;
        }

        if (! file_exists($applicationPath)) {
            $this->warn('Application package.json not found. A new file will be created.');

            file_put_contents($applicationPath, file_get_contents($packagePath));

            $this->info('Created package.json at: ' . $applicationPath);

            return static::SUCCESS;
        }

        $packageJson = json_decode(file_get_contents($packagePath), true);
        $applicationJson = json_decode(file_get_contents($applicationPath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Unable to decode JSON: ' . json_last_error_msg());

            return static::FAILURE;
        }

        if (! is_array($packageJson) || ! is_array($applicationJson)) {
            $this->error('The package.json files do not contain valid JSON objects.');

            return static::FAILURE;
        }

        $override = $this->option('override');
        $conflicts = [];

        $sectionsToMerge = [
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'optionalDependencies',
            'scripts',
            'resolutions',
        ];

        foreach ($sectionsToMerge as $section) {
            if (! isset($packageJson[$section])) {
                continue;
            }

            $currentValues = $applicationJson[$section] ?? [];

            if (! is_array($currentValues)) {
                $currentValues = [];
            }

            foreach ($packageJson[$section] as $key => $value) {
                if (isset($currentValues[$key]) && $currentValues[$key] !== $value && ! $override) {
                    $conflicts[$section][$key] = [
                        'application' => $currentValues[$key],
                        'package' => $value,
                    ];

                    continue;
                }

                $currentValues[$key] = $value;
            }

            ksort($currentValues);

            $applicationJson[$section] = $currentValues;
        }

        file_put_contents(
            $applicationPath,
            json_encode($applicationJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL
        );

        $this->info('package.json files merged successfully.');

        if (! empty($conflicts) && ! $override) {
            $this->warn('Conflicts detected. Existing values were kept. Use --override to replace them with the package values.');

            foreach ($conflicts as $section => $items) {
                $this->warn('Section: ' . $section);

                foreach ($items as $dependency => $values) {
                    $this->line(sprintf(
                        '  %s => application: %s | package: %s',
                        $dependency,
                        $values['application'],
                        $values['package']
                    ));
                }
            }
        }

        return static::SUCCESS;
    }
}



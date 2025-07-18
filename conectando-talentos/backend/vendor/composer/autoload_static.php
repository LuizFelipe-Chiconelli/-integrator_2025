<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit89bb691d10d883d891a5f02e9eb38e47
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'Core\\' => 5,
        ),
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Core\\' => 
        array (
            0 => __DIR__ . '/../..' . '/core',
        ),
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/app',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit89bb691d10d883d891a5f02e9eb38e47::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit89bb691d10d883d891a5f02e9eb38e47::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit89bb691d10d883d891a5f02e9eb38e47::$classMap;

        }, null, ClassLoader::class);
    }
}

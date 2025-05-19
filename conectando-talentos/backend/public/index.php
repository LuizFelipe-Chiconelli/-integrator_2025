<?php

use Core\Library\Ambiente;
use Core\Library\Routes;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../core/Helper/utilits.php';
require_once __DIR__ . '/../app/Config/Constants.php';

$ambiente = new Ambiente();
$ambiente->load();

$routes = new Routes();
$routes->rota();

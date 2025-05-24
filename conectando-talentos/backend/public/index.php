<?php

use Core\Library\Ambiente;
use Core\Library\Routes;

/* --- Cabeçalhos CORS: permitem que o React (localhost:5173) chame a API --- */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

/* Pré-requisição (OPTIONS) – devolvemos “204 No Content” e saímos */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* Sempre responder JSON (evita undefined no front) */
header('Content-Type: application/json; charset=utf-8');

/* Autoload do Composer + helpers + constantes */
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../core/Helper/utilits.php';
require_once __DIR__ . '/../app/Config/Constants.php';

/* Carrega variáveis do .env */
(new Ambiente)->load();

/* Dispara o roteador (lê a URL, encontra o Controller / método) */
Routes::rota();

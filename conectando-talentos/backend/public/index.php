<?php
use Core\Library\Ambiente;
use Core\Library\Routes;

/* ---------- onde os cookies serão gravados ---------- */
$sessionDir = __DIR__.'/../storage/sessions';
is_dir($sessionDir) || mkdir($sessionDir, 0777, true);

/* -----------------------------------------------------
 *  Defina o *cookie* **antes** de chamar session_start()
 * ----------------------------------------------------*/
session_set_cookie_params([
    'lifetime' => 0,         // até fechar o navegador
    'path'     => '/',       // vale para toda a app
    /*  NÃO coloque domain aqui em dev;
        deixe o browser assumir o host para
        evitar conflito entre portas.        */
    'secure'   => false,     // true em produção HTTPS
    'httponly' => true,
    'samesite' => 'Lax'      // Lax = OK para mesma origem
]);

/*  Cria ou retoma sessão para TODAS as requisições.
    Como o PHP só grava se algo mudar, o overhead é mínimo.
----------------------------------------------------------------------------*/
session_start();
/*----------------------------------------------------------------------------*/

/* ---------- CORS ---------- */
$origem     = $_SERVER['HTTP_ORIGIN'] ?? '';
$permitidos = [
    'http://integrador:5173',
    'http://localhost:5173'
];
if (in_array($origem, $permitidos, true)) {
    header("Access-Control-Allow-Origin: $origem");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); exit;
}

require __DIR__.'/../vendor/autoload.php';
require __DIR__.'/../core/Helper/utilits.php';
require __DIR__.'/../app/Config/Constants.php';

(new Ambiente)->load();
Routes::rota();

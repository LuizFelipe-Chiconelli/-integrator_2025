<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

/**
 * End-points somente leitura da tabela Cidade.
 */
class Cidade extends ControllerMain
{
    /** Métodos acessíveis sem sessão */
    public const PUBLIC_ACTIONS = ['lista'];

    /**
     * GET /cidade/lista/(UF opcional)
     * Ex.: /cidade/lista           → todas
     *       /cidade/lista/MG       → só MG
     */
    // app/Controller/Cidade.php
    public function lista(string $uf = ''): void
    {
    $dados = $this->loadModel('Cidade')
                  ->lista('cidade', 'ASC', $uf ?: null);

    \Core\Library\Response::json([
        'status'  => 200,
        'cidades' => array_map(fn($c) => [
            'id'   => $c['cidade_id'],
            'nome' => $c['cidade'],
            'uf'   => $c['uf']               // ← agora vem a UF
        ], $dados)
    ]);
    }


}

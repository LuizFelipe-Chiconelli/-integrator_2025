<?php
namespace App\Model;

use Core\Library\ModelMain;

class TelefoneModel extends ModelMain
{
    protected $table      = 'telefone';
    protected $primaryKey = 'telefone_id';

    /** Insere e devolve a PK */
    public function inserir(array $dados): int
    {
        return $this->db->insert($dados);
    }
}

<?php
namespace App\Model;

use Core\Library\ModelMain;

class CategoriaEstabelecimentoModel extends ModelMain
{
    protected $table      = "categoria_estabelecimento";
    protected $primaryKey = "categoria_estabelecimento_id";

    /**
     * Cria a ligação empresa ↔ categoria.
     * @return int  PK gerada (0 se falhar) 
     */
    public function vincular(int $estabId, int $catId): int
    {
        return $this->db->insert([
            'estabelecimento_id' => $estabId,
            'categoria_id'       => $catId
        ]);
    }
}

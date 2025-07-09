<?php
namespace App\Model;

use Core\Library\ModelMain;

class CidadeModel extends ModelMain
{
    protected $table      = 'cidade';
    protected $primaryKey = 'cidade_id';

    /** busca simples pelo PK */
    public function findById(int $id): ?array          // ← NOVO
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->first();               // devolve array | null
    }

    /** lista (já existia) */
    public function lista($orderby = 'cidade', $direction = 'ASC', $uf = null)
    {
        $query = $this->db->orderBy($orderby, $direction);
        if ($uf) {
            $query->where('uf', $uf);
        }
        return $query->findAll();
    }
}

<?php
namespace App\Model;

use Core\Library\ModelMain;

class PessoaFisicaModel extends ModelMain
{
    protected $table      = 'pessoa_fisica';
    protected $primaryKey = 'pessoa_fisica_id';

    /*--- INSERT simples já existe? Se não, crie ---*/
    public function inserir(array $data): int
    {
        return $this->db->insert($data);
    }

    /*--- ✅ Novo: updateById ---*/
    public function updateById(int $id, array $data): int
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->update($data);           // devolve nº linhas alteradas
    }

    public function findById(int $id): ?array
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->first();
    }
}

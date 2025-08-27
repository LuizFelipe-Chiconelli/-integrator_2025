<?php
namespace App\Model;

use Core\Library\ModelMain;

class CurriculumQualificacaoModel extends ModelMain
{
    protected $table      = 'curriculum_qualificacao';
    protected $primaryKey = 'curriculum_qualificacao_id';

    /** lista por curriculum_id */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_id', $curriculumId)
            ->orderBy('ano', 'DESC')
            ->orderBy('mes', 'DESC')
            ->findAll();
    }

    /** cria e devolve o id inserido */
    public function create(array $data): int
    {
        return (int) $this->db->table($this->table)->insert($data);
    }

    /** atualiza pelo id; retorna linhas afetadas */
    public function updateById(int $id, array $data): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($data);
    }

    /** exclui pelo id; retorna linhas afetadas */
    public function deleteById(int $id): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}

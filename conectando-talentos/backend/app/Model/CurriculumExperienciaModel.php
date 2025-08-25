<?php
namespace App\Model;

use Core\Library\ModelMain;

class CurriculumExperienciaModel extends ModelMain
{
    protected $table      = 'curriculum_experiencia';
    protected $primaryKey = 'curriculum_experiencia_id';

    /** lista por currículo */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_id', $curriculumId)
            ->orderBy('inicioAno', 'DESC')
            ->orderBy('inicioMes', 'DESC')
            ->findAll();
    }

    /** busca por id */
    public function findById(int $id): ?array
    {
        $row = $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->first();
        return $row ?: null;
    }

    /** cria e retorna o id inserido */
    public function create(array $data): int
    {
        return (int) $this->db->table($this->table)->insert($data);
    }

    /** atualiza por id (linhas afetadas) */
    public function updateById(int $id, array $data): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($data);
    }

    /** exclui por id (linhas afetadas) */
    public function deleteById(int $id): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}

<?php
namespace App\Model;

use Core\Library\ModelMain;

class CurriculumExperienciaModel extends ModelMain
{
    protected $table      = 'curriculum_experiencia';
    protected $primaryKey = 'curriculum_experiencia_id';

    /** Busca todas as experiências de um currículo, ordenadas por data (mais recente primeiro) */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_id', $curriculumId)
            ->orderBy('inicioAno', 'DESC')
            ->orderBy('inicioMes', 'DESC')
            ->findAll();
    }

    /** Busca uma experiência específica pelo ID */
    public function findById(int $id): ?array
    {
        $row = $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->first();
        return $row ?: null;
    }

    /** Cria uma nova experiência e retorna o ID gerado */
    public function create(array $data): int
    {
        return (int) $this->db->table($this->table)->insert($data);
    }

    /** Atualiza uma experiência existente, retorna número de linhas afetadas */
    public function updateById(int $id, array $data): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($data);
    }

    /** Exclui uma experiência, retorna número de linhas afetadas */
    public function deleteById(int $id): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}
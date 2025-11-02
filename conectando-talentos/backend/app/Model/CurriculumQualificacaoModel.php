<?php
namespace App\Model;

use Core\Library\ModelMain;

class CurriculumQualificacaoModel extends ModelMain
{
    protected $table      = 'curriculum_qualificacao';
    protected $primaryKey = 'curriculum_qualificacao_id';

    /** Busca todas as qualificações de um currículo, ordenadas por data (mais recente primeiro) */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_id', $curriculumId)
            ->orderBy('ano', 'DESC')
            ->orderBy('mes', 'DESC')
            ->findAll();
    }

    /** Cria uma nova qualificação e retorna o ID gerado */
    public function create(array $data): int
    {
        return (int) $this->db->table($this->table)->insert($data);
    }

    /** Atualiza uma qualificação existente, retorna número de linhas afetadas */
    public function updateById(int $id, array $data): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($data);
    }

    /** Exclui uma qualificação, retorna número de linhas afetadas */
    public function deleteById(int $id): int
    {
        return (int) $this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}
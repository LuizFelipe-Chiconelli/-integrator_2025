<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela curriculum_escolaridade
 * Usa o builder do Database que você já têm.
 */
class CurriculumEscolaridadeModel extends ModelMain
{
    protected $table      = 'curriculum_escolaridade';
    protected $primaryKey = 'curriculum_escolaridade_id';

    /** Lista todas as formações de um currículo */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_curriculum_id', $curriculumId)
            ->orderBy('inicioAno', 'DESC')
            ->orderBy('fimAno', 'DESC')
            ->findAll();
    }

    /** Cria uma formação e devolve o id gerado */
    public function create(array $data): int
    {
        $payload = [
            'curriculum_curriculum_id' => (int)$data['curriculum_curriculum_id'],
            'inicioMes'                => (int)$data['inicioMes'],
            'inicioAno'                => (int)$data['inicioAno'],
            'fimMes'                   => (int)$data['fimMes'],
            'fimAno'                   => (int)$data['fimAno'],
            'descricao'                => (string)($data['descricao']   ?? ''),
            'instituicao'              => (string)($data['instituicao'] ?? ''),
            'cidade_id'                => (int)$data['cidade_id'],
            'escolaridade_id'          => (int)$data['escolaridade_id'],
        ];

        return (int)$this->db->table($this->table)->insert($payload);
    }

    /** Atualiza por PK. Retorna linhas afetadas */
    public function updateById(int $id, array $data): int
    {
        $payload = [
            'curriculum_curriculum_id' => (int)$data['curriculum_curriculum_id'],
            'inicioMes'                => (int)$data['inicioMes'],
            'inicioAno'                => (int)$data['inicioAno'],
            'fimMes'                   => (int)$data['fimMes'],
            'fimAno'                   => (int)$data['fimAno'],
            'descricao'                => (string)($data['descricao']   ?? ''),
            'instituicao'              => (string)($data['instituicao'] ?? ''),
            'cidade_id'                => (int)$data['cidade_id'],
            'escolaridade_id'          => (int)$data['escolaridade_id'],
        ];

        return (int)$this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($payload);
    }

    /** Exclui por PK. Retorna linhas afetadas */
    public function deleteById(int $id): int
    {
        return (int)$this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}

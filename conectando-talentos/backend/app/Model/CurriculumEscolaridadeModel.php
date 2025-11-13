<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela curriculum_escolaridade
 * Gerencia o histórico de formação educacional do currículo
 */
class CurriculumEscolaridadeModel extends ModelMain
{
    protected $table      = 'curriculum_escolaridade';
    protected $primaryKey = 'curriculum_escolaridade_id';

    /** 
     * Busca todas as formações de um currículo 
     * Ordena por ano mais recente primeiro
     */
    public function findByCurriculum(int $curriculumId): array
    {
        return $this->db
            ->table($this->table)
            ->where('curriculum_curriculum_id', $curriculumId)
            ->orderBy('inicioAno', 'DESC')
            ->orderBy('fimAno', 'DESC')
            ->findAll();
    }

    /** 
     * Cria uma nova formação educacional 
     * Retorna o ID da formação criada
     */
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

    /** 
     * Atualiza uma formação existente 
     * Retorna número de linhas afetadas
     */
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

    /** 
     * Exclui uma formação 
     * Retorna número de linhas afetadas
     */
    public function deleteById(int $id): int
    {
        return (int)$this->db
            ->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }
}
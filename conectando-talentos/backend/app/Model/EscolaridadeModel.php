<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela base 'escolaridade' (id + descricao).
 * - NÃO grava histórico do usuário (isso é no CurriculumEscolaridadeModel).
 */
class EscolaridadeModel extends ModelMain
{
    protected $table      = 'escolaridade';
    protected $primaryKey = 'escolaridade_id';

    /**
     * Busca um registro por descricao (case-insensitive).
     * Ex.: 'medio', 'graduação', etc.
     *
     * @return array|null
     */
    public function findByDescricao(string $descricao): ?array
    {
        $row = $this->db
            ->table($this->table)
            ->where('LOWER(descricao)', mb_strtolower(trim($descricao)))
            ->first();

        return $row ?: null;
    }

    /**
     * Retorna todos ordenados por descricao (opcional).
     */
    public function listarTodos(): array
    {
        return $this->db
            ->table($this->table)
            ->orderBy('descricao', 'ASC')
            ->findAll();
    }
}

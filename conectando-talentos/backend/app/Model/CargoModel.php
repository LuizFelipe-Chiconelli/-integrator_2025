<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * CARGO MODEL - GERENCIA OPERAÇÕES DA TABELA DE CARGOS
 * 
 * Responsável por: Consultas da tabela de cargos pré-definidos
 * Fornece lista de cargos para seleção em formulários de vagas e experiências
 * Model simples focado em consultas ordenadas para otimização
 * Herda de ModelMain para operações básicas de banco
 */
class CargoModel extends ModelMain
{
    /**
     * NOME DA TABELA
     * Tabela de cargos pré-definidos do sistema
     */
    protected $table = 'cargo';

    /**
     * CHAVE PRIMÁRIA
     * Identificador único dos cargos
     */
    protected $primaryKey = 'cargo_id';

    /**
     * LISTA DE CARGOS - Consulta ordenada
     * 
     * Retorna todos os cargos ordenados por um campo específico
     * Usado para popular selects no front-end
     * Ordenação padrão por descrição em ordem alfabética
     * 
     * @param string $orderby Campo para ordenação (padrão: 'descricao')
     * @param string $direction Direção da ordenação (ASC/DESC - padrão: 'ASC')
     * @return array Lista de cargos ordenados
     */
    public function lista($orderby = 'descricao', $direction = 'ASC')
    {
        return $this->db
            ->orderBy($orderby, $direction)    // Aplica ordenação
            ->findAll();                       // Retorna todos os registros
    }
}
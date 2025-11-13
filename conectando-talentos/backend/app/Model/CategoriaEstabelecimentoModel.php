<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * CATEGORIA ESTABELECIMENTO MODEL - GERENCIA VINCULAÇÃO ENTRE EMPRESAS E CATEGORIAS
 * 
 * Responsável por: Operações na tabela de relacionamento empresa ↔ categoria
 * Gerencia a associação de empresas com categorias de atuação
 * Model especializado para operações de vinculação específicas
 * Herda de ModelMain para operações básicas de banco
 */
class CategoriaEstabelecimentoModel extends ModelMain
{
    /**
     * NOME DA TABELA
     * Tabela de relacionamento N:N entre estabelecimentos e categorias
     */
    protected $table = "categoria_estabelecimento";

    /**
     * CHAVE PRIMÁRIA
     * Identificador único do vínculo empresa-categoria
     */
    protected $primaryKey = "categoria_estabelecimento_id";

    /**
     * VINCULAR EMPRESA A CATEGORIA - Cria associação
     * 
     * Estabelece relação entre uma empresa e uma categoria de atuação
     * Permite que empresas sejam classificadas em múltiplas categorias
     * 
     * @param int $estabId ID do estabelecimento/empresa
     * @param int $catId ID da categoria
     * @return int ID do vínculo criado ou 0 em caso de falha
     */
    public function vincular(int $estabId, int $catId): int
    {
        return $this->db->insert([
            'estabelecimento_id' => $estabId,  // ID da empresa
            'categoria_id'       => $catId     // ID da categoria
        ]);
    }
}
<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

/**
 * CIDADE CONTROLLER - GERENCIA CONSULTAS DA TABELA DE CIDADES
 * 
 * Responsável por: Consultas de leitura da tabela Cidade
 * Fornece dados geográficos para seleção em formulários
 * Suporta filtro por UF para otimização de buscas
 * Acesso público para facilitar preenchimento de cadastros
 * Herda de ControllerMain para funcionalidades básicas
 */
class Cidade extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Acessíveis sem autenticação
     * Dados de cidades são públicos para facilitar cadastros
     */
    public const PUBLIC_ACTIONS = ['lista'];

    /**
     * LISTA DE CIDADES - GET /cidade/lista/{uf?}
     * 
     * Retorna lista de cidades para seleção em formulários
     * Suporta consulta completa ou filtrada por UF
     * Ordenação padrão por nome da cidade (ASC)
     * 
     * Exemplos de uso:
     * - /cidade/lista           → Todas as cidades do Brasil
     * - /cidade/lista/SP        → Apenas cidades de São Paulo  
     * - /cidade/lista/MG        → Apenas cidades de Minas Gerais
     * - /cidade/lista/RJ        → Apenas cidades do Rio de Janeiro
     * 
     * @param string $uf Sigla do estado para filtro (opcional)
     * @return void Retorna JSON com array de cidades
     */
    public function lista(string $uf = ''): void
    {
        // 📋 BUSCA CIDADES NO MODEL
        // Parâmetros: ordenação, direção, filtro por UF
        $dados = $this->loadModel('Cidade')
                      ->lista('cidade', 'ASC', $uf ?: null);

        // 🎯 FORMATA RESPOSTA PADRÃO PARA FRONT-END
        Response::json([
            'status'  => 200,
            'cidades' => array_map(fn($c) => [
                'id'   => $c['cidade_id'],  // ID único da cidade
                'nome' => $c['cidade'],     // Nome completo da cidade
                'uf'   => $c['uf']          // Sigla do estado (UF)
            ], $dados)
        ]);
    }
}
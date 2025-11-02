<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * CANDIDATURA MODEL - GERENCIA OPERAÇÕES DA TABELA vaga_curriculum
 * 
 * Responsável por: Aplicações em vagas, gestão de candidaturas
 * Tabela com chave primária composta (vaga_id + curriculum_id)
 * Operações para candidatos (aplicar, remover, listar) e empresas (gerenciar)
 * Joins complexos para dados completos de vagas, empresas e candidatos
 */
class CandidaturaModel extends ModelMain
{
    /**
     * NOME DA TABELA
     * Tabela de relacionamento entre Vagas e Currículos
     */
    protected $table = 'vaga_curriculum';

    /**
     * CHAVE PRIMÁRIA COMPOSTA
     * Identificação única por combinação vaga_id + curriculum_id
     */
    protected $primaryKey = null; // PK composta

    /* ========= AÇÕES BÁSICAS ========= */

    /**
     * APLICAR EM VAGA - Cria nova candidatura
     * 
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @return bool True se aplicou com sucesso
     */
    public function aplicar(int $vagaId, int $curriculumId): bool {
        return (bool) $this->db->table($this->table)->insert([
            'vaga_id'           => $vagaId,                    // ID da vaga
            'curriculum_id'     => $curriculumId,              // ID do currículo
            'statusCandidatura' => 11,                         // Status inicial: Pendente
            'dataCandidatura'   => date('Y-m-d H:i:s'),        // Data/hora atual
        ]);
    }

    /**
     * REMOVER CANDIDATURA - Exclui candidatura existente
     * 
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @return int Número de linhas afetadas (0 ou 1)
     */
    public function remover(int $vagaId, int $curriculumId): int {
        return (int) $this->db->table($this->table)
            ->where('vaga_id', $vagaId)                        // Filtra por vaga
            ->where('curriculum_id', $curriculumId)            // Filtra por currículo
            ->delete();                                        // Executa exclusão
    }

    /**
     * VERIFICAR SE JÁ CANDIDATADO - Evita duplicidade
     * 
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @return bool True se já está candidatado
     */
    public function jaCandidatado(int $vagaId, int $curriculumId): bool {
        $r = $this->db->table($this->table)
            ->where('vaga_id', $vagaId)                        // Filtra por vaga
            ->where('curriculum_id', $curriculumId)            // Filtra por currículo
            ->first();                                         // Busca primeiro registro
        return (bool) $r;                                      // Converte para booleano
    }

    /**
     * ATUALIZAR STATUS - Altera status da candidatura
     * 
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @param int $novo Novo status (aprovado, reprovado, etc)
     * @return int Número de linhas afetadas
     */
    public function atualizarStatus(int $vagaId, int $curriculumId, int $novo): int {
        return (int) $this->db->table($this->table)
            ->where('vaga_id', $vagaId)                        // Filtra por vaga
            ->where('curriculum_id', $curriculumId)            // Filtra por currículo
            ->update(['statusCandidatura' => $novo]);          // Atualiza status
    }

    /* ========= LISTAGENS COMPLEXAS ========= */

    /**
     * LISTAR POR VAGA - Visão da EMPRESA
     * 
     * Retorna todas as candidaturas de uma vaga específica
     * Inclui dados do candidato: nome, email, telefone, cidade
     * Ordenado por data de candidatura (mais recentes primeiro)
     * 
     * @param int $vagaId ID da vaga
     * @return array Lista de candidaturas com dados do candidato
     */
    public function listarPorVaga(int $vagaId): array {
        return $this->db->table($this->table.' vc')            // Alias vc para vaga_curriculum
            ->select("
                vc.vaga_id,
                vc.curriculum_id,
                vc.statusCandidatura,
                vc.dataCandidatura,

                v.titulo,                                      // Título da vaga
                v.estabelecimento_id,                          // ID da empresa

                pf.nome              AS candidato_nome,        // Nome do candidato
                cur.email            AS candidato_email,       // Email do candidato
                cur.celular          AS candidato_telefone,    // Telefone do candidato

                -- Formata cidade e UF (ex: 'São Paulo, SP')
                CONCAT(
                    COALESCE(cid.cidade, ''), 
                    CASE WHEN cid.uf IS NOT NULL AND cid.uf <> '' 
                        THEN CONCAT(', ', cid.uf) 
                        ELSE '' 
                    END
                ) AS candidato_cidade
            ")
            ->join('vaga v',          'v.vaga_id = vc.vaga_id',                 'INNER')  // Dados da vaga
            ->join('curriculum cur',  'cur.curriculum_id = vc.curriculum_id',   'INNER')  // Dados do currículo
            ->join('pessoa_fisica pf','pf.pessoa_fisica_id = cur.pessoa_fisica_id','INNER') // Dados pessoais
            ->join('cidade cid',      'cid.cidade_id = cur.cidade_id',          'LEFT')   // Dados da cidade
            ->where('vc.vaga_id', $vagaId)                                          // Filtra por vaga específica
            ->orderBy('vc.dataCandidatura', 'DESC')                                 // Mais recentes primeiro
            ->findAll();
    }

    /**
     * LISTAR POR CURRICULUM - Visão do CANDIDATO
     * 
     * ✅ ATUALIZADO: Retorna candidaturas do candidato com dados COMPLETOS da empresa
     * Inclui informações completas da empresa e detalhes da vaga
     * Ordenado por data de candidatura (mais recentes primeiro)
     * 
     * @param int $curriculumId ID do currículo
     * @return array Lista de candidaturas com dados da empresa
     */
    public function listarPorCurriculum(int $curriculumId): array
    {
        return $this->db->table($this->table . ' vc')          // Alias vc para vaga_curriculum
            ->select("
                vc.vaga_id,
                vc.curriculum_id,
                vc.statusCandidatura,
                vc.dataCandidatura,
                
                -- Dados da Vaga
                v.titulo,
                v.descricao AS vaga_descricao,
                v.localizacao,
                v.salario,
                v.nivel,
                v.modalidade,
                v.vinculo,
                v.dtInicio,
                v.dtFim,
                
                -- Dados da Empresa (COMPLETOS)
                e.estabelecimento_id AS empresa_id,
                e.nome AS empresa_nome,
                e.email AS empresa_email,
                e.descricao AS empresa_descricao,
                e.website AS empresa_website,
                e.setor AS empresa_setor,
                e.linkedin AS empresa_linkedin,
                e.instagram AS empresa_instagram,
                e.facebook AS empresa_facebook,
                
                -- Dados do Cargo
                cargo.descricao AS cargo_descricao
            ")
            ->join('vaga v', 'v.vaga_id = vc.vaga_id', 'INNER')                    // Dados da vaga
            ->join('estabelecimento e', 'e.estabelecimento_id = v.estabelecimento_id', 'LEFT') // Dados da empresa
            ->join('cargo', 'cargo.cargo_id = v.cargo_id', 'LEFT')                 // Dados do cargo
            ->where('vc.curriculum_id', $curriculumId)                             // Filtra por currículo
            ->orderBy('vc.dataCandidatura', 'DESC')                                // Mais recentes primeiro
            ->findAll();
    }

    /**
     * DETALHE COMPLETO DA CANDIDATURA
     * 
     * ✅ ATUALIZADO: Retorna dados completos de uma candidatura específica
     * Combina informações da vaga, empresa, candidato e currículo
     * Usado para visualização detalhada pela empresa
     * 
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @return array|null Dados completos ou null se não encontrado
     */
    public function detalheComJoins(int $vagaId, int $curriculumId): ?array 
    {
        $r = $this->db->table($this->table.' vc')              // Alias vc para vaga_curriculum
            ->select("
                vc.*,                                          // Todos os campos da candidatura

                -- Dados da Vaga
                v.titulo,
                v.descricao AS vaga_descricao,
                v.requisitos AS vaga_requisitos,
                v.localizacao AS vaga_localizacao,
                v.salario AS vaga_salario,
                v.nivel AS vaga_nivel,
                v.modalidade AS vaga_modalidade,
                v.vinculo AS vaga_vinculo,
                v.dtInicio AS vaga_dtInicio,
                v.dtFim AS vaga_dtFim,
                
                -- Dados da Empresa
                v.estabelecimento_id,                          // ID da empresa
                e.nome AS empresa_nome,
                e.email AS empresa_email,
                e.descricao AS empresa_descricao,
                e.website AS empresa_website,
                e.setor AS empresa_setor,
                
                -- Dados do Candidato
                pf.nome                 AS candidato_nome,     // Nome completo
                cur.email               AS candidato_email,    // Email de contato
                cur.celular             AS candidato_telefone, // Telefone
                cur.apresentacaoPessoal AS resumo,             // Resumo pessoal

                -- Cidade formatada do candidato
                CONCAT(
                    COALESCE(cid.cidade, ''), 
                    CASE WHEN cid.uf IS NOT NULL AND cid.uf <> '' 
                        THEN CONCAT(', ', cid.uf) 
                        ELSE '' 
                    END
                ) AS candidato_cidade
            ")
            ->join('vaga v',          'v.vaga_id = vc.vaga_id',                 'INNER')  // Vaga
            ->join('estabelecimento e', 'e.estabelecimento_id = v.estabelecimento_id', 'LEFT')   // Empresa
            ->join('curriculum cur',  'cur.curriculum_id = vc.curriculum_id',   'INNER')  // Currículo
            ->join('pessoa_fisica pf','pf.pessoa_fisica_id = cur.pessoa_fisica_id','INNER') // Pessoa física
            ->join('cidade cid',      'cid.cidade_id = cur.cidade_id',          'LEFT')   // Cidade
            ->where('vc.vaga_id', $vagaId)                                          // Filtra vaga específica
            ->where('vc.curriculum_id', $curriculumId)                              // Filtra currículo específico
            ->first();                                                             // Apenas um registro

        return $r ?: null;                                                        // Retorna null se não encontrado
    }
}
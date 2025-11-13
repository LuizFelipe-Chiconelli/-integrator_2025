<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

/**
 * QUALIFICAÇÃO CONTROLLER - GERENCIA CURSOS E CERTIFICAÇÕES DO CURRÍCULO
 * 
 * Responsável por: CRUD completo da tabela curriculum_qualificacao
 * Gerencia cursos, certificações, treinamentos e qualificações adicionais
 * Controle de datas, carga horária e instituições certificadoras
 * Herda de ControllerMain para funcionalidades básicas
 */
class Qualificacao extends ControllerMain
{
    /** 
     * MÉTODOS PRIVADOS - Todas as rotas exigem autenticação
     * Acesso restrito a usuários logados com currículo
     */
    public const PUBLIC_ACTIONS = [];

    /**
     * MODEL DE QUALIFICAÇÃO
     * 
     * @return object Model CurriculumQualificacao
     */
    private function model() { 
        return $this->loadModel('CurriculumQualificacao'); 
    }

    /**
     * LISTA QUALIFICAÇÕES - GET /qualificacao/lista/{curriculumId}
     * 
     * Retorna todos os cursos, certificações e qualificações de um currículo
     * Inclui dados completos: descrição, instituição, datas e carga horária
     * 
     * @param int $curriculumId ID do currículo (obrigatório)
     * @return void Retorna JSON com array de qualificações
     */
    public function lista(int $curriculumId): void
    {
        // 📋 BUSCA TODAS AS QUALIFICAÇÕES DO CURRÍCULO
        $rows = $this->model()->findByCurriculum($curriculumId);
        
        // 📤 RETORNA LISTA COMPLETA
        Response::json(['status'=>200, 'data'=>$rows]);
    }

    /**
     * CRIAR QUALIFICAÇÃO - POST /qualificacao/criar
     * 
     * Adiciona uma nova qualificação ao currículo
     * Suporta cursos, certificações, treinamentos, workshops, etc.
     * Valida datas, carga horária e campos obrigatórios
     * 
     * @return void Retorna JSON com ID da qualificação criada
     */
    public function criar(): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 SANITIZA E PREPARA DADOS
        $payload = $this->sanitize($dados);

        // ✅ VALIDA DADOS OBRIGATÓRIOS
        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

        // 💾 TENTA CRIAR REGISTRO NO BANCO
        try {
            $id = $this->model()->create($payload);
            Response::json(['status'=>201, 'data'=>['curriculum_qualificacao_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500, 
                'mensagem'=>'Erro ao criar qualificação', 
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * ATUALIZAR QUALIFICAÇÃO - PUT /qualificacao/atualizar/{id}
     * 
     * Edita uma qualificação existente no currículo
     * Permite atualizar todos os campos da qualificação
     * Mantém validações consistentes com a criação
     * 
     * @param int $id ID da qualificação a ser atualizada
     * @return void Retorna JSON com confirmação
     */
    public function atualizar(int $id): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 SANITIZA E PREPARA DADOS
        $payload = $this->sanitize($dados);

        // ✅ VALIDA DADOS OBRIGATÓRIOS
        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

        // 💾 TENTA ATUALIZAR REGISTRO NO BANCO
        try {
            $rows = $this->model()->updateById($id, $payload);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500, 
                'mensagem'=>'Erro ao atualizar qualificação', 
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * EXCLUIR QUALIFICAÇÃO - DELETE /qualificacao/excluir/{id}
     * 
     * Remove uma qualificação do currículo
     * Operação irreversível - remove registro permanentemente
     * 
     * @param int $id ID da qualificação a ser excluída
     * @return void Retorna JSON com confirmação
     */
    public function excluir(int $id): void
    {
        // 🗑️ TENTA EXCLUIR REGISTRO DO BANCO
        try {
            $rows = $this->model()->deleteById($id);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500, 
                'mensagem'=>'Erro ao excluir qualificação', 
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /* ---------------- HELPERS ---------------- */

    /**
     * SANITIZA DADOS DA QUALIFICAÇÃO
     * 
     * Limpa e formata dados recebidos do front-end
     * Converte tipos, remove espaços desnecessários
     * Prepara dados para inserção no banco
     * 
     * @param array $d Dados brutos do request
     * @return array Dados sanitizados e formatados
     */
    private function sanitize(array $d): array
    {
        return [
            'curriculum_id'   => (int)($d['curriculum_id'] ?? 0),     // ID do currículo
            'mes'             => (int)($d['mes'] ?? 0),               // Mês da qualificação (1-12)
            'ano'             => (int)($d['ano'] ?? 0),               // Ano da qualificação
            'cargaHoraria'    => (int)($d['cargaHoraria'] ?? 0),      // Carga horária em horas
            'descricao'       => isset($d['descricao']) ? trim((string)$d['descricao']) : '',        // Nome do curso/certificação
            'estabelecimento' => isset($d['estabelecimento']) ? trim((string)$d['estabelecimento']) : '', // Instituição certificadora
        ];
    }

    /**
     * VALIDA DADOS DA QUALIFICAÇÃO
     * 
     * Verifica integridade e regras de negócio dos dados
     * Valida campos obrigatórios, datas e valores numéricos
     * 
     * @param array $p Dados sanitizados para validação
     * @return string|null Mensagem de erro ou null se válido
     */
    private function validate(array $p): ?string
    {
        // ✅ VALIDAÇÕES DETALHADAS DE CAMPOS OBRIGATÓRIOS
        
        // Curriculum deve existir e ser válido
        if ($p['curriculum_id'] <= 0) return 'curriculum_id inválido.';
        
        // Mês deve estar entre 1 (Janeiro) e 12 (Dezembro)
        if ($p['mes'] < 1 || $p['mes'] > 12) return 'mes inválido.';
        
        // Ano deve ser realista (após 1900)
        if ($p['ano'] < 1900) return 'ano inválido.';
        
        // Carga horária deve ser positiva
        if ($p['cargaHoraria'] <= 0) return 'cargaHoraria inválida.';
        
        // Descrição não pode estar vazia
        if ($p['descricao'] === '') return 'descricao é obrigatória.';
        
        // Estabelecimento não pode estar vazio
        if ($p['estabelecimento'] === '') return 'estabelecimento é obrigatório.';
        
        return null;
    }
}
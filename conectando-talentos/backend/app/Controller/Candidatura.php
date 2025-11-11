<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * CANDIDATURA CONTROLLER - GERENCIA TODAS AS OPERAÇÕES DE CANDIDATURAS
 * 
 * Responsável por: aplicação em vagas, gestão de candidaturas, controle de status
 * Divide ações entre candidato (próprias candidaturas) e empresa (candidaturas recebidas)
 * Herda de ControllerMain para funcionalidades básicas
 */
class Candidatura extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Acesso com restrições específicas
     * 'porVaga' - Lista candidaturas de uma vaga (requer empresa dona)
     * 'whoami' - Debug de sessão (público para diagnóstico)
     * 'detalhe' - Detalhe de candidatura (requer empresa dona)
     */
    public const PUBLIC_ACTIONS = ['porVaga', 'whoami', 'detalhe'];

    /* ================= HELPERS DE MODELS ================= */

    /**
     * MODEL DE CANDIDATURA - Carregamento flexível
     * 
     * Tenta carregar com sufixo 'Model' e sem sufixo para compatibilidade
     * Garante funcionamento em diferentes estruturas de projeto
     * 
     * @return object Model de Candidatura ou null se não encontrado
     */
    private function candModel() {
        $m = $this->loadModel('CandidaturaModel');
        if (!$m) $m = $this->loadModel('Candidatura');
        return $m;
    }

    /**
     * MODEL DE VAGA - Carregamento flexível
     * 
     * Tenta carregar com sufixo 'Model' e sem sufixo
     * Usado para verificar permissões sobre vagas
     * 
     * @return object Model de Vaga ou null se não encontrado
     */
    private function vagaModel() {
        $m = $this->loadModel('VagaModel');
        if (!$m) $m = $this->loadModel('Vaga');
        return $m;
    }

    /**
     * MODEL DE USUÁRIO
     * Usado para resolver dados do usuário logado
     */
    private function usuarioModel() { return $this->loadModel('Usuario'); }

    /**
     * MODEL DE CURRICULUM
     * Usado para buscar currículo vinculado ao usuário
     */
    private function cvModel()      { return $this->loadModel('Curriculum'); }

    /* ================ AUXILIARES DE SESSÃO ================ */

    /**
     * RESOLVE CURRICULUM_ID DO USUÁRIO LOGADO
     * 
     * Busca o ID do currículo vinculado ao usuário da sessão
     * Faz cache em sessão para otimização
     * Fluxo: usuario_id → pessoa_fisica_id → curriculum_id
     * 
     * @return int ID do currículo ou 0 se não encontrado
     */
    private function resolveCurriculumId(): int
    {
        // 🔍 VERIFICA SE JÁ ESTÁ EM CACHE NA SESSÃO
        $currId = (int)(Session::get('curriculum_id') ?: 0);
        if ($currId > 0) return $currId;

        // 👤 OBTÉM ID DO USUÁRIO DA SESSÃO
        $usuarioId = (int)(Session::get('usuario_id') ?: 0);
        if ($usuarioId <= 0) return 0;

        // 📋 BUSCA DADOS DO USUÁRIO
        $usuario = $this->usuarioModel() ? $this->usuarioModel()->findById($usuarioId) : null;
        if (!$usuario) return 0;

        // 👥 OBTÉM ID DA PESSOA FÍSICA VINCULADA
        $pfId = (int)($usuario['pessoa_fisica_id'] ?? 0);
        if ($pfId <= 0) return 0;

        // 📄 BUSCA CURRÍCULO DA PESSOA FÍSICA
        $cv = $this->cvModel() ? ($this->cvModel()->getByPessoaFisica($pfId) ?? []) : [];
        $currId = (int)($cv['curriculum_id'] ?? 0);
        
        // 💾 SALVA EM CACHE NA SESSÃO PARA PRÓXIMAS REQUISIÇÕES
        if ($currId > 0) Session::set('curriculum_id', $currId);

        return $currId;
    }

    /**
     * GARANTE CURRÍCULO VÁLIDO OU RETORNA ERRO 401
     * 
     * Helper que interrompe execução se não houver currículo válido
     * Usado em todas as ações que requerem candidato autenticado
     * 
     * @return int ID do currículo válido
     */
    private function requireCurriculumOr401(): int
    {
        $currId = $this->resolveCurriculumId();
        if ($currId <= 0) {
            Response::json(['status'=>401,'mensagem'=>'Não autenticado ou currículo não encontrado.']);
            exit; // Interrompe execução imediatamente
        }
        return $currId;
    }

    /* ==================== CANDIDATO ==================== */

    /**
     * APLICAR EM VAGA - POST /candidatura/aplicar
     * 
     * Candidato se inscreve em uma vaga específica
     * Verifica se já não está candidatado para evitar duplicidade
     * Acesso restrito - requer candidato logado com currículo
     * 
     * @return void Retorna JSON com confirmação
     */
    public function aplicar(): void
    {
        // 🔐 VERIFICA SE CANDIDATO TEM CURRÍCULO VÁLIDO
        $currId = $this->requireCurriculumOr401();

        // 📨 OBTÉM DADOS DA REQUISIÇÃO
        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        
        // ✅ VALIDA ID DA VAGA
        if ($vagaId <= 0) { 
            Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); 
            return; 
        }

        // 🔍 CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        // ⚠️ VERIFICA SE JÁ ESTÁ CANDIDATADO
        if ($M->jaCandidatado($vagaId, $currId)) {
            Response::json(['status'=>409,'mensagem'=>'Você já se candidatou a esta vaga.']); 
            return;
        }

        // 💾 TENTA REALIZAR CANDIDATURA
        try {
            $ok = $M->aplicar($vagaId, $currId);
            Response::json(['status'=>201,'mensagem'=>'Candidatura registrada.','ok'=>$ok]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao candidatar.','erro'=>$e->getMessage()]);
        }
    }

    /**
     * REMOVER CANDIDATURA - DELETE /candidatura/remover
     * 
     * Candidato remove sua inscrição de uma vaga
     * Acesso restrito - requer candidato logado com currículo
     * 
     * @return void Retorna JSON com confirmação
     */
    public function remover(): void
    {
        // 🔐 VERIFICA SE CANDIDATO TEM CURRÍCULO VÁLIDO
        $currId = $this->requireCurriculumOr401();

        // 📨 OBTÉM DADOS DA REQUISIÇÃO
        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        
        // ✅ VALIDA ID DA VAGA
        if ($vagaId <= 0) { 
            Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); 
            return; 
        }

        // 🔍 CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        // 🗑️ TENTA REMOVER CANDIDATURA
        try {
            $rows = $M->remover($vagaId, $currId);
            Response::json(['status'=>200,'mensagem'=>'Candidatura removida.','rows'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao remover candidatura.','erro'=>$e->getMessage()]);
        }
    }

    /**
     * MINHAS CANDIDATURAS - GET /candidatura/minhas
     * 
     * Lista todas as candidaturas do candidato logado
     * Inclui dados das vagas e status das candidaturas
     * Acesso restrito - requer candidato logado com currículo
     * 
     * @return void Retorna JSON com lista de candidaturas
     */
    public function minhas(): void
    {
        // VERIFICA SE CANDIDATO TEM CURRÍCULO VÁLIDO CHAMANDO UM HELPER
        $currId = $this->requireCurriculumOr401();

        // 🔍 CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        //BUSCA CANDIDATURAS DO CANDIDATO
        // Usa método atualizado listarPorCurriculum()
        $rows = $M->listarPorCurriculum($currId);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /**
     * CANDIDATURAS POR VAGA - GET /candidatura/porVaga/listar/{vagaId}
     * 
     * Lista todas as candidaturas recebidas para uma vaga específica
     * Acesso restrito - requer empresa dona da vaga
     * Suporta múltiplos formatos de URL para compatibilidade
     * 
     * @param string $action Nome da ação (para compatibilidade de rota)
     * @param int $vagaId ID da vaga (opcional, pode vir por parâmetro ou query)
     * @return void Retorna JSON com lista de candidaturas
     */
    public function porVaga($action = "", $vagaId = 0): void
    {
        //  DEBUG PARA LOG DE PARÂMETROS
        error_log("DEBUG porVaga - action: '$action', vagaId: '$vagaId'");
        
        //  LÓGICA FLEXÍVEL PARA DIFERENTES FORMATOS DE URL
        
        // Se o primeiro parâmetro for numérico, é o vagaId
        if (is_numeric($action) && $vagaId === 0) {
            $vagaId = (int)$action;
            $action = "";
        }
        
        // Se veio pelo formato /porVaga/listar/10
        if ($action === "listar" && is_numeric($vagaId)) {
            $vagaId = (int)$vagaId;
        }
        
        // Se ainda não tem vagaId, tenta por query param
        if ($vagaId <= 0) {
            $vagaId = (int)($_GET['vaga_id'] ?? $_GET['vagaId'] ?? 0);
        }
        
        //  VERIFICA SE EMPRESA ESTÁ LOGADA
        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }
        
        // VALIDA ID DA VAGA
        if ($vagaId <= 0) { 
            Response::json(['status'=>422,'mensagem'=>'vagaId inválido.']); 
            return; 
        }

        //  CARREGA MODEL DE VAGA PARA VERIFICAÇÃO DE PERMISSÃO
        $VM = $this->vagaModel();
        if (!$VM) { 
            Response::json(['status'=>500,'mensagem'=>'Model de Vaga não encontrado.']); 
            return; 
        }

        // 🔒 VERIFICA SE EMPRESA É DONA DA VAGA
        $vaga = $VM->findById($vagaId);
        if (!$vaga || (int)$vaga['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Vaga não pertence à empresa.']); 
            return;
        }

        // 🔍 CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        // 📋 BUSCA CANDIDATURAS DA VAGA
        $rows = $M->listarPorVaga($vagaId);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /**
     * DETALHE DA CANDIDATURA - GET /candidatura/detalhe/listar/{vagaId}/{curriculumId}
     * 
     * Retorna informações completas de uma candidatura específica
     * Inclui dados do candidato, currículo e vaga
     * Acesso restrito - requer empresa dona da vaga
     * 
     * @param string $action Nome da ação (para compatibilidade)
     * @param int $vagaId ID da vaga
     * @param int $curriculumId ID do currículo
     * @return void Retorna JSON com dados completos da candidatura
     */
    public function detalhe($action = "", $vagaId = 0, $curriculumId = 0): void
    {
        // DEBUG PARA LOG DE PARÂMETROS
        error_log("DEBUG detalhe - action: '$action', vagaId: '$vagaId', curriculumId: '$curriculumId'");
        
        // LÓGICA FLEXÍVEL PARA DIFERENTES FORMATOS DE URL
        
        // Se o primeiro parâmetro for "listar", então os próximos são os IDs
        if ($action === "listar" && is_numeric($vagaId) && $curriculumId === 0) {
            // Formato: /detalhe/listar/10/20 - precisa de ajuste na ordem
            $curriculumId = (int)$vagaId;
            $vagaId = (int)$action;
            // NOTA: Esta lógica precisa de revisão - pode estar invertendo os IDs
        } elseif ($action === "listar" && is_numeric($vagaId) && is_numeric($curriculumId)) {
            // Já está no formato correto: /detalhe/listar/10/20
            $vagaId = (int)$vagaId;
            $curriculumId = (int)$curriculumId;
        }
        
        //  FALLBACK PARA QUERY PARAMS SE AINDA FALTAR DADOS
        if ($vagaId <= 0) {
            $vagaId = (int)($_GET['vaga_id'] ?? 0);
        }
        if ($curriculumId <= 0) {
            $curriculumId = (int)($_GET['curriculum_id'] ?? 0);
        }

        //  VERIFICA SE EMPRESA ESTÁ LOGADA
        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }

        //  VALIDA PARÂMETROS OBRIGATÓRIOS
        if ($vagaId <= 0 || $curriculumId <= 0) {
            Response::json(['status'=>422,'mensagem'=>'Parâmetros inválidos.']); 
            return;
        }

        //  CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        //  BUSCA DETALHES COMPLETOS DA CANDIDATURA
        $det = $M->detalheComJoins($vagaId, $curriculumId);
        
        //  VERIFICA PERMISSÃO E EXISTÊNCIA
        if (!$det || (int)$det['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Sem permissão ou não encontrado.']); 
            return;
        }

        //  RETORNA DADOS COMPLETOS
        Response::json(['status'=>200,'data'=>$det]);
    }

    /**
     * ATUALIZAR STATUS DA CANDIDATURA - POST /candidatura/status
     * 
     * Empresa altera o status de uma candidatura (aprovado, reprovado, etc)
     * Acesso restrito - requer empresa dona da vaga
     * 
     * @return void Retorna JSON com confirmação
     */
    public function status(): void
    {
        // 🔐 VERIFICA SE EMPRESA ESTÁ LOGADA
        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }

        // 📨 OBTÉM DADOS DA REQUISIÇÃO
        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        $currId = (int)($d['curriculum_id'] ?? 0);
        $novo   = (int)($d['statusCandidatura'] ?? 0);

        // ✅ VALIDA TODOS OS PARÂMETROS
        if ($vagaId<=0 || $currId<=0 || $novo<=0) {
            Response::json(['status'=>422,'mensagem'=>'Parâmetros inválidos.']); 
            return;
        }

        // 🔍 CARREGA MODEL DE VAGA PARA VERIFICAÇÃO DE PERMISSÃO
        $VM = $this->vagaModel();
        if (!$VM) { 
            Response::json(['status'=>500,'mensagem'=>'Model de Vaga não encontrado.']); 
            return; 
        }

        // 🔒 VERIFICA SE EMPRESA É DONA DA VAGA
        $vaga = $VM->findById($vagaId);
        if (!$vaga || (int)$vaga['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Vaga não pertence à empresa.']); 
            return;
        }

        // 🔍 CARREGA MODEL DE CANDIDATURA
        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        // 💾 TENTA ATUALIZAR STATUS
        try {
            $rows = $M->atualizarStatus($vagaId, $currId, $novo);
            Response::json(['status'=>200,'mensagem'=>'Status atualizado.','rows'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar status.','erro'=>$e->getMessage()]);
        }
    }

    /* ======================== DEBUG ======================== */

    /**
     * WHOAMI - DIAGNÓSTICO DE SESSÃO - GET /candidatura/whoami
     * 
     * Retorna informações da sessão atual para debug
     * Útil para diagnosticar problemas de autenticação
     * Acesso público - apenas para desenvolvimento
     * 
     * @return void Retorna JSON com dados da sessão
     */
    public function whoami(): void
    {
        Response::json([
            'status'              => 200,
            'empresa_id'          => (int)(Session::get('empresa_id') ?: 0),
            'estabelecimento_id'  => (int)(Session::get('estabelecimento_id') ?: 0),
            'usuario_id'          => (int)(Session::get('usuario_id') ?: 0),
            'curriculum_id'       => (int)(Session::get('curriculum_id') ?: 0),
        ]);
    }
}
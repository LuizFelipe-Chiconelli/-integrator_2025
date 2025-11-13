<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * DESISTENCIA CONTROLLER - GERENCIA APENAS OPERAÇÕES DE DESISTÊNCIA
 * 
 * Controller dedicado para desistências de candidaturas
 * Foca em uma única responsabilidade: mudar status para 16 (Abandono)
 * Herda de ControllerMain para funcionalidades básicas
 */
class Desistencia extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Acesso com autenticação de candidato
     */
    public const PUBLIC_ACTIONS = ['desistir'];

    /* ================= HELPERS DE MODELS ================= */

    /**
     * MODEL DE CANDIDATURA - Carregamento flexível
     */
    private function candModel() {
        $m = $this->loadModel('CandidaturaModel');
        if (!$m) $m = $this->loadModel('Candidatura');
        return $m;                      
    }

    /**
     * MODEL DE USUÁRIO
     */
    private function usuarioModel() { return $this->loadModel('Usuario'); }

    /**
     * MODEL DE CURRICULUM
     */
    private function cvModel() { return $this->loadModel('Curriculum'); }

    /* ================ AUXILIARES DE SESSÃO ================ */

    /**
     * RESOLVE CURRICULUM_ID DO USUÁRIO LOGADO
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
     */
    private function requireCurriculumOr401(): int
    {
        $currId = $this->resolveCurriculumId();
        if ($currId <= 0) {
            Response::json(['status'=>401,'mensagem'=>'Não autenticado ou currículo não encontrado.']);
            exit;
        }
        return $currId;
    }

    /* ==================== MÉTODO PRINCIPAL ==================== */

    /**
     * DESISTIR DA VAGA - POST /desistencia/desistir
     * 
     * Candidato desiste de uma vaga que se candidatou
     * Altera status para 16 (Abandono) ao invés de remover
     * Acesso restrito - requer candidato logado com currículo
     * 
     * @return void Retorna JSON com confirmação
     */
    public function desistir(): void
    {
        // 🔐 VERIFICA SE CANDIDATO TEM CURRÍCULO VÁLIDO
        $currId = $this->requireCurriculumOr401();

        // 📨 OBTÉM DADOS DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($dados['vaga_id'] ?? 0);
        
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

        // ⚠️ VERIFICA SE EXISTE CANDIDATURA PARA DESISTIR
        if (!$M->jaCandidatado($vagaId, $currId)) {
            Response::json(['status'=>404,'mensagem'=>'Você não está candidatado a esta vaga.']); 
            return;
        }

        // 🔄 TENTA ATUALIZAR STATUS PARA ABANDONO (16)
        try {
            $rows = $M->atualizarStatus($vagaId, $currId, 16); // Status 16 = Abandono
            
            if ($rows > 0) {
                Response::json([
                    'status'=>200,
                    'mensagem'=>'Desistência realizada com sucesso!',
                    'vaga_id'=>$vagaId,
                    'status_candidatura'=>16
                ]);
            } else {
                Response::json(['status'=>500,'mensagem'=>'Erro ao processar desistência.']);
            }
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao desistir da vaga.',
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * VERIFICAR STATUS - GET /desistencia/status/{vagaId}
     * 
     * Verifica se o candidato já desistiu de uma vaga
     * Útil para mostrar botão "Já desistiu" no front-end
     * 
     * @param int $vagaId ID da vaga
     * @return void Retorna JSON com status da desistência
     */
    public function status(int $vagaId = 0): void
    {
        // 🔐 VERIFICA SE CANDIDATO TEM CURRÍCULO VÁLIDO
        $currId = $this->requireCurriculumOr401();

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

        try {
            // Busca a candidatura específica
            $candidatura = $M->db->table('vaga_curriculum')
                ->where('vaga_id', $vagaId)
                ->where('curriculum_id', $currId)
                ->first();

            if ($candidatura) {
                Response::json([
                    'status'=>200,
                    'desistiu'=>((int)$candidatura['statusCandidatura'] === 16),
                    'status_candidatura'=>(int)$candidatura['statusCandidatura'],
                    'vaga_id'=>$vagaId
                ]);
            } else {
                Response::json([
                    'status'=>200,
                    'desistiu'=>false,
                    'status_candidatura'=>null,
                    'vaga_id'=>$vagaId
                ]);
            }
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao verificar status.',
                'erro'=>$e->getMessage()
            ]);
        }
    }
}
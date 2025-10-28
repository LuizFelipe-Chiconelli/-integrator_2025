<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Candidatura extends ControllerMain
{
    // deixe "porVaga" público (só se você realmente quiser expor),
    // e "whoami" apenas para debug.
    public const PUBLIC_ACTIONS = ['porVaga', 'whoami', 'detalhe'];

    /* ================= Helpers de Models ================= */

    /** Candidatura model (tenta com e sem sufixo Model) */
    private function candModel() {
        $m = $this->loadModel('CandidaturaModel');
        if (!$m) $m = $this->loadModel('Candidatura');
        return $m;
    }

    /** Vaga model (tenta com e sem sufixo Model) */
    private function vagaModel() {
        $m = $this->loadModel('VagaModel');
        if (!$m) $m = $this->loadModel('Vaga');
        return $m;
    }

    private function usuarioModel() { return $this->loadModel('Usuario'); }
    private function cvModel()      { return $this->loadModel('Curriculum'); }

    /* ================ Auxiliares de sessão ================ */

    /** Resolve curriculum_id do usuário logado e faz cache em sessão */
    private function resolveCurriculumId(): int
    {
        $currId = (int)(Session::get('curriculum_id') ?: 0);
        if ($currId > 0) return $currId;

        $usuarioId = (int)(Session::get('usuario_id') ?: 0);
        if ($usuarioId <= 0) return 0;

        $usuario = $this->usuarioModel() ? $this->usuarioModel()->findById($usuarioId) : null;
        if (!$usuario) return 0;

        $pfId = (int)($usuario['pessoa_fisica_id'] ?? 0);
        if ($pfId <= 0) return 0;

        $cv = $this->cvModel() ? ($this->cvModel()->getByPessoaFisica($pfId) ?? []) : [];
        $currId = (int)($cv['curriculum_id'] ?? 0);
        if ($currId > 0) Session::set('curriculum_id', $currId);

        return $currId;
    }

    /** Garante currículo e responde 401 se faltar */
    private function requireCurriculumOr401(): int
    {
        $currId = $this->resolveCurriculumId();
        if ($currId <= 0) {
            Response::json(['status'=>401,'mensagem'=>'Não autenticado ou currículo não encontrado.']);
            exit;
        }
        return $currId;
    }

    /* ==================== CANDIDATO ==================== */

    /** POST /candidatura/aplicar  { vaga_id } */
    public function aplicar(): void
    {
        $currId = $this->requireCurriculumOr401();

        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        if ($vagaId <= 0) { Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); return; }

        $M = $this->candModel();
        if (!$M) { Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); return; }

        if ($M->jaCandidatado($vagaId, $currId)) {
            Response::json(['status'=>409,'mensagem'=>'Você já se candidatou a esta vaga.']); return;
        }

        try {
            $ok = $M->aplicar($vagaId, $currId);
            Response::json(['status'=>201,'mensagem'=>'Candidatura registrada.','ok'=>$ok]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao candidatar.','erro'=>$e->getMessage()]);
        }
    }

    /** DELETE /candidatura/remover  { vaga_id } */
    public function remover(): void
    {
        $currId = $this->requireCurriculumOr401();

        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        if ($vagaId <= 0) { Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); return; }

        $M = $this->candModel();
        if (!$M) { Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); return; }

        try {
            $rows = $M->remover($vagaId, $currId);
            Response::json(['status'=>200,'mensagem'=>'Candidatura removida.','rows'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao remover candidatura.','erro'=>$e->getMessage()]);
        }
    }

    /** GET /candidatura/minhas */
    public function minhas(): void
    {
        $currId = $this->requireCurriculumOr401();

        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        // ✅ CORRIGIDO: O método atualizado já se chama listarPorCurriculum() 
        // (não listarPorCurriculumCompleto())
        $rows = $M->listarPorCurriculum($currId);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /** GET /candidatura/porVaga/listar/{vagaId} */
    public function porVaga($action = "", $vagaId = 0): void
    {
        // Debug para ver o que está chegando
        error_log("DEBUG porVaga - action: '$action', vagaId: '$vagaId'");
        
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
        
        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }
        
        if ($vagaId <= 0) { 
            Response::json(['status'=>422,'mensagem'=>'vagaId inválido.']); 
            return; 
        }

        $VM = $this->vagaModel();
        if (!$VM) { 
            Response::json(['status'=>500,'mensagem'=>'Model de Vaga não encontrado.']); 
            return; 
        }

        $vaga = $VM->findById($vagaId);
        if (!$vaga || (int)$vaga['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Vaga não pertence à empresa.']); 
            return;
        }

        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        $rows = $M->listarPorVaga($vagaId);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /** GET /candidatura/detalhe/listar/{vagaId}/{curriculumId} */
    public function detalhe($action = "", $vagaId = 0, $curriculumId = 0): void
    {
        // Debug
        error_log("DEBUG detalhe - action: '$action', vagaId: '$vagaId', curriculumId: '$curriculumId'");
        
        // Se o primeiro parâmetro for "listar", então os próximos são os IDs
        if ($action === "listar" && is_numeric($vagaId) && $curriculumId === 0) {
            // Formato: /detalhe/listar/10/20
            $curriculumId = (int)$vagaId;
            $vagaId = (int)$action;
            // Vamos reordenar - isso precisa de ajuste
        } elseif ($action === "listar" && is_numeric($vagaId) && is_numeric($curriculumId)) {
            // Já está no formato correto
            $vagaId = (int)$vagaId;
            $curriculumId = (int)$curriculumId;
        }
        
        // Fallback para query params se ainda faltar
        if ($vagaId <= 0) {
            $vagaId = (int)($_GET['vaga_id'] ?? 0);
        }
        if ($curriculumId <= 0) {
            $curriculumId = (int)($_GET['curriculum_id'] ?? 0);
        }

        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }

        if ($vagaId <= 0 || $curriculumId <= 0) {
            Response::json(['status'=>422,'mensagem'=>'Parâmetros inválidos.']); 
            return;
        }

        $M = $this->candModel();
        if (!$M) { 
            Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); 
            return; 
        }

        $det = $M->detalheComJoins($vagaId, $curriculumId);
        if (!$det || (int)$det['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Sem permissão ou não encontrado.']); 
            return;
        }

        Response::json(['status'=>200,'data'=>$det]);
    }

    /** POST /candidatura/status  { vaga_id, curriculum_id, statusCandidatura } */
    public function status(): void
    {
        $eid = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }

        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($d['vaga_id'] ?? 0);
        $currId = (int)($d['curriculum_id'] ?? 0);
        $novo   = (int)($d['statusCandidatura'] ?? 0);

        if ($vagaId<=0 || $currId<=0 || $novo<=0) {
            Response::json(['status'=>422,'mensagem'=>'Parâmetros inválidos.']); return;
        }

        $VM = $this->vagaModel();
        if (!$VM) { Response::json(['status'=>500,'mensagem'=>'Model de Vaga não encontrado.']); return; }

        $vaga = $VM->findById($vagaId);
        if (!$vaga || (int)$vaga['estabelecimento_id'] !== $eid) {
            Response::json(['status'=>403,'mensagem'=>'Vaga não pertence à empresa.']); return;
        }

        $M = $this->candModel();
        if (!$M) { Response::json(['status'=>500,'mensagem'=>'Model de candidatura não encontrado.']); return; }

        try {
            $rows = $M->atualizarStatus($vagaId, $currId, $novo);
            Response::json(['status'=>200,'mensagem'=>'Status atualizado.','rows'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar status.','erro'=>$e->getMessage()]);
        }
    }

    /* ======================== DEBUG ======================== */

    /** GET /candidatura/whoami  (apenas para diagnóstico rápido) */
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
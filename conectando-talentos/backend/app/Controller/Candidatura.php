<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Candidatura extends ControllerMain
{
    public const PUBLIC_ACTIONS = []; // mantenha fechado, a não ser que queira abrir algo

    private function model()     { return $this->loadModel('CandidaturaModel'); }
    private function vagaModel() { return $this->loadModel('VagaModel'); }

    /** POST /candidatura/aplicar { vaga_id } – candidato se inscreve */
    public function aplicar(): void
    {
        // ajuste se sua sessão de candidato usar outro nome:
        $curriculumId = (int)(Session::get('curriculum_id') ?: 0);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($body['vaga_id'] ?? 0);

        if ($curriculumId <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado (candidato).']); return; }
        if ($vagaId <= 0)       { Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); return; }

        if ($this->model()->jaCandidatou($vagaId, $curriculumId)) {
            Response::json(['status'=>409,'mensagem'=>'Você já se candidatou a esta vaga.']); return;
        }

        try {
            $ok = $this->model()->aplicar($vagaId, $curriculumId);
            $ok ? Response::json(['status'=>201,'mensagem'=>'Candidatura enviada.'])
                : Response::json(['status'=>500,'mensagem'=>'Falha ao gravar candidatura.']);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao candidatar.','erro'=>$e->getMessage()]);
        }
    }

    /** GET /candidatura/por-vaga/{vagaId} – empresa lista candidaturas da sua vaga */
    public function porVaga(int $vagaId = 0): void
    {
        $empresaId = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        if ($empresaId <= 0)         { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }
        if ($vagaId    <= 0)         { Response::json(['status'=>400,'mensagem'=>'vagaId inválido.']); return; }

        $vaga = $this->vagaModel()->findById($vagaId);
        if (!$vaga)                  { Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); return; }
        if ((int)$vaga['estabelecimento_id'] !== $empresaId) {
            Response::json(['status'=>403,'mensagem'=>'Sem permissão para esta vaga.']); return;
        }

        try {
            $rows = $this->model()->listarPorVaga($vagaId);
            Response::json(['status'=>200,'data'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao listar candidaturas.','erro'=>$e->getMessage()]);
        }
    }

    /** GET /candidatura/minhas – candidato vê as suas candidaturas */
    public function minhas(): void
    {
        $curriculumId = (int)(Session::get('curriculum_id') ?: 0);
        if ($curriculumId <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado (candidato).']); return; }

        try {
            $rows = $this->model()->listarDoCandidato($curriculumId);
            Response::json(['status'=>200,'data'=>$rows]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao listar suas candidaturas.','erro'=>$e->getMessage()]);
        }
    }

    /** DELETE /candidatura/remover { vaga_id } – candidato retira candidatura */
    public function remover(): void
    {
        $curriculumId = (int)(Session::get('curriculum_id') ?: 0);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $vagaId = (int)($body['vaga_id'] ?? 0);

        if ($curriculumId <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado (candidato).']); return; }
        if ($vagaId <= 0)       { Response::json(['status'=>422,'mensagem'=>'vaga_id inválido.']); return; }

        try {
            $rows = $this->model()->remover($vagaId, $curriculumId);
            Response::json(['status'=>200,'mensagem'=>'Candidatura retirada.','data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao remover candidatura.','erro'=>$e->getMessage()]);
        }
    }
}

<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

class Qualificacao extends ControllerMain
{
    /** Nenhuma ação é pública → tudo exige login */
    public const PUBLIC_ACTIONS = [];

    private function model() { 
        return $this->loadModel('CurriculumQualificacao'); 
    }

    /** GET /qualificacao/lista/{curriculumId} */
    public function lista(int $curriculumId): void
    {
        $rows = $this->model()->findByCurriculum($curriculumId);
        Response::json(['status'=>200, 'data'=>$rows]);
    }

    /** POST /qualificacao/criar */
    public function criar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

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

    /** PUT /qualificacao/atualizar/{id} */
    public function atualizar(int $id): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

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

    /** DELETE /qualificacao/excluir/{id} */
    public function excluir(int $id): void
    {
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

    /* ---------------- helpers ---------------- */

    private function sanitize(array $d): array
    {
        return [
            'curriculum_id'   => (int)($d['curriculum_id'] ?? 0),
            'mes'             => (int)($d['mes'] ?? 0),
            'ano'             => (int)($d['ano'] ?? 0),
            'cargaHoraria'    => (int)($d['cargaHoraria'] ?? 0),
            'descricao'       => isset($d['descricao']) ? trim((string)$d['descricao']) : '',
            'estabelecimento' => isset($d['estabelecimento']) ? trim((string)$d['estabelecimento']) : '',
        ];
    }

    private function validate(array $p): ?string
    {
        if ($p['curriculum_id'] <= 0) return 'curriculum_id inválido.';
        if ($p['mes'] < 1 || $p['mes'] > 12) return 'mes inválido.';
        if ($p['ano'] < 1900) return 'ano inválido.';
        if ($p['cargaHoraria'] <= 0) return 'cargaHoraria inválida.';
        if ($p['descricao'] === '') return 'descricao é obrigatória.';
        if ($p['estabelecimento'] === '') return 'estabelecimento é obrigatório.';
        return null;
    }
}

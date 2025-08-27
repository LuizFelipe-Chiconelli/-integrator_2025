<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

class Experiencia extends ControllerMain
{
    /**
     * PUBLIC_ACTIONS:
     * - Se você quiser permitir que o front puxe a lista de cargos sem estar logado,
     *   mantenha 'cargos' aqui.
     * - Se quiser exigir login para tudo, deixe vazio.
     */
    public const PUBLIC_ACTIONS = ['cargos'];

    private function expModel()   { return $this->loadModel('CurriculumExperiencia'); }
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /** GET /experiencia/lista/{curriculumId} */
    public function lista(int $curriculumId): void
    {
        $itens = $this->expModel()->findByCurriculum($curriculumId);
        Response::json(['status'=>200, 'data'=>$itens]);
    }

    /** GET /experiencia/cargos → usado pelo <Select> de cargos */
    public function cargos(): void
    {
        $rows = $this->cargoModel()->lista('descricao', 'ASC');

        Response::json([
            'status' => 200,
            'cargos' => array_map(fn($c) => [
                'cargo_id'  => (int) $c['cargo_id'],
                'descricao' => (string) $c['descricao'],
            ], $rows),
        ]);
    }

    /** POST /experiencia/criar */
    public function criar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if ($err = $this->validate($payload, true)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); return;
        }

        try {
            $id = $this->expModel()->create($payload);
            Response::json(['status'=>201, 'data'=>['curriculum_experiencia_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao criar experiência','erro'=>$e->getMessage()]);
        }
    }

    /** PUT /experiencia/atualizar/{id} */
    public function atualizar(int $id): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if ($err = $this->validate($payload, false)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); return;
        }

        try {
            $rows = $this->expModel()->updateById($id, $payload);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar experiência','erro'=>$e->getMessage()]);
        }
    }

    /** DELETE /experiencia/excluir/{id} */
    public function excluir(int $id): void
    {
        try {
            $rows = $this->expModel()->deleteById($id);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao excluir experiência','erro'=>$e->getMessage()]);
        }
    }

    /* ----------------- helpers ----------------- */

    private function sanitize(array $d): array
    {
        $empregoAtual = !empty($d['empregoAtual']);
        $fimMes = $empregoAtual ? null : (isset($d['fimMes']) ? (int)$d['fimMes'] : null);
        $fimAno = $empregoAtual ? null : (isset($d['fimAno']) ? (int)$d['fimAno'] : null);

        $cargoId   = isset($d['cargo_id']) && $d['cargo_id'] !== '' ? (int)$d['cargo_id'] : null;
        $cargoDesc = isset($d['cargoDescricao']) ? trim((string)$d['cargoDescricao']) : null;

        return [
            'curriculum_id'       => (int)($d['curriculum_id'] ?? 0),
            'inicioMes'           => (int)($d['inicioMes'] ?? 0),
            'inicioAno'           => (int)($d['inicioAno'] ?? 0),
            'fimMes'              => $fimMes,
            'fimAno'              => $fimAno,
            'estabelecimento'     => isset($d['estabelecimento']) ? trim((string)$d['estabelecimento']) : null,
            'cargo_id'            => $cargoId,
            'cargoDescricao'      => $cargoDesc,
            'atividadesExercidas' => isset($d['atividadesExercidas']) ? trim((string)$d['atividadesExercidas']) : null,
        ];
    }

    private function validate(array $p, bool $isCreate): ?string
    {
        $ok =
            $p['curriculum_id'] > 0 &&
            $p['inicioMes'] >= 1 && $p['inicioMes'] <= 12 &&
            $p['inicioAno'] >= 1900;

        if (!$ok) return 'Campos obrigatórios inválidos (curriculum_id, inicioMes, inicioAno).';

        if (empty($p['cargo_id']) && ($p['cargoDescricao'] === null || $p['cargoDescricao'] === '')) {
            return 'Informe o cargo (catálogo ou descrição).';
        }

        if ($p['fimMes'] !== null && ($p['fimMes'] < 1 || $p['fimMes'] > 12)) return 'fimMes inválido.';
        if ($p['fimAno'] !== null && $p['fimAno'] < 1900) return 'fimAno inválido.';

        return null;
    }
}

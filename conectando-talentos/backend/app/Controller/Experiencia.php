<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Experiencia extends ControllerMain
{
    // Se quiser permitir carregar a lista de cargos sem sessão, mantenha 'cargos' aqui.
    // Se quiser exigir login, remova 'cargos' daqui.
    public const PUBLIC_ACTIONS = ['cargos'];

    private function expModel()   { return $this->loadModel('CurriculumExperiencia'); }
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /** GET /experiencia/lista/{curriculumId} */
    public function lista(int $curriculumId): void
    {
        if (!Session::get('usuario_id')) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return;
        }
        $itens = $this->expModel()->findByCurriculum($curriculumId);
        Response::json(['status'=>200, 'data'=>$itens]);
    }

    /** GET /experiencia/cargos  → usado pelo <Select> de cargos */
    public function cargos(): void
    {
        // Se removeu 'cargos' de PUBLIC_ACTIONS, mantenha a checagem de sessão:
        if (!Session::get('usuario_id')) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return;
        }

        // Use o método que EXISTE no seu CargoModel (aqui assumimos 'lista')
        $rows = $this->cargoModel()->lista('descricao', 'ASC');

        Response::json([
            'status' => 200,
            // formato simples e estável para o front
            'cargos' => array_map(fn($c) => [
                'cargo_id'  => (int) $c['cargo_id'],
                'descricao' => (string) $c['descricao'],
            ], $rows),
        ]);
    }

    /** POST /experiencia/criar */
    public function criar(): void
    {
        if (!Session::get('usuario_id')) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return;
        }

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
        if (!Session::get('usuario_id')) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return;
        }

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
        if (!Session::get('usuario_id')) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return;
        }

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
        // empregoAtual (checkbox) → se true: fimMes/fimAno = NULL
        $empregoAtual = !empty($d['empregoAtual']);
        $fimMes = $empregoAtual ? null : (isset($d['fimMes']) ? (int)$d['fimMes'] : null);
        $fimAno = $empregoAtual ? null : (isset($d['fimAno']) ? (int)$d['fimAno'] : null);

        // cargo_id pode vir vazio; cargoDescricao é texto livre
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

        // requer pelo menos um dos dois: cargo_id OU cargoDescricao
        if (empty($p['cargo_id']) && ($p['cargoDescricao'] === null || $p['cargoDescricao'] === '')) {
            return 'Informe o cargo (catálogo ou descrição).';
        }

        // coerência de fimMes/fimAno quando não forem NULL
        if ($p['fimMes'] !== null && ($p['fimMes'] < 1 || $p['fimMes'] > 12)) return 'fimMes inválido.';
        if ($p['fimAno'] !== null && $p['fimAno'] < 1900) return 'fimAno inválido.';

        return null;
    }
}

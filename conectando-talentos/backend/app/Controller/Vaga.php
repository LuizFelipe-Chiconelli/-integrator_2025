<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Vaga extends ControllerMain
{
    public const PUBLIC_ACTIONS = ['cargos'];

    private function vagaModel()      { return $this->loadModel('VagaModel'); }
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /* GET /vaga/cargos */
    public function cargos(): void
    {
        $rows = $this->cargoModel()->lista('descricao', 'ASC');
        Response::json([
            'status'=>200,
            'cargos'=>array_map(fn($c)=>[
                'cargo_id'=>(int)$c['cargo_id'],
                'descricao'=>(string)$c['descricao'],
            ], $rows)
        ]);
    }

    /* GET /vaga/lista(/estabelecimentoId) */
    public function lista(int $estabelecimentoId = 0): void
    {
        $eid = $this->resolveEstabelecimentoId($estabelecimentoId);
        if ($eid<=0){ Response::json(['status'=>401,'mensagem'=>'Empresa não identificada.']); return; }

        $status = isset($_GET['status']) ? (int)$_GET['status'] : null;
        $rows = $this->vagaModel()->listarPorEstabelecimento($eid, $status);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /* GET /vaga/lista-com-cargo(/estabelecimentoId) */
    public function listaComCargo(int $estabelecimentoId = 0): void
    {
        $eid = $this->resolveEstabelecimentoId($estabelecimentoId);
        if ($eid<=0){ Response::json(['status'=>401,'mensagem'=>'Empresa não identificada.']); return; }

        $status = isset($_GET['status']) ? (int)$_GET['status'] : null;
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo($eid, $status);
        Response::json(['status'=>200,'data'=>$rows]);
    }

    /* GET /vaga/detalhe/{id} */
    public function detalhe(int $id = 0): void
    {
        if ($id<=0){ Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }
        $row = $this->vagaModel()->findById($id);
        if (!$row){ Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); return; }
        Response::json(['status'=>200,'data'=>$row]);
    }

    /* POST /vaga/publicar */
    public function publicar(): void
    {
        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if (empty($payload['estabelecimento_id'])) {
            $payload['estabelecimento_id'] = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        }

        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422,'mensagem'=>$err]); return;
        }

        try {
            $id = $this->vagaModel()->criarVaga($payload);
            Response::json(['status'=>201,'data'=>['vaga_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao publicar vaga.','erro'=>$e->getMessage()]);
        }
    }

    /* PUT /vaga/atualizar/{id} */
    public function atualizar(int $id = 0): void
    {
        if ($id<=0){ Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);

        if (empty($payload['estabelecimento_id'])) {
            $payload['estabelecimento_id'] = (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
        }

        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422,'mensagem'=>$err]); return;
        }

        try {
            $rows = $this->vagaModel()->atualizarPorId($id, $payload);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar vaga.','erro'=>$e->getMessage()]);
        }
    }

    /* PATCH /vaga/status/{id} */
    public function status(int $id = 0): void
    {
        if ($id<=0){ Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $novo  = (int)($dados['statusVaga'] ?? 0);
        if ($novo<=0){ Response::json(['status'=>422,'mensagem'=>'statusVaga inválido.']); return; }

        try {
            $rows = $this->vagaModel()->atualizarStatus($id, $novo);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar status da vaga.','erro'=>$e->getMessage()]);
        }
    }

    /* DELETE /vaga/remover/{id} */
    public function remover(int $id = 0): void
    {
        if ($id<=0){ Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        try {
            $rows = $this->vagaModel()->excluirPorId($id);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao remover vaga.','erro'=>$e->getMessage()]);
        }
    }

    /* Helpers */
    private function sanitize(array $d): array
    {
        $sobre    = $d['sobreVaga'] ?? $d['sobreaVaga'] ?? '';
        $dtInicio = $this->parseDate($d['dtInicio'] ?? '') ?: date('Y-m-d');
        $dtFim    = $this->parseDate($d['dtFim'] ?? '') ?: null;

        return [
            'cargo_id'           => (int)($d['cargo_id'] ?? 0),
            'descricao'          => isset($d['descricao']) ? trim((string)$d['descricao']) : '',
            'sobreaVaga'         => trim((string)$sobre),
            'modalidade'         => (int)($d['modalidade'] ?? 0),
            'vinculo'            => (int)($d['vinculo'] ?? 0),
            'dtInicio'           => $dtInicio,
            'dtFim'              => $dtFim,
            'estabelecimento_id' => (int)($d['estabelecimento_id'] ?? 0),
            'statusVaga'         => (int)($d['statusVaga'] ?? 11),
        ];
    }

    private function validate(array $p): ?string
    {
        if ($p['estabelecimento_id'] <= 0) return 'estabelecimento_id inválido.';
        if ($p['cargo_id'] <= 0) return 'cargo_id inválido.';
        if ($p['descricao'] === '' || mb_strlen($p['descricao']) > 60) return 'descricao inválida (1–60 chars).';
        if ($p['modalidade'] <= 0) return 'modalidade inválida.';
        if ($p['vinculo'] <= 0) return 'vinculo inválido.';
        return null;
    }

    private function parseDate(?string $s): ?string
    {
        $s = trim((string)$s);
        if ($s === '') return null;
        $t = strtotime($s);
        return $t ? date('Y-m-d', $t) : null;
    }

    private function resolveEstabelecimentoId(int $estabelecimentoIdParam = 0): int
    {
        if ($estabelecimentoIdParam > 0) return $estabelecimentoIdParam;
        return (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
    }
}

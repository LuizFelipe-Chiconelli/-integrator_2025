<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * CRUD de Vagas
 *
 * Rotas públicas:
 *   GET  /vaga/cargos
 *   GET  /vaga/lista-publica
 *   GET  /vaga/detalhe/{id}
 *
 * Rotas privadas (empresa logada):
 *   GET    /vaga/minhas
 *   POST   /vaga/publicar
 *   PUT    /vaga/atualizar/{id}
 *   PATCH  /vaga/status/{id}
 *   DELETE /vaga/remover/{id}
 */
class Vaga extends ControllerMain
{
    /** Rotas públicas */
    public const PUBLIC_ACTIONS = ['cargos', 'listaPublica', 'detalhe'];

    /* ========== Helpers de model ========== */
    private function vagaModel()  { return $this->model; }
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /* ========== Rotas públicas ========== */

    /** GET /vaga/cargos */
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

    /** GET /vaga/lista-publica?status=11 */
    public function listaPublica(): void
    {
        $status = isset($_GET['status']) ? (int) $_GET['status'] : 11;

        // usa método “com cargo”; se $eid = 0, lista público
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo(0, $status);

        Response::json(['status' => 200, 'data' => $rows]);
    }

    /** GET /vaga/detalhe/{id} */
    public function detalhe(int $id = 0): void
    {
        if ($id <= 0) { Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        $row = $this->vagaModel()->findById($id);
        if (!$row) { Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); return; }

        Response::json(['status'=>200,'data'=>$row]);
    }

    /* ========== Rotas privadas (empresa logada) ========== */

    /** GET /vaga/minhas */
    public function minhas(): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }

        $status = isset($_GET['status']) ? (int) $_GET['status'] : null;
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo($eid, $status);

        Response::json(['status'=>200,'data'=>$rows]);
    }

    /** POST /vaga/publicar */
    public function publicar(): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }

        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);
        $payload['estabelecimento_id'] = $eid;

        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422,'mensagem'=>$err]); return;
        }

        try {
            $id = (int) $this->vagaModel()->criarVaga($payload);

            // somente 201 se realmente inseriu
            if ($id <= 0) {
                $motivo = Session::getDestroy('msgError') ?: 'Falha ao inserir no banco.';
                Response::json(['status'=>500,'mensagem'=>'Erro ao publicar vaga.','erro'=>$motivo]);
                return;
            }

            Response::json(['status'=>201,'data'=>['vaga_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao publicar vaga.','erro'=>$e->getMessage()]);
        }
    }

    /** PUT /vaga/atualizar/{id} */
    public function atualizar(int $id = 0): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }
        if ($id  <= 0) { Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        if (!$this->empresaPodeAlterar($eid, $id)) return;

        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);
        $payload['estabelecimento_id'] = $eid;

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

    /** PATCH /vaga/status/{id} */
    public function status(int $id = 0): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }
        if ($id  <= 0) { Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        if (!$this->empresaPodeAlterar($eid, $id)) return;

        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $novo  = (int)($dados['statusVaga'] ?? 0);
        if ($novo <= 0) { Response::json(['status'=>422,'mensagem'=>'statusVaga inválido.']); return; }

        try {
            $rows = $this->vagaModel()->atualizarStatus($id, $novo);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar status da vaga.','erro'=>$e->getMessage()]);
        }
    }

    /** DELETE /vaga/remover/{id} */
    public function remover(int $id = 0): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }
        if ($id  <= 0) { Response::json(['status'=>400,'mensagem'=>'ID inválido.']); return; }

        if (!$this->empresaPodeAlterar($eid, $id)) return;

        try {
            $rows = $this->vagaModel()->excluirPorId($id);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao remover vaga.','erro'=>$e->getMessage()]);
        }
    }

    /* ========== Helpers internos ========== */

    private function getLoggedEmpresaId(): int
    {
        return (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
    }

    private function empresaPodeAlterar(int $empresaId, int $vagaId): bool
    {
        $vaga = $this->vagaModel()->findById($vagaId);
        if (!$vaga) {
            Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']);
            return false;
        }
        if ((int)$vaga['estabelecimento_id'] !== $empresaId) {
            Response::json(['status'=>403,'mensagem'=>'Você não tem permissão para alterar esta vaga.']);
            return false;
        }
        return true;
    }

    private function sanitize(array $d): array
    {
    $dtInicio = $this->parseDateFlexible($d['dtInicio'] ?? '') ?: date('Y-m-d');
    $dtFim    = $this->parseDateFlexible($d['dtFim'] ?? '') ?: null;

    return [
        // título (nome da vaga)
        'titulo'             => isset($d['titulo']) ? trim((string)$d['titulo']) : '',

        // texto longo
        'descricao'          => trim((string)($d['descricao'] ?? '')),

        // catálogo ou texto livre
        'cargo_id'           => ($d['cargo_id'] ?? null) !== null && $d['cargo_id'] !== '' ? (int)$d['cargo_id'] : null,

        // demais campos
        'requisitos'         => trim((string)($d['requisitos']   ?? '')),
        'localizacao'        => trim((string)($d['localizacao']  ?? '')),
        'salario'            => trim((string)($d['salario']      ?? '')),
        'nivel'              => (int)($d['nivel'] ?? 0),
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

    // título obrigatório (nome da vaga, até 60 chars)
    if ($p['titulo'] === '' || mb_strlen($p['titulo']) > 60) return 'titulo inválido (1–60 chars).';

    // cargo do catálogo é obrigatório agora
    if (empty($p['cargo_id']) || (int)$p['cargo_id'] <= 0) return 'cargo_id inválido.';

    // modalidade/vínculo
    if ((int)$p['modalidade'] <= 0) return 'modalidade inválida.';
    if ((int)$p['vinculo']    <= 0) return 'vinculo inválido.';

    // requisitos obrigatório
    if (trim((string)$p['requisitos']) === '') return 'requisitos é obrigatório.';

    // dtFim obrigatório e no formato ISO yyyy-mm-dd
    if (empty($p['dtFim']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $p['dtFim'])) {
        return 'dtFim inválida.';
    }

    return null;
}




    /** aceita: yyyy-mm-dd, dd/mm/yyyy, dd-mm-yyyy e ddmmyyyy */
    private function parseDateFlexible(?string $s): ?string
    {
    $s = trim((string)$s);
    if ($s === '') return null;

    // ddmmyyyy (somente dígitos)
    if (preg_match('/^(\d{2})(\d{2})(\d{4})$/', $s, $m)) {
        return "{$m[3]}-{$m[2]}-{$m[1]}";
    }

    // dd/mm/yyyy ou dd-mm-yyyy
    if (preg_match('/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/', $s, $m)) {
        return "{$m[3]}-{$m[2]}-{$m[1]}";
    }

    // tenta parsing nativo (já cobre yyyy-mm-dd)
    $t = strtotime(str_replace('/', '-', $s));
    return $t ? date('Y-m-d', $t) : null;
}
    
}

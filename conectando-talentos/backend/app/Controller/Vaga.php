<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Vaga extends ControllerMain
{
    /** Rotas públicas (mantenho os 3 nomes) */
    public const PUBLIC_ACTIONS = ['cargos', 'listaPublica', 'lista_publica', 'detalhe'];

    /* ========== Helpers de model ========== */
    private function vagaModel()  { return $this->model; }
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /* ========== Rotas públicas ========== */

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

    /** GET /vaga/listaPublica  ou  /vaga/listaPublica/11  (sem query string) */
    public function listaPublica(string $action = null, int $id = 0): void
    {
        $status = ($id > 0) ? (int)$id : 11;
        
        // ✅ CORRIGIDO: O método atualizado já se chama listarPorEstabelecimentoComCargo() 
        // (não listarPorEstabelecimentoComCargoCompleto())
        // Ele já inclui dados da empresa automaticamente
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo(0, $status);
        
        Response::json(['status' => 200, 'data' => $rows]);
    }

    /** GET /vaga/detalhe/{id} */
    public function detalhe(int $id = 0): void
    {
        if ($id <= 0) { 
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']); 
            return; 
        }

        // ✅ CORRETO: Usar o novo método completo
        $row = $this->vagaModel()->findByIdCompleta($id);
        if (!$row) { 
            Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); 
            return; 
        }

        $row['sobreVaga'] = $row['descricao'] ?? ($row['sobreaVaga'] ?? '');
        Response::json(['status'=>200,'data'=>$row]);
    }

    /* ========== Rotas privadas (empresa logada) ========== */

    public function minhas(): void
    {
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); return; }

        $status = isset($_GET['status']) ? (int) $_GET['status'] : null;
        
        // ✅ Para "minhas vagas" também usamos o método atualizado que inclui dados da empresa
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo($eid, $status);

        Response::json(['status'=>200,'data'=>$rows]);
    }

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
        if (!$vaga) { Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); return false; }
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
            'titulo'             => isset($d['titulo']) ? trim((string)$d['titulo']) : '',
            'descricao'          => trim((string)($d['descricao'] ?? '')),
            'cargo_id'           => ($d['cargo_id'] ?? null) !== null && $d['cargo_id'] !== '' ? (int)$d['cargo_id'] : null,
            'requisitos'         => trim((string)($d['requisitos']   ?? '')),
            'localizacao'        => trim((string)($d['localizacao']  ?? '')),
            'salario_minimo'     => isset($d['salario_minimo']) ? trim((string)$d['salario_minimo']) : '',
            'salario_maximo'     => isset($d['salario_maximo']) ? trim((string)$d['salario_maximo']) : '',
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
        if ($p['titulo'] === '' || mb_strlen($p['titulo']) > 60) return 'titulo inválido (1–60 chars).';
        if (empty($p['cargo_id']) || (int)$p['cargo_id'] <= 0) return 'cargo_id inválido.';
        if ((int)$p['modalidade'] <= 0) return 'modalidade inválida.';
        if ((int)$p['vinculo']    <= 0) return 'vinculo inválido.';
        if (trim((string)$p['requisitos']) === '') return 'requisitos é obrigatório.';
        if (empty($p['dtFim']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $p['dtFim'])) return 'dtFim inválida.';
        
        // Validação dos salários (opcional - podem ser vazios)
        if (!empty($p['salario_minimo']) && !empty($p['salario_maximo'])) {
            // Converter para número para comparação
            $min = $this->converterSalarioParaNumero($p['salario_minimo']);
            $max = $this->converterSalarioParaNumero($p['salario_maximo']);
            
            if ($min !== null && $max !== null && $min > $max) {
                return 'salario_minimo não pode ser maior que salario_maximo.';
            }
        }
        
        return null;
    }

    /** Converte string de salário (R$ 4.000,00) para número */
    private function converterSalarioParaNumero(string $salarioString): ?float
    {
        // Remove "R$", pontos e converte vírgula para ponto
        $limpo = preg_replace('/[^\d,]/', '', $salarioString);
        $limpo = str_replace(',', '.', str_replace('.', '', $limpo));
        
        return is_numeric($limpo) ? (float)$limpo : null;
    }

    /** aceita: yyyy-mm-dd, dd/mm/yyyy, dd-mm-yyyy e ddmmyyyy */
    private function parseDateFlexible(?string $s): ?string
    {
        $s = trim((string)$s);
        if ($s === '') return null;

        if (preg_match('/^(\d{2})(\d{2})(\d{4})$/', $s, $m)) return "{$m[3]}-{$m[2]}-{$m[1]}";
        if (preg_match('/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/', $s, $m)) return "{$m[3]}-{$m[2]}-{$m[1]}";

        $t = strtotime(str_replace('/', '-', $s));
        return $t ? date('Y-m-d', $t) : null;
    }
}
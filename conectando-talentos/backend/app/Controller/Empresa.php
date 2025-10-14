<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Session;
use Core\Library\Response;

class Empresa extends ControllerMain
{
    /** Métodos acessíveis sem sessão */
    public const PUBLIC_ACTIONS = ['cadastrar', 'login', 'logout'];

    /* ================= CADASTRO ================= */
    public function cadastrar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (
            empty($dados['nome'])  ||
            empty($dados['cnpj'])  ||
            empty($dados['email']) ||
            empty($dados['senha'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos obrigatórios.']);
            return;
        }

        if ($this->model->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }
        if ($this->model->verificarCnpjExistente(preg_replace('/\D/', '', $dados['cnpj']))) {
            Response::json(['status'=>409,'mensagem'=>'CNPJ já cadastrado.']);
            return;
        }

        $payload = [
            'nome'      => trim($dados['nome']),
            'cnpj'      => preg_replace('/\D/', '', $dados['cnpj']),
            'endereco'  => $dados['endereco']  ?? '',
            'email'     => strtolower(trim($dados['email'])),
            'descricao' => $dados['descricao'] ?? '',
            'website'   => $dados['website']   ?? null,
            'setor'     => $dados['setor']     ?? null,
            'linkedin'  => $dados['linkedin']  ?? null,
            'instagram' => $dados['instagram'] ?? null,
            'facebook'  => $dados['facebook']  ?? null,
            'senha'     => password_hash($dados['senha'], PASSWORD_DEFAULT)
        ];

        try {
            $id = $this->model->cadastrarEmpresa($payload);
            Response::json(['status'=>201,'mensagem'=>'Empresa cadastrada com sucesso!','id'=>$id]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao cadastrar empresa.','erro'=>$e->getMessage()]);
        }
    }

    /* ================= LOGIN ================= */
    public function login(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        $empresa = $this->model->verificarEmailExistente($dados['email']);
        if (!$empresa || !password_verify($dados['senha'], $empresa['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        // 🔐 Sessão padronizada
        Session::set('empresa_id',          (int)$empresa['estabelecimento_id']);
        Session::set('estabelecimento_id',  (int)$empresa['estabelecimento_id']); // chave extra para guard de vagas
        Session::set('empresa_nome',        (string)$empresa['nome']);
        Session::set('empresa_email',       (string)$empresa['email']);
        session_regenerate_id(true);

        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'empresa' => [
                'id'    => (int)$empresa['estabelecimento_id'],
                'nome'  => (string)$empresa['nome'],
                'email' => (string)$empresa['email']
            ]
        ]);
    }

    /* ================= PERFIL (GET/POST) ================= */
    public function perfil(): void
    {
        $empresaId = (int) Session::get('empresa_id');
        if (!$empresaId) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
            return;
        }

        $metodo = $_SERVER['REQUEST_METHOD'];

        // GET
        if ($metodo === 'GET') {
            $empresa = $this->model->findById($empresaId);
            if (!$empresa) {
                Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
                return;
            }

            unset($empresa['senha']);

            $telefones = $this->loadModel('Telefone')->buscarPorEmpresa($empresaId);

            Response::json([
                'status'    => 200,
                'empresa'   => $empresa,
                'telefones' => $telefones
            ]);
            return;
        }

        // POST (atualiza)
        if ($metodo === 'POST') {
            $dados = json_decode(file_get_contents('php://input'), true) ?? [];

            $empresaAtual = $this->model->findById($empresaId);
            if (!$empresaAtual) {
                Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
                return;
            }

            unset($empresaAtual['senha']);

            $payload = [
                'nome'      => trim($dados['nome'] ?? $empresaAtual['nome']),
                'cnpj'      => preg_replace('/\D/', '', $dados['cnpj'] ?? $empresaAtual['cnpj']),
                'endereco'  => $dados['endereco']  ?? $empresaAtual['endereco'],
                'email'     => strtolower(trim($dados['email'] ?? $empresaAtual['email'])),
                'descricao' => $dados['descricao'] ?? $empresaAtual['descricao'],
                'website'   => $dados['website']   ?? $empresaAtual['website'],
                'setor'     => $dados['setor']     ?? $empresaAtual['setor'],
                'linkedin'  => $dados['linkedin']  ?? $empresaAtual['linkedin'],
                'instagram' => $dados['instagram'] ?? $empresaAtual['instagram'],
                'facebook'  => $dados['facebook']  ?? $empresaAtual['facebook'],
            ];

            if (!empty($dados['senha'])) {
                $payload['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
            }

            try {
                $this->model->atualizarPorId($empresaId, $payload);

                if (!empty($dados['telefones']) && is_array($dados['telefones'])) {
                    $telModel   = $this->loadModel('Telefone');
                    $existentes = $telModel->buscarPorEmpresa($empresaId);

                    foreach ($existentes as $t) {
                        $telModel->excluir((int)$t['telefone_id']);
                    }
                    foreach ($dados['telefones'] as $numero) {
                        if (trim($numero) !== '') {
                            $telModel->inserir([
                                'estabelecimento_id' => $empresaId,
                                'usuario_id'         => null,
                                'numero'             => $numero,
                                'tipo'               => 'm'
                            ]);
                        }
                    }
                }

                Response::json(['status'=>200,'mensagem'=>'Perfil atualizado com sucesso!']);
            } catch (\Throwable $e) {
                Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar perfil.','erro'=>$e->getMessage()]);
            }
            return;
        }

        Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }

    /* ================= LOGOUT ================= */
    public function logout(): void
    {
        Session::destroy('empresa_id');
        Session::destroy('estabelecimento_id');
        Session::destroy('empresa_nome');
        Session::destroy('empresa_email');
        session_destroy();

        Response::json(['status'=>200,'mensagem'=>'Sessão encerrada com sucesso!']);
    }
}

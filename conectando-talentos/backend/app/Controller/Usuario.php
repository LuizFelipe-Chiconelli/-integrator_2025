<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Usuario extends ControllerMain
{
    /** Métodos que não exigem sessão */
    public const PUBLIC_ACTIONS = ['cadastrar', 'login', 'logout'];

    /* ================= CADASTRO ================= */
    public function cadastrar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        $tipo = $dados['tipo'] ?? 'CL'; // CL = candidato

        if (
            empty($dados['nome'])  ||
            empty($dados['email']) ||
            empty($dados['senha']) ||
            empty($dados['aceite'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos e aceite o termo.']);
            return;
        }

        if ($this->model->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }

        $pfId = $this->loadModel('PessoaFisica')->inserir([
            'nome' => trim($dados['nome']),
            'cpf'  => $dados['cpf'] ?? null
        ]);

        $userId = $this->model->cadastrarUsuario([
            'login'            => $dados['email'],
            'senha'            => password_hash($dados['senha'], PASSWORD_DEFAULT),
            'pessoa_fisica_id' => $pfId,
            'tipo'             => $tipo
        ]);

        if ($userId <= 0) {
            Response::json(['status'=>500,'mensagem'=>'Falha ao salvar usuário.']);
            return;
        }

        if ($termo = $this->loadModel('TermoUso')->ultimo()) {
            $this->loadModel('TermoUsoAceite')->registrarAceite([
                'termodeuso_id'  => $termo['id'],
                'usuario_id'     => $userId,
                'dataHoraAceite' => date('Y-m-d H:i:s')
            ]);
        }

        Response::json(['status'=>200,'mensagem'=>'Usuário cadastrado com sucesso!']);
    }

    /* ================= LOGIN ================= */
    public function login(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        $usuario = $this->model->verificarEmailExistente($dados['email']);
        if (!$usuario || !password_verify($dados['senha'], $usuario['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        Session::set('usuario_id',  $usuario['usuario_id']);
        Session::set('usuario_tipo',$usuario['tipo']);
        session_regenerate_id(true);

        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'usuario' => [
                'id'    => $usuario['usuario_id'],
                'email' => $usuario['login'],
                'tipo'  => $usuario['tipo']
            ]
        ]);
    }

    /* =========================================================
    *  LOGOUT  (POST /usuario/logout)
    * =======================================================*/
    public function logout(): void
    {
        Session::destroy('usuario_id');
        Session::destroy('usuario_tipo');
        session_destroy();

        Response::json([
            'status'  => 200,
            'mensagem'=> 'Logout realizado com sucesso!'
        ]);
    }


    /* ================= PERFIL ================= */
    public function perfil(): void
    {
        $usuarioId = Session::get('usuario_id');
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'GET') {
            $usuario = $this->model->findById($usuarioId);
            if (!$usuario) {
                Response::json(['status'=>404,'mensagem'=>'Usuário não encontrado.']);
                return;
            }

            $pfId       = (int) $usuario['pessoa_fisica_id'];
            $pessoa     = $this->loadModel('PessoaFisica')->findById($pfId);
            $curriculum = $this->loadModel('Curriculum')->getByPessoaFisica($pfId) ?? [];

            if (!empty($curriculum['cidade_id'])) {
                $cidade = $this->loadModel('Cidade')->findById((int)$curriculum['cidade_id']);
                if ($cidade) {
                    $curriculum['cidade'] = $cidade['cidade'];
                    $curriculum['uf']     = $cidade['uf'];
                }
            }

            Response::json([
                'status'        => 200,
                'usuario'       => [
                    'id'    => $usuario['usuario_id'],
                    'login' => $usuario['login'],
                    'tipo'  => $usuario['tipo']
                ],
                'pessoa_fisica' => $pessoa,
                'curriculum'    => $curriculum
            ]);
            return;
        }

        if ($metodo === 'POST') {
            $dados = json_decode(file_get_contents('php://input'), true) ?? [];

            if (empty($dados['nome']) || empty($dados['cpf'])) {
                Response::json(['status'=>422,'mensagem'=>'Nome e CPF são obrigatórios.']);
                return;
            }

            $usuario = $this->model->findById($usuarioId);
            if (!$usuario) {
                Response::json(['status'=>404,'mensagem'=>'Usuário não encontrado.']);
                return;
            }

            $pfId = (int) $usuario['pessoa_fisica_id'];

            $this->loadModel('PessoaFisica')->updateById($pfId, [
                'nome' => trim($dados['nome']),
                'cpf'  => preg_replace('/\D/','', $dados['cpf'])
            ]);

            try {
                $curriculumId = $this->loadModel('Curriculum')
                    ->updateByPessoaFisica($pfId, [
                        'logradouro'          => $dados['logradouro']          ?? '',
                        'bairro'              => $dados['bairro']              ?? '',
                        'cep'                 => preg_replace('/\D/','', $dados['cep'] ?? ''),
                        'cidade_id'           => (int) ($dados['cidade_id']    ?? 0),
                        'celular'             => preg_replace('/\D/','', $dados['telefone'] ?? ''),
                        'dataNascimento'      => $dados['data_nascimento']     ?? '1900-01-01',
                        'sexo'                => $dados['sexo']                ?? '',
                        'email'               => $dados['email']               ?? $usuario['login'],
                        'numero'              => $dados['numero']              ?? '',
                        'complemento'         => $dados['complemento']         ?? '',
                        'apresentacaoPessoal' => $dados['apresentacao']        ?? ''
                    ]);
            } catch (\PDOException $e) {
                Response::json([
                    'status'   => 500,
                    'mensagem' => 'Erro ao gravar currículo.',
                    'erroSQL'  => $e->getMessage()
                ]);
                return;
            }

            Response::json([
                'status'        => 200,
                'mensagem'      => 'Perfil atualizado com sucesso!',
                'curriculum_id' => $curriculumId
            ]);
            return;
        }

        Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }
}

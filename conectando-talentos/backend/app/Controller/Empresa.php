<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Session;
use Core\Library\Response;

/**
 * Controller para gestão de Empresas (tabela estabelecimento).
 * Endpoints:
 *   POST   /empresa/cadastrar
 *   POST   /empresa/login
 *   GET    /empresa/perfil
 *   POST   /empresa/perfil
 *   POST   /empresa/logout
 */
class Empresa extends ControllerMain
{
    /** Métodos públicos (não exigem sessão) */
    public const PUBLIC_ACTIONS = ['cadastrar', 'login'];

    /* =========================================================
     * CADASTRO  (POST /empresa/cadastrar)
     * =======================================================*/
    public function cadastrar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $empresaModel = $this->loadModel('Estabelecimento'); // ✅ model certo

        if (
            empty($dados['nome'])  ||
            empty($dados['cnpj'])  ||
            empty($dados['email']) ||
            empty($dados['senha'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos obrigatórios.']);
            return;
        }

        if ($empresaModel->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }
        if ($empresaModel->verificarCnpjExistente($dados['cnpj'])) {
            Response::json(['status'=>409,'mensagem'=>'CNPJ já cadastrado.']);
            return;
        }

        $payload = [
            'nome'     => trim($dados['nome']),
            'cnpj'     => preg_replace('/\D/', '', $dados['cnpj']),
            'endereco' => $dados['endereco'] ?? '',
            'email'    => strtolower(trim($dados['email'])),
            'descricao'=> $dados['descricao'] ?? '',
            'senha'    => password_hash($dados['senha'], PASSWORD_DEFAULT)
        ];

        try {
            $id = $empresaModel->cadastrar($payload);
            Response::json(['status'=>201,'mensagem'=>'Empresa cadastrada com sucesso!','id'=>$id]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao cadastrar empresa.','erro'=>$e->getMessage()]);
        }
    }

    /* =========================================================
     * LOGIN  (POST /empresa/login)
     * =======================================================*/
    public function login(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $empresaModel = $this->loadModel('Estabelecimento');

        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        $empresa = $empresaModel->verificarEmailExistente($dados['email']);
        if (!$empresa || !password_verify($dados['senha'], $empresa['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        Session::set('empresa_id', $empresa['estabelecimento_id']);
        Session::set('empresa_nome', $empresa['nome']);
        session_regenerate_id(true);

        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'empresa' => [
                'id'    => $empresa['estabelecimento_id'],
                'nome'  => $empresa['nome'],
                'email' => $empresa['email']
            ]
        ]);
    }

    /* =========================================================
     * PERFIL  (GET/POST /empresa/perfil)
     * =======================================================*/
    public function perfil(): void
    {
        $empresaId = Session::get('empresa_id');
        if (!$empresaId) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
            return;
        }

        $empresaModel = $this->loadModel('Estabelecimento');
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'GET') {
            $empresa = $empresaModel->buscarPorId((int)$empresaId);
            if (!$empresa) {
                Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
                return;
            }

            unset($empresa['senha']);
            Response::json(['status'=>200,'empresa'=>$empresa]);
            return;
        }

        if ($metodo === 'POST') {
            $dados = json_decode(file_get_contents('php://input'), true) ?? [];

            $payload = [
                'nome'     => trim($dados['nome'] ?? ''),
                'cnpj'     => preg_replace('/\D/', '', $dados['cnpj'] ?? ''),
                'endereco' => $dados['endereco'] ?? '',
                'email'    => strtolower(trim($dados['email'] ?? '')),
                'descricao'=> $dados['descricao'] ?? ''
            ];

            if (!empty($dados['senha'])) {
                $payload['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
            }

            try {
                $linhas = $empresaModel->atualizarPorId((int)$empresaId, $payload);
                Response::json(['status'=>200,'mensagem'=>'Perfil atualizado com sucesso!','linhas'=>$linhas]);
            } catch (\Throwable $e) {
                Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar perfil.','erro'=>$e->getMessage()]);
            }
            return;
        }

        Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }

    /* =========================================================
     * LOGOUT  (POST /empresa/logout)
     * =======================================================*/
    public function logout(): void
    {
        Session::destroy('empresa_id');
        Session::destroy('empresa_nome');
        session_regenerate_id(true);

        Response::json(['status'=>200,'mensagem'=>'Sessão encerrada com sucesso!']);
    }
}

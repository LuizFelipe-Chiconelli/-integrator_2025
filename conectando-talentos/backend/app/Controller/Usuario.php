<?php
namespace App\Controller;

use Core\Library\ControllerMain;

/**
 * Controla tudo que diz respeito ao usuário:
 * – cadastro
 * – login
 */
class Usuario extends ControllerMain
{
    /* =========================================================
     *  CADASTRO  (POST /usuario/cadastrar)
     *  =======================================================*/
    public function cadastrar()
    {
        /* 1) JSON que veio do React (nome, email, senha, aceite) */
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        /* 2) Verificações básicas */
        if (
            empty($dados['nome'])   ||
            empty($dados['email'])  ||
            empty($dados['senha'])  ||
            empty($dados['aceite'])     // não marcou o termo
        ) {
            echo json_encode(["status"=>"erro","mensagem"=>"Preencha tudo e aceite o termo."]);
            return;
        }

        /* 3) E-mail já existe? */
        if ($this->model->verificarEmailExistente($dados['email'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"E-mail já cadastrado."]);
            return;
        }

        /* 4) Recupera a última versão do Termo de Uso publicada */
        $termo = $this->loadModel('TermoUso')->ultimo();
        if (!$termo) {
            echo json_encode(["status"=>"erro","mensagem"=>"Termo de Uso não configurado."]);
            return;
        }

        /* 5) Insere o usuário */
        $usuarioId = $this->model->cadastrarUsuario([
            'login'            => $dados['email'],                       // usamos o e-mail como login
            'senha'            => password_hash($dados['senha'], PASSWORD_DEFAULT),
            'pessoa_fisica_id' => null,
            'tipo'             => 'CL'                                   // CL = cliente / candidato
        ]);

        if ($usuarioId <= 0) {
            echo json_encode(["status"=>"erro","mensagem"=>"Falha ao salvar usuário."]);
            return;
        }

        /* 6) Registra que ele aceitou o termo */
        $this->loadModel('TermoUsoAceite')->registrarAceite([
            'termodeuso_id'  => $termo['id'],
            'usuario_id'     => $usuarioId,
            'dataHoraAceite' => date('Y-m-d H:i:s')
        ]);

        /* 7) Tudo OK */
        echo json_encode(["status"=>"sucesso","mensagem"=>"Usuário cadastrado com sucesso!"]);
    }

    /* =========================================================
     *  LOGIN  (POST /usuario/login)
     *  =======================================================*/
    public function login()
    {
        /* 1) JSON com e-mail e senha */
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($dados['email']) || empty($dados['senha'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"Informe e-mail e senha."]);
            return;
        }

        $email = trim($dados['email']);
        $senha = trim($dados['senha']);

        /* 2) Procura usuário pelo e-mail */
        $usuario = $this->model->verificarEmailExistente($email);

        /* 3) Confere a senha usando o hash do banco */
        if (!$usuario || !password_verify($senha, $usuario['senha'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"E-mail ou senha inválidos."]);
            return;
        }

        /* 4) Sucesso – devolve só o necessário ao front */
        echo json_encode([
            "status"   => "sucesso",
            "mensagem" => "Login realizado com sucesso!",
            "usuario"  => [
                "id"    => $usuario['usuario_id'],
                "email" => $usuario['login'],
                "tipo"  => $usuario['tipo']
            ]
        ]);
    }
}

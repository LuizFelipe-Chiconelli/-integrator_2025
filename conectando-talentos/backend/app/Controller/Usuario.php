<?php
namespace App\Controller;

use Core\Library\ControllerMain;

/**
 * Controller responsável pelo cadastro de usuário.
 */
class Usuario extends ControllerMain
{
    /**
     * Rota:  POST  /usuario/cadastrar
     * Recebe JSON do React e cria conta + registra aceite do termo.
     */
    public function cadastrar()
    {
        /* Lê o corpo bruto JSON e converte para array */
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        /* ======= 1. Validações rápidas ======= */
        if (
            empty($dados['nome'])  ||
            empty($dados['email']) ||
            empty($dados['senha']) ||
            empty($dados['aceite'])        // checkbox do termo
        ) {
            echo json_encode(["status"=>"erro","mensagem"=>"Preencha todo o formulário e aceite o termo."]);
            return;
        }

        /* E-mail já cadastrado */
        if ($this->model->verificarEmailExistente($dados['email'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"E-mail já cadastrado."]);
            return;
        }

        /* ======= 2. Busca a última versão do termo ======= */
        $termo = $this->loadModel('TermoUso')->ultimo();
        if (!$termo) {
            echo json_encode(["status"=>"erro","mensagem"=>"Termo de Uso não configurado."]);
            return;
        }

        /* ======= 3. Cria o usuário ======= */
        $usuarioId = $this->model->cadastrarUsuario([
            'login'            => $dados['email'],                        // usamos e-mail como login
            'senha'            => password_hash($dados['senha'], PASSWORD_DEFAULT),
            'pessoa_fisica_id' => null,
            'tipo'             => 'CL'                                    // "CL" = cliente/candidato
        ]);

        if ($usuarioId <= 0) {
            echo json_encode(["status"=>"erro","mensagem"=>"Falha ao salvar usuário."]);
            return;
        }

        /* ======= 4. Registra o aceite do termo ======= */
        $this->loadModel('TermoUsoAceite')->registrarAceite([
            'termodeuso_id' => $termo['id'],          // PK da tabela termodeuso
            'usuario_id'    => $usuarioId,
            'dataHoraAceite'=> date('Y-m-d H:i:s')
        ]);

        /* ======= 5. Resposta final ======= */
        echo json_encode(["status"=>"sucesso","mensagem"=>"Usuário cadastrado com sucesso!"]);
    }
}

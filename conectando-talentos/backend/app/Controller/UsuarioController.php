<?php

namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Database;
use Core\Library\Validator;
use Core\Library\Request;

class UsuarioController extends ControllerMain
{
    public function cadastrar()
    {
        header('Content-Type: application/json');

        $dados = Request::all();

        // Regras de validação
        $rules = [
            "nome" => ["label" => "Nome", "rules" => "required|min:3|max:100"],
            "email" => ["label" => "E-mail", "rules" => "required|email"],
            "senha" => ["label" => "Senha", "rules" => "required|min:6"]
        ];

        if (Validator::make($dados, $rules)) {
            echo json_encode([
                "status" => "erro",
                "mensagem" => "Validação falhou.",
                "erros" => $_SESSION['errors'] ?? []
            ]);
            return;
        }

        $db = new Database(
            $_ENV['DB_CONNECTION'],
            $_ENV['DB_HOST'],
            $_ENV['DB_PORT'],
            $_ENV['DB_DATABASE'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASSWORD']
        );

        $db->table("usuario")->insert([
            "nome" => $dados["nome"],
            "email" => $dados["email"],
            "senha" => password_hash($dados["senha"], PASSWORD_DEFAULT)
        ]);

        echo json_encode(["status" => "sucesso", "mensagem" => "Usuário cadastrado com sucesso."]);
    }
}

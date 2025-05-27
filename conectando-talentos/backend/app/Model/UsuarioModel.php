<?php
namespace App\Model;

use Core\Library\ModelMain;

class UsuarioModel extends ModelMain
{
    /** Define o nome da tabela que será usada por este model */
    protected $table = 'usuario';

    /**
     * Verifica se já existe um usuário com esse e-mail (armazenado na coluna "login").
     * @param string $email  E-mail informado pelo usuário
     * @return array|null    Retorna os dados do usuário, ou null se não existir
     */
    public function verificarEmailExistente(string $email): ?array
    {
        return $this->db
            ->where('login', $email)
            ->first(); // Retorna a primeira linha encontrada ou null
    }

    /**
     * Insere um novo usuário na tabela e retorna o ID gerado.
     * @param array $dados   Campos e valores do novo usuário
     * @return int           ID do usuário criado, ou 0 em caso de erro
     */
    public function cadastrarUsuario(array $dados): int
    {
        return $this->db->insert($dados);
    }

    /**
     * Autentica o usuário com base no e-mail (login) e senha.
     * @param string $email  E-mail inserido no formulário
     * @param string $senha  Senha inserida pelo usuário
     * @return array|false   Dados do usuário autenticado ou false se inválido
     */
    public function autenticar(string $email, string $senha)
    {
        // Busca usuário com esse e-mail
        $usuario = $this->db->where("login", $email)->first();

        // Verifica se a senha está correta usando hash
        if ($usuario && password_verify($senha, $usuario['senha'])) {
            unset($usuario['senha']); // Remove a senha por segurança
            return $usuario;
        }

        // Retorna false se e-mail ou senha estiverem incorretos
        return false;
    }
}

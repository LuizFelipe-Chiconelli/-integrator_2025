<?php
namespace App\Model;

use Core\Library\ModelMain;

class UsuarioModel extends ModelMain
{
    /** Nome da tabela e chave primária */
    protected $table      = 'usuario';
    protected $primaryKey = 'usuario_id';

    /* =========================================================
     * 1) Verifica se já existe e-mail cadastrado
     * =======================================================*/
    public function verificarEmailExistente(string $email): ?array
    {
        return $this->db
            ->where('login', $email)
            ->first();
    }

    /* =========================================================
     * 2) INSERIR novo usuário  (retorna o ID gerado)
     * =======================================================*/
    public function cadastrarUsuario(array $dados): int
    {
            return $this->db->insert($dados);   
    }

    /* =========================================================
     * 3) Autenticar login
     * =======================================================*/
    public function autenticar(string $email, string $senha)
    {
        $usuario = $this->db->where('login', $email)->first();

        if ($usuario && password_verify($senha, $usuario['senha'])) {
            unset($usuario['senha']);          // segurança
            return $usuario;
        }
        return false;
    }

    /* =========================================================
     * 4) Alias findById() – usado no controller
     * =======================================================*/
    public function findById(int $id): ?array
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->first();
    }
}

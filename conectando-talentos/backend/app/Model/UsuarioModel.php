<?php
namespace App\Model;

use Core\Library\ModelMain;

class UsuarioModel extends ModelMain
{
    /** Nome da tabela deste Model */
    protected $table = 'usuario';

    /**
     * Verifica se já existe um usuário com esse e-mail.
     * @return array|null  Linha encontrada ou null
     */
    public function verificarEmailExistente(string $email): ?array
    {
        return $this->db
            ->where('login', $email)
            ->first();               // array|null
    }

    /**
     * Insere o usuário e devolve o ID gerado.
     * @return int  PK gerada (0 em caso de erro)
     */
    public function cadastrarUsuario(array $dados): int
    {
        return $this->db->insert($dados);
    }
}

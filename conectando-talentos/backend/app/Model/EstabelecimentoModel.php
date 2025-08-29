<?php
namespace App\Model;

use Core\Library\ModelMain;

class EstabelecimentoModel extends ModelMain
{
    /** Nome da tabela e chave primária */
    protected $table      = 'estabelecimento';
    protected $primaryKey = 'estabelecimento_id';

    /* =========================================================
     * 1) Verifica se já existe e-mail cadastrado
     * =======================================================*/
    public function verificarEmailExistente(string $email): ?array
    {
        return $this->db
            ->where('email', $email)   // no banco o campo é "email"
            ->first();
    }

    /* =========================================================
     * 2) Verifica se já existe CNPJ cadastrado
     * =======================================================*/
    public function verificarCnpjExistente(string $cnpj): ?array
    {
        return $this->db
            ->where('cnpj', $cnpj)
            ->first();
    }

    /* =========================================================
     * 3) INSERIR nova empresa  (retorna o ID gerado)
     * =======================================================*/
    public function cadastrar(array $dados): int
    {
        return $this->db->insert($dados);
    }

    /* =========================================================
     * 4) Buscar empresa por ID
     * =======================================================*/
    public function buscarPorId(int $id): ?array
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->first();
    }

    /* =========================================================
     * 5) Atualizar empresa por ID
     * =======================================================*/
    public function atualizarPorId(int $id, array $dados): int
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->update($dados);
    }
}

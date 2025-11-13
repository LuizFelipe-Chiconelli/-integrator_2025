<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model para a tabela "estabelecimento"
 * 
 * Responsável por operações de CRUD relacionadas às empresas.
 */
class EmpresaModel extends ModelMain
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
            ->where('email', $email)
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
     * 3) Cadastrar nova empresa (retorna o ID gerado)
     * =======================================================*/
    public function cadastrarEmpresa(array $dados): int
    {
        return $this->db->insert($dados);
    }

    /* =========================================================
     * 4) Buscar empresa por ID
     * =======================================================*/
    public function findById(int $id): ?array
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

    /* =========================================================
     * 6) Excluir empresa por ID
     * =======================================================*/
    public function excluir(int $id): int
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->delete();
    }

    /* =========================================================
     * 7) Autenticar login (extra)
     * =======================================================*/
    public function autenticar(string $email, string $senha): ?array
    {
        $empresa = $this->db
            ->where('email', $email)
            ->first();

        if ($empresa && password_verify($senha, $empresa['senha'])) {
            unset($empresa['senha']); // segurança
            return $empresa;
        }
        return null;
    }
}

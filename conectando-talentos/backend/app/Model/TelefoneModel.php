<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela "telefone"
 * -----------------------------
 * Responsável por centralizar os CRUDs de telefones.
 * Pode ser usado tanto para empresas (estabelecimento_id)
 * quanto para usuários (usuario_id).
 */
class TelefoneModel extends ModelMain
{
    protected $table      = "telefone";
    protected $primaryKey = "telefone_id";

    /** Inserir telefone novo */
    public function inserir(array $dados): int
    {
        return $this->db->insert($dados);
    }

    /** Buscar telefones de uma empresa */
    public function buscarPorEmpresa(int $empresaId): array
    {
        return $this->db
            ->where("estabelecimento_id", $empresaId)
            ->findAll();
    }

    /** Buscar telefones de um usuário */
    public function buscarPorUsuario(int $usuarioId): array
    {
        return $this->db
            ->where("usuario_id", $usuarioId)
            ->findAll();
    }

    /** Atualizar telefone por ID */
    public function atualizar(int $telefoneId, array $dados): int
    {
        return $this->db
            ->where($this->primaryKey, $telefoneId)
            ->update($dados);
    }

    /** Excluir telefone por ID */
    public function excluir(int $telefoneId): int
    {
        return $this->db
            ->where($this->primaryKey, $telefoneId)
            ->delete();
    }

    /** Excluir todos os telefones de uma empresa */
    public function deleteByEmpresa(int $empresaId): int
    {
        return $this->db
            ->where("estabelecimento_id", $empresaId)
            ->delete();
    }

    /** Excluir todos os telefones de um usuário */
    public function deleteByUsuario(int $usuarioId): int
    {
        return $this->db
            ->where("usuario_id", $usuarioId)
            ->delete();
    }

    /**
     * Upsert (atualiza se já existir, senão insere)
     * Usado no perfil da empresa/usuário.
     */
    public function upsertEmpresaTelefone(int $empresaId, string $numero): int
    {
        $existente = $this->db
            ->where("estabelecimento_id", $empresaId)
            ->first();

        if ($existente) {
            return $this->db
                ->where("telefone_id", $existente["telefone_id"])
                ->update(["numero" => $numero]);
        } else {
            return $this->db->insert([
                "estabelecimento_id" => $empresaId,
                "usuario_id"         => null,
                "numero"             => $numero,
                "tipo"               => "m"   // padrão móvel
            ]);
        }
    }
}

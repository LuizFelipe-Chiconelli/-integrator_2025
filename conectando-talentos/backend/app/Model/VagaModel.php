<?php
namespace App\Model;

use Core\Library\ModelMain;

class VagaModel extends ModelMain
{
    protected $table      = 'vaga';
    protected $primaryKey = 'vaga_id';

    /* ===== CRUD ===== */

    public function criarVaga(array $dados): int {
        return (int) $this->db->table($this->table)->insert($dados);
    }

    public function atualizarPorId(int $id, array $dados): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($dados);
    }

    public function atualizarStatus(int $id, int $statusVaga): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update(['statusVaga' => $statusVaga]);
    }

    public function excluirPorId(int $id): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }

    public function findById(int $id): ?array {
        $r = $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== Listagens ===== */

    // Minhas vagas (empresa) – mantém filtro por estabelecimento
    public function listarPorEstabelecimento(int $eid, ?int $status = null): array {
        $db = $this->db->table($this->table)
            ->where('estabelecimento_id', $eid)
            ->orderBy($this->primaryKey, 'DESC');

        if ($status !== null) $db->where('statusVaga', $status);

        return $db->findAll();
    }

    // Reutilizável: se $eid > 0 filtra por empresa; se $eid = 0 lista público
    public function listarPorEstabelecimentoComCargo(int $eid = 0, ?int $status = null): array {
        $db = $this->db->table($this->table)
            ->select('vaga.*, cargo.descricao AS cargo_descricao')
            ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
            ->orderBy('vaga.'.$this->primaryKey, 'DESC');

        if ($eid > 0) {
            $db->where('vaga.estabelecimento_id', $eid);
        }
        if ($status !== null) {
            $db->where('vaga.statusVaga', $status);
        }

        return $db->findAll();
    }

    // (Opcional) Detalhe com cargo
    public function findByIdComCargo(int $id): ?array {
        $r = $this->db->table($this->table)
            ->select('vaga.*, cargo.descricao AS cargo_descricao')
            ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
            ->where('vaga.'.$this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== Helpers ===== */

    // (Opcional) Ownership centralizado – útil no controller
    public function pertenceAEmpresa(int $vagaId, int $empresaId): bool {
        $r = $this->db->table($this->table)
            ->select('estabelecimento_id')
            ->where($this->primaryKey, $vagaId)
            ->first();

        return $r && (int)$r['estabelecimento_id'] === (int)$empresaId;
    }
}

<?php
namespace App\Model;

use Core\Library\ModelMain;

class VagaModel extends ModelMain
{
    protected $table      = 'vaga';
    protected $primaryKey = 'vaga_id';

    /* ===== CRUD BÁSICO ===== */

    /** Cria uma nova vaga e retorna o ID gerado */
    public function criarVaga(array $dados): int {
        return (int) $this->db->table($this->table)->insert($dados);
    }

    /** Atualiza uma vaga existente pelo ID */
    public function atualizarPorId(int $id, array $dados): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($dados);
    }

    /** Atualiza apenas o status de uma vaga */
    public function atualizarStatus(int $id, int $statusVaga): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update(['statusVaga' => $statusVaga]);
    }

    /** Exclui uma vaga pelo ID */
    public function excluirPorId(int $id): int {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }

    /** Busca uma vaga pelo ID */
    public function findById(int $id): ?array {
        $r = $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== LISTAGENS ===== */

    /** Lista vagas de uma empresa, com filtro opcional por status */
    public function listarPorEstabelecimento(int $eid, ?int $status = null): array {
        $db = $this->db->table($this->table)
            ->where('estabelecimento_id', $eid)
            ->orderBy($this->primaryKey, 'DESC');

        if ($status !== null) $db->where('statusVaga', $status);

        return $db->findAll();
    }

    // No arquivo VagaModel.php, modifique o método:

/** 
 * ✅ ATUALIZADO: Lista vagas com dados da empresa, cargo E contagem de candidatos 
 */
public function listarPorEstabelecimentoComCargo(int $eid = 0, ?int $status = null): array 
{
    // Primeiro, busca as vagas normalmente
    $db = $this->db->table($this->table)
        ->select("
            vaga.*, 
            cargo.descricao AS cargo_descricao,
            estabelecimento.estabelecimento_id AS empresa_id,
            estabelecimento.nome AS empresa_nome,
            estabelecimento.email AS empresa_email,
            estabelecimento.descricao AS empresa_descricao,
            estabelecimento.website AS empresa_website,
            estabelecimento.setor AS empresa_setor,
            estabelecimento.linkedin AS empresa_linkedin,
            estabelecimento.instagram AS empresa_instagram,
            estabelecimento.facebook AS empresa_facebook
        ")
        ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
        ->join('estabelecimento', 'estabelecimento.estabelecimento_id = vaga.estabelecimento_id', 'LEFT')
        ->orderBy('vaga.'.$this->primaryKey, 'DESC');

    if ($eid > 0) {
        $db->where('vaga.estabelecimento_id', $eid);
    }
    if ($status !== null) {
        $db->where('vaga.statusVaga', $status);
    }

    $vagas = $db->findAll();

    // Se não há vagas, retorna vazio
    if (empty($vagas)) {
        return [];
    }

    // Obtém os IDs das vagas para buscar a contagem
    $vagaIds = array_column($vagas, 'vaga_id');
    
    // Busca a contagem de candidatos usando o CandidaturaModel
    $candidaturaModel = new \App\Model\CandidaturaModel();
    $contagemCandidatos = $candidaturaModel->contarCandidatosPorVaga();

    // Adiciona a contagem a cada vaga
    foreach ($vagas as &$vaga) {
        $vagaId = (int)$vaga['vaga_id'];
        $vaga['total_candidatos'] = $contagemCandidatos[$vagaId] ?? 0;
    }

    return $vagas;
    }
    // No VagaModel.php, atualize o método findByIdCompleta:

    /** ✅ ATUALIZADO: Busca vaga completa com todos os dados + contagem de candidatos */
    public function findByIdCompleta(int $id): ?array 
    {
    // Subquery para contar candidatos
    $subquery = $this->db->table('vaga_curriculum vc')
        ->select('COUNT(vc.curriculum_id)')
        ->where('vc.vaga_id = vaga.vaga_id')
        ->getCompiledSelect();

    $r = $this->db->table($this->table)
        ->select("
            vaga.*, 
            cargo.descricao AS cargo_descricao,
            estabelecimento.estabelecimento_id AS empresa_id,
            estabelecimento.nome AS empresa_nome,
            estabelecimento.cnpj AS empresa_cnpj,
            estabelecimento.email AS empresa_email,
            estabelecimento.endereco AS empresa_endereco,
            estabelecimento.descricao AS empresa_descricao,
            estabelecimento.website AS empresa_website,
            estabelecimento.setor AS empresa_setor,
            estabelecimento.linkedin AS empresa_linkedin,
            estabelecimento.instagram AS empresa_instagram,
            estabelecimento.facebook AS empresa_facebook,
            ($subquery) AS total_candidatos
        ")
        ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
        ->join('estabelecimento', 'estabelecimento.estabelecimento_id = vaga.estabelecimento_id', 'LEFT')
        ->where('vaga.'.$this->primaryKey, $id)
        ->first();
    return $r ?: null;
    }
    /** Busca vaga com dados do cargo (mantido para compatibilidade) */
    public function findByIdComCargo(int $id): ?array {
        $r = $this->db->table($this->table)
            ->select('vaga.*, cargo.descricao AS cargo_descricao')
            ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
            ->where('vaga.'.$this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== HELPERS ===== */

    /** Verifica se uma vaga pertence a uma empresa específica */
    public function pertenceAEmpresa(int $vagaId, int $empresaId): bool {
        $r = $this->db->table($this->table)
            ->select('estabelecimento_id')
            ->where($this->primaryKey, $vagaId)
            ->first();

        return $r && (int)$r['estabelecimento_id'] === (int)$empresaId;
    }
}
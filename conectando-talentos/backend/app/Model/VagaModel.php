<?php
namespace App\Model;

use Core\Library\ModelMain;

class VagaModel extends ModelMain
{
    protected $table = 'vaga';
    protected $primaryKey = 'vaga_id';

    /* ===== CRUD BÁSICO ===== */

    /** Cria uma nova vaga e retorna o ID gerado */
    public function criarVaga(array $dados): int
    {
        return (int) $this->db->table($this->table)->insert($dados);
    }

    /** Atualiza uma vaga existente pelo ID */
    public function atualizarPorId(int $id, array $dados): int
    {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update($dados);
    }

    /** Atualiza apenas o status de uma vaga */
    public function atualizarStatus(int $id, int $statusVaga): int
    {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update(['statusVaga' => $statusVaga]);
    }

    /** Exclui uma vaga pelo ID */
    public function excluirPorId(int $id): int
    {
        return (int) $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->delete();
    }

    /** Busca uma vaga pelo ID */
    public function findById(int $id): ?array
    {
        $r = $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== LISTAGENS ===== */

    /** Lista vagas de uma empresa, com filtro opcional por status */
    public function listarPorEstabelecimento(int $eid, ?int $status = null): array
    {
        $db = $this->db->table($this->table)
            ->where('estabelecimento_id', $eid)
            ->orderBy($this->primaryKey, 'DESC');

        if ($status !== null)
            $db->where('statusVaga', $status);

        return $db->findAll();
    }

    /** 
     *  ATUALIZADO: Lista vagas com dados da empresa, cargo, contagem de candidatos E múltiplos filtros
     */
    public function listarPorEstabelecimentoComCargo(
        int $eid = 0,
        ?int $status = null,
        ?string $busca = null,
        ?string $modalidadeVaga = null,
        ?string $nivelExperiencia = null
    ): array {
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
            ->join('estabelecimento', 'estabelecimento.estabelecimento_id = vaga.estabelecimento_id', 'LEFT');

        // ------------------------------------------------------------------
        // FILTROS FIXOS (nivel, modalidadeVaga)
        // ------------------------------------------------------------------
        if (!empty($nivelExperiencia) && $nivelExperiencia !== 'todos') {
            $map = ['junior-trainee' => 1, 'pleno' => 2, 'senior' => 3];
            $db->where('vaga.nivel', $map[$nivelExperiencia]);
        }

        if (!empty($modalidadeVaga) && $modalidadeVaga !== 'todos') {
            $map = ['presencial' => 1, 'remoto' => 2];
            $db->where('vaga.modalidade', $map[$modalidadeVaga]);
        }

        // ------------------------------------------------------------------
        // BUSCA TEXTUAL (OR interno, AND externo)
        // ------------------------------------------------------------------
        if (!empty($busca)) {
            $termo = trim($busca);

            $db->startGroup('AND')
                ->whereLikeRaw('vaga.titulo', $termo)
                ->orWhereLike('vaga.descricao', $termo)
                ->orWhereLike('vaga.requisitos', $termo)
                ->orWhereLike('vaga.localizacao', $termo)
                ->closeGroup();
        }

        // ------------------------------------------------------------------
        // EXECUTA
        // ------------------------------------------------------------------
        $vagas = $db->findAll();

        if (empty($vagas)) {
            return [];
        }

        $candidaturaModel = new \App\Model\CandidaturaModel();
        $contagemCandidatos = $candidaturaModel->contarCandidatosPorVaga();

        foreach ($vagas as &$vaga) {
            $vaga['total_candidatos'] = $contagemCandidatos[$vaga['vaga_id']] ?? 0;
        }

        return $vagas;
    }

    /**  CORRIGIDO: Busca vaga completa com todos os dados + contagem de candidatos */
    public function findByIdCompleta(int $id): ?array
    {
        $vaga = $this->db->table($this->table)
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
            estabelecimento.facebook AS empresa_facebook
        ")
            ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
            ->join('estabelecimento', 'estabelecimento.estabelecimento_id = vaga.estabelecimento_id', 'LEFT')
            ->where('vaga.' . $this->primaryKey, $id)
            ->first();

        if (!$vaga) {
            return null;
        }

        // Busca contagem de candidatos separadamente
        $contagem = $this->db->table('vaga_curriculum')
            ->select('COUNT(curriculum_id) AS total_candidatos')
            ->where('vaga_id', $id)
            ->first();

        $vaga['total_candidatos'] = (int) ($contagem['total_candidatos'] ?? 0);

        return $vaga;
    }
    /** Busca vaga com dados do cargo (mantido para compatibilidade) */
    public function findByIdComCargo(int $id): ?array
    {
        $r = $this->db->table($this->table)
            ->select('vaga.*, cargo.descricao AS cargo_descricao')
            ->join('cargo', 'cargo.cargo_id = vaga.cargo_id', 'LEFT')
            ->where('vaga.' . $this->primaryKey, $id)
            ->first();
        return $r ?: null;
    }

    /* ===== HELPERS ===== */

    /** Verifica se uma vaga pertence a uma empresa específica */
    public function pertenceAEmpresa(int $vagaId, int $empresaId): bool
    {
        $r = $this->db->table($this->table)
            ->select('estabelecimento_id')
            ->where($this->primaryKey, $vagaId)
            ->first();

        return $r && (int) $r['estabelecimento_id'] === (int) $empresaId;
    }
}
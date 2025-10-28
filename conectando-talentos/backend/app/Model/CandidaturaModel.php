<?php
namespace App\Model;

use Core\Library\ModelMain;

class CandidaturaModel extends ModelMain
{
    protected $table = 'vaga_curriculum';
    protected $primaryKey = null; // PK composta

    /* ========= Ações ========= */

    public function aplicar(int $vagaId, int $curriculumId): bool {
        return (bool) $this->db->table($this->table)->insert([
            'vaga_id'           => $vagaId,
            'curriculum_id'     => $curriculumId,
            'statusCandidatura' => 11, // Pendente
            'dataCandidatura'   => date('Y-m-d H:i:s'),
        ]);
    }

    public function remover(int $vagaId, int $curriculumId): int {
        return (int) $this->db->table($this->table)
            ->where('vaga_id', $vagaId)
            ->where('curriculum_id', $curriculumId)
            ->delete();
    }

    public function jaCandidatado(int $vagaId, int $curriculumId): bool {
        $r = $this->db->table($this->table)
            ->where('vaga_id', $vagaId)
            ->where('curriculum_id', $curriculumId)
            ->first();
        return (bool) $r;
    }

    public function atualizarStatus(int $vagaId, int $curriculumId, int $novo): int {
        return (int) $this->db->table($this->table)
            ->where('vaga_id', $vagaId)
            ->where('curriculum_id', $curriculumId)
            ->update(['statusCandidatura' => $novo]);
    }

    /* ========= Listagens ========= */

    /**
     * Lista candidaturas de UMA vaga (visão da EMPRESA).
     * ✅ MANTIDO: Já está bom para empresas
     */
    public function listarPorVaga(int $vagaId): array {
        return $this->db->table($this->table.' vc')
            ->select("
                vc.vaga_id,
                vc.curriculum_id,
                vc.statusCandidatura,
                vc.dataCandidatura,

                v.titulo,
                v.estabelecimento_id,

                pf.nome              AS candidato_nome,
                cur.email            AS candidato_email,
                cur.celular          AS candidato_telefone,

                CONCAT(
                    COALESCE(cid.cidade, ''), 
                    CASE WHEN cid.uf IS NOT NULL AND cid.uf <> '' 
                        THEN CONCAT(', ', cid.uf) 
                        ELSE '' 
                    END
                ) AS candidato_cidade
            ")
            ->join('vaga v',          'v.vaga_id = vc.vaga_id',                 'INNER')
            ->join('curriculum cur',  'cur.curriculum_id = vc.curriculum_id',   'INNER')
            ->join('pessoa_fisica pf','pf.pessoa_fisica_id = cur.pessoa_fisica_id','INNER')
            ->join('cidade cid',      'cid.cidade_id = cur.cidade_id',          'LEFT')
            ->where('vc.vaga_id', $vagaId)
            ->orderBy('vc.dataCandidatura', 'DESC')
            ->findAll();
    }

    /**
     * ✅ ATUALIZADO: Lista candidaturas do candidato com dados COMPLETOS da empresa
     */
    public function listarPorCurriculum(int $curriculumId): array
    {
        return $this->db->table($this->table . ' vc')
            ->select("
                vc.vaga_id,
                vc.curriculum_id,
                vc.statusCandidatura,
                vc.dataCandidatura,
                
                -- Dados da Vaga
                v.titulo,
                v.descricao AS vaga_descricao,
                v.localizacao,
                v.salario,
                v.nivel,
                v.modalidade,
                v.vinculo,
                v.dtInicio,
                v.dtFim,
                
                -- Dados da Empresa (COMPLETOS)
                e.estabelecimento_id AS empresa_id,
                e.nome AS empresa_nome,
                e.email AS empresa_email,
                e.descricao AS empresa_descricao,
                e.website AS empresa_website,
                e.setor AS empresa_setor,
                e.linkedin AS empresa_linkedin,
                e.instagram AS empresa_instagram,
                e.facebook AS empresa_facebook,
                
                -- Dados do Cargo
                cargo.descricao AS cargo_descricao
            ")
            ->join('vaga v', 'v.vaga_id = vc.vaga_id', 'INNER')
            ->join('estabelecimento e', 'e.estabelecimento_id = v.estabelecimento_id', 'LEFT')
            ->join('cargo', 'cargo.cargo_id = v.cargo_id', 'LEFT')
            ->where('vc.curriculum_id', $curriculumId)
            ->orderBy('vc.dataCandidatura', 'DESC')
            ->findAll();
    }

    /**
     * ✅ ATUALIZADO: Detalhe completo da candidatura com dados da empresa
     */
    public function detalheComJoins(int $vagaId, int $curriculumId): ?array 
    {
        $r = $this->db->table($this->table.' vc')
            ->select("
                vc.*,

                -- Dados da Vaga
                v.titulo,
                v.descricao AS vaga_descricao,
                v.requisitos AS vaga_requisitos,
                v.localizacao AS vaga_localizacao,
                v.salario AS vaga_salario,
                v.nivel AS vaga_nivel,
                v.modalidade AS vaga_modalidade,
                v.vinculo AS vaga_vinculo,
                v.dtInicio AS vaga_dtInicio,
                v.dtFim AS vaga_dtFim,
                
                -- Dados da Empresa
                v.estabelecimento_id,
                e.nome AS empresa_nome,
                e.email AS empresa_email,
                e.descricao AS empresa_descricao,
                e.website AS empresa_website,
                e.setor AS empresa_setor,
                
                -- Dados do Candidato
                pf.nome                 AS candidato_nome,
                cur.email               AS candidato_email,
                cur.celular             AS candidato_telefone,
                cur.apresentacaoPessoal AS resumo,

                CONCAT(
                    COALESCE(cid.cidade, ''), 
                    CASE WHEN cid.uf IS NOT NULL AND cid.uf <> '' 
                        THEN CONCAT(', ', cid.uf) 
                        ELSE '' 
                    END
                ) AS candidato_cidade
            ")
            ->join('vaga v',          'v.vaga_id = vc.vaga_id',                 'INNER')
            ->join('estabelecimento e', 'e.estabelecimento_id = v.estabelecimento_id', 'LEFT')
            ->join('curriculum cur',  'cur.curriculum_id = vc.curriculum_id',   'INNER')
            ->join('pessoa_fisica pf','pf.pessoa_fisica_id = cur.pessoa_fisica_id','INNER')
            ->join('cidade cid',      'cid.cidade_id = cur.cidade_id',          'LEFT')
            ->where('vc.vaga_id', $vagaId)
            ->where('vc.curriculum_id', $curriculumId)
            ->first();

        return $r ?: null;
    }
}
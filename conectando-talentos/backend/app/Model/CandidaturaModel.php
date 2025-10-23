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
     * Retorna nome do candidato, título da vaga, e metadados úteis.
     */
    public function listarPorVaga(int $vagaId): array {
        // Ajuste nomes de tabelas/colunas se diferirem no seu schema
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
                )                    AS candidato_cidade
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
     * Lista candidaturas do candidato (visão do CANDIDATO).
     * Retorna título da vaga e status.
     */
    public function listarPorCurriculum(int $curriculumId): array {
        return $this->db->table($this->table.' vc')
            ->select("
                vc.vaga_id,
                vc.curriculum_id,
                vc.statusCandidatura,
                vc.dataCandidatura,
                v.titulo
            ")
            ->join('vaga v', 'v.vaga_id = vc.vaga_id', 'INNER')
            ->where('vc.curriculum_id', $curriculumId)
            ->orderBy('vc.dataCandidatura', 'DESC')
            ->findAll();
    }

    /**
     * Detalhe rico de UMA candidatura (empresa clicou em “Visualizar”).
     * Junta vaga + candidato + currículo + cidade.
     */
    public function detalheComJoins(int $vagaId, int $curriculumId): ?array {
        $r = $this->db->table($this->table.' vc')
            ->select("
                vc.*,

                v.titulo,
                v.estabelecimento_id,

                pf.nome                AS candidato_nome,
                cur.email              AS candidato_email,
                cur.celular            AS candidato_telefone,
                cur.apresentacaoPessoal AS resumo,
                cur.linkedin,
                cur.github,
                cur.portfolio,
                cur.cv_url,

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
            ->where('vc.curriculum_id', $curriculumId)
            ->first();

        return $r ?: null;
    }
}

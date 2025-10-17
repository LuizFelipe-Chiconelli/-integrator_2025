<?php
namespace App\Model;

use Core\Library\ModelMain;

class CandidaturaModel extends ModelMain
{
    protected $table = 'vaga_curriculum';
    // chave composta; não usamos $primaryKey aqui

    /** Verifica se já existe candidatura (evita duplicar) */
    public function jaCandidatou(int $vagaId, int $curriculumId): bool
    {
        $r = $this->db->table($this->table)
            ->select('vaga_id')
            ->where('vaga_id', $vagaId)
            ->where('curriculum_id', $curriculumId)
            ->first();
        return !empty($r);
    }

    /** Aplica (insere) candidatura */
    public function aplicar(int $vagaId, int $curriculumId): bool
    {
        return (bool) $this->db->table($this->table)->insert([
            'vaga_id'         => $vagaId,
            'curriculum_id'   => $curriculumId,
            // dataCandidatura usa DEFAULT CURRENT_TIMESTAMP
        ]);
    }

    /** Remove candidatura (desinscrever) */
    public function remover(int $vagaId, int $curriculumId): int
    {
        return (int) $this->db->table($this->table)
            ->where('vaga_id', $vagaId)
            ->where('curriculum_id', $curriculumId)
            ->delete();
    }

    /** Lista candidaturas de uma vaga (para a empresa) */
    public function listarPorVaga(int $vagaId): array
    {
        $db = $this->db->table($this->table)
            ->where('vaga_id', $vagaId)
            ->orderBy('dataCandidatura', 'DESC');

        // Se quiser enriquecer com dados do currículo:
        // ->select('vc.*, c.nome, c.email')
        // ->from($this->table.' AS vc')
        // ->join('curriculum AS c', 'c.curriculum_id = vc.curriculum_id', 'LEFT')

        return $db->findAll();
    }

    /** Lista candidaturas do candidato (para o usuário/currículo logado) */
    public function listarDoCandidato(int $curriculumId): array
    {
        return $this->db->table($this->table)
            ->where('curriculum_id', $curriculumId)
            ->orderBy('dataCandidatura', 'DESC')
            ->findAll();
    }
}

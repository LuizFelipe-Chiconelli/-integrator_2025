<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * CRUD da tabela curriculum_escolaridade
 * Rotas sugeridas:
 *   GET  /escolaridade/lista/{curriculumId}
 *   POST /escolaridade/criar
 *   PUT  /escolaridade/atualizar/{id}
 *   DELETE /escolaridade/remover/{id}
 */
class Escolaridade extends ControllerMain
{
    /** slug → id (tabela escolaridade) */
    private const MAP_SLUG_TO_ID = [
        'fundamental' => 1,
        'medio'       => 2,
        'tecnico'     => 3,
        'graduacao'   => 4,
        'pos'         => 5,
        'mestrado'    => 6,
        'doutorado'   => 7,
    ];

    /** id → slug (para devolver ao front no GET) */
    private const MAP_ID_TO_SLUG = [
        1 => 'fundamental',
        2 => 'medio',
        3 => 'tecnico',
        4 => 'graduacao',
        5 => 'pos',
        6 => 'mestrado',
        7 => 'doutorado',
    ];

    /** Converte uma string ('medio') ou número para escolaridade_id (int). */
    private function resolveEscolaridadeId($grau): int
    {
        if (is_numeric($grau)) {
            return (int)$grau;
        }
        $slug = strtolower((string)$grau);
        return self::MAP_SLUG_TO_ID[$slug] ?? 0;
    }

    /** GET /escolaridade/lista/{curriculumId} */
    public function lista(int $curriculumId = 0): void
    {
        if ($curriculumId <= 0) {
            Response::json(['status'=>400,'mensagem'=>'curriculumId inválido.']);
            return;
        }

        $rows = $this->loadModel('CurriculumEscolaridade')->findByCurriculum($curriculumId);

        // normaliza para o front atual (campo 'grau' como slug)
        $data = array_map(function(array $r) {
            $slug = self::MAP_ID_TO_SLUG[(int)($r['escolaridade_id'] ?? 0)] ?? '';
            return [
                'curriculum_escolaridade_id' => (int)$r['curriculum_escolaridade_id'],
                'curriculum_curriculum_id'   => (int)$r['curriculum_curriculum_id'],
                'grau'                       => $slug,
                'descricao'                  => $r['descricao']   ?? '',
                'instituicao'                => $r['instituicao'] ?? '',
                'cidade_id'                  => (int)($r['cidade_id'] ?? 0),
                'inicioMes'                  => (int)($r['inicioMes'] ?? 0),
                'inicioAno'                  => (int)($r['inicioAno'] ?? 0),
                'fimMes'                     => (int)($r['fimMes']  ?? 0),
                'fimAno'                     => (int)($r['fimAno']  ?? 0),
            ];
        }, $rows);

        Response::json(['status'=>200,'data'=>$data]);
    }

    /** POST /escolaridade/criar */
    public function criar(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $payload = [
            'curriculum_curriculum_id' => (int)($body['curriculum_curriculum_id'] ?? 0),
            'inicioMes'                => (int)($body['inicioMes'] ?? 0),
            'inicioAno'                => (int)($body['inicioAno'] ?? 0),
            'fimMes'                   => (int)($body['fimMes'] ?? 0),
            'fimAno'                   => (int)($body['fimAno'] ?? 0),
            'descricao'                => (string)($body['descricao']   ?? ''),
            'instituicao'              => (string)($body['instituicao'] ?? ''),
            'cidade_id'                => (int)($body['cidade_id'] ?? 0),
            'escolaridade_id'          => $this->resolveEscolaridadeId($body['grau'] ?? $body['escolaridade_id'] ?? 0),
        ];

        if ($payload['curriculum_curriculum_id'] <= 0) {
            Response::json(['status'=>422,'mensagem'=>'curriculum_curriculum_id obrigatório.']);
            return;
        }

        try {
            $id = $this->loadModel('CurriculumEscolaridade')->create($payload);
            Response::json(['status'=>201,'data'=>['curriculum_escolaridade_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao criar escolaridade','erro'=>$e->getMessage()]);
        }
    }

    /** PUT /escolaridade/atualizar/{id} */
    public function atualizar(int $id = 0): void
    {
        if ($id <= 0) {
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']);
            return;
        }

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = [
            'curriculum_curriculum_id' => (int)($body['curriculum_curriculum_id'] ?? 0),
            'inicioMes'                => (int)($body['inicioMes'] ?? 0),
            'inicioAno'                => (int)($body['inicioAno'] ?? 0),
            'fimMes'                   => (int)($body['fimMes'] ?? 0),
            'fimAno'                   => (int)($body['fimAno'] ?? 0),
            'descricao'                => (string)($body['descricao']   ?? ''),
            'instituicao'              => (string)($body['instituicao'] ?? ''),
            'cidade_id'                => (int)($body['cidade_id'] ?? 0),
            'escolaridade_id'          => $this->resolveEscolaridadeId($body['grau'] ?? $body['escolaridade_id'] ?? 0),
        ];

        try {
            $rows = $this->loadModel('CurriculumEscolaridade')->updateById($id, $payload);
            Response::json(['status'=>200,'data'=>['linhas'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar escolaridade','erro'=>$e->getMessage()]);
        }
    }

    /** DELETE /escolaridade/remover/{id} */
    public function remover(int $id = 0): void
    {
        if ($id <= 0) {
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']);
            return;
        }

        try {
            $rows = $this->loadModel('CurriculumEscolaridade')->deleteById($id);
            Response::json(['status'=>200,'data'=>['linhas'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao excluir escolaridade','erro'=>$e->getMessage()]);
        }
    }
}

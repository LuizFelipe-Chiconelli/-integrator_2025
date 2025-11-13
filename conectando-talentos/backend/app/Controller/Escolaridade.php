<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

/**
 * ESCOLARIDADE CONTROLLER - GERENCIA FORMAÇÃO ACADÊMICA DO CURRÍCULO
 * 
 * Responsável por: CRUD completo da tabela curriculum_escolaridade
 * Gerencia histórico educacional do candidato (ensino fundamental à pós-graduação)
 * Sistema de mapeamento entre slugs amigáveis e IDs do banco
 * Herda de ControllerMain para funcionalidades básicas
 */
class Escolaridade extends ControllerMain
{
    /** 
     * MÉTODOS PRIVADOS - Todas as rotas exigem autenticação
     * Acesso restrito a usuários logados com currículo
     */
    public const PUBLIC_ACTIONS = [];

    /** 
     * MAPEAMENTO SLUG → ID 
     * Converte identificadores amigáveis em IDs do banco de dados
     * Usado para receber dados do front-end de forma intuitiva
     */
    private const MAP_SLUG_TO_ID = [
        'fundamental' => 1,  // Ensino Fundamental
        'medio'       => 2,  // Ensino Médio
        'tecnico'     => 3,  // Curso Técnico
        'graduacao'   => 4,  // Graduação
        'pos'         => 5,  // Pós-graduação
        'mestrado'    => 6,  // Mestrado
        'doutorado'   => 7,  // Doutorado
    ];

    /** 
     * MAPEAMENTO ID → SLUG 
     * Converte IDs do banco em identificadores amigáveis
     * Usado para enviar dados ao front-end de forma intuitiva
     */
    private const MAP_ID_TO_SLUG = [
        1 => 'fundamental',
        2 => 'medio', 
        3 => 'tecnico',
        4 => 'graduacao',
        5 => 'pos',
        6 => 'mestrado',
        7 => 'doutorado',
    ];

    /**
     * RESOLVE ID DA ESCOLARIDADE
     * 
     * Converte grau de escolaridade (string ou número) para ID numérico
     * Suporta ambos os formatos para compatibilidade com front-end
     * 
     * @param mixed $grau Grau de escolaridade ('medio', 2, 'graduacao', etc)
     * @return int ID numérico da escolaridade ou 0 se inválido
     */
    private function resolveEscolaridadeId($grau): int
    {
        //  SE JÁ FOR NÚMERO, CONVERTE DIRETAMENTE
        if (is_numeric($grau)) {
            return (int)$grau;
        }
        
        //  SE FOR STRING, CONVERTE SLUG PARA ID
        $slug = strtolower((string)$grau);
        return self::MAP_SLUG_TO_ID[$slug] ?? 0;
    }

    /**
     * LISTA ESCOLARIDADE - GET /escolaridade/lista/{curriculumId}
     * 
     * Retorna todo o histórico educacional de um currículo
     * Converte IDs internos para slugs amigáveis para o front-end
     * 
     * @param int $curriculumId ID do currículo (obrigatório)
     * @return void Retorna JSON com array de formações
     */
    public function lista(int $curriculumId = 0): void
    {
        //  VALIDA ID DO CURRÍCULO
        if ($curriculumId <= 0) {
            Response::json(['status'=>400,'mensagem'=>'curriculumId inválido.']);
            return;
        }

        //  BUSCA TODAS AS FORMAÇÕES DO CURRÍCULO
        $rows = $this->loadModel('CurriculumEscolaridade')->findByCurriculum($curriculumId);

        //  CONVERTE DADOS DO BANCO PARA FORMATO FRONT-END
        $data = array_map(function(array $r) {
            //  CONVERTE ID DA ESCOLARIDADE PARA SLUG AMIGÁVEL
            $slug = self::MAP_ID_TO_SLUG[(int)($r['escolaridade_id'] ?? 0)] ?? '';
            
            return [
                'curriculum_escolaridade_id' => (int)$r['curriculum_escolaridade_id'], // ID único
                'curriculum_curriculum_id'   => (int)$r['curriculum_curriculum_id'],   // ID do currículo
                'grau'                       => $slug,                                // Slug amigável
                'descricao'                  => $r['descricao']   ?? '',              // Curso/formação
                'instituicao'                => $r['instituicao'] ?? '',              // Nome da instituição
                'cidade_id'                  => (int)($r['cidade_id'] ?? 0),          // Localização
                'inicioMes'                  => (int)($r['inicioMes'] ?? 0),          // Mês de início (1-12)
                'inicioAno'                  => (int)($r['inicioAno'] ?? 0),          // Ano de início
                'fimMes'                     => (int)($r['fimMes']  ?? 0),            // Mês de conclusão
                'fimAno'                     => (int)($r['fimAno']  ?? 0),            // Ano de conclusão
            ];
        }, $rows);

        // RETORNA DADOS FORMATADOS
        Response::json(['status'=>200,'data'=>$data]);
    }

    /**
     * CRIAR ESCOLARIDADE - POST /escolaridade/criar
     * 
     * Adiciona uma nova formação ao histórico educacional
     * Converte slugs amigáveis para IDs do banco automaticamente
     * 
     * @return void Retorna JSON com ID da formação criada
     */
    public function criar(): void
    {
        //  OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        // PREPARA E SANITIZA DADOS PARA INSERÇÃO
        $payload = [
            'curriculum_curriculum_id' => (int)($body['curriculum_curriculum_id'] ?? 0),
            'inicioMes'                => (int)($body['inicioMes'] ?? 0),
            'inicioAno'                => (int)($body['inicioAno'] ?? 0),
            'fimMes'                   => (int)($body['fimMes'] ?? 0),
            'fimAno'                   => (int)($body['fimAno'] ?? 0),
            'descricao'                => (string)($body['descricao']   ?? ''),   // Nome do curso
            'instituicao'              => (string)($body['instituicao'] ?? ''),   // Nome da instituição
            'cidade_id'                => (int)($body['cidade_id'] ?? 0),         // Localidade
            'escolaridade_id'          => $this->resolveEscolaridadeId($body['grau'] ?? $body['escolaridade_id'] ?? 0),
        ];

        //  VALIDA DADO OBRIGATÓRIO
        if ($payload['curriculum_curriculum_id'] <= 0) {
            Response::json(['status'=>422,'mensagem'=>'curriculum_curriculum_id obrigatório.']);
            return;
        }

        //  TENTA CRIAR REGISTRO NO BANCO
        try {
            $id = $this->loadModel('CurriculumEscolaridade')->create($payload);
            Response::json(['status'=>201,'data'=>['curriculum_escolaridade_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao criar escolaridade','erro'=>$e->getMessage()]);
        }
    }

    /**
     * ATUALIZAR ESCOLARIDADE - PUT /escolaridade/atualizar/{id}
     * 
     * Edita uma formação existente no histórico educacional
     * Mantém compatibilidade com slugs e IDs numéricos
     * 
     * @param int $id ID da formação a ser atualizada
     * @return void Retorna JSON com confirmação
     */
    public function atualizar(int $id = 0): void
    {
        //  VALIDA ID DA FORMAÇÃO
        if ($id <= 0) {
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']);
            return;
        }

        //  OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 PREPARA E SANITIZA DADOS PARA ATUALIZAÇÃO
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

        //  TENTA ATUALIZAR REGISTRO NO BANCO
        try {
            $rows = $this->loadModel('CurriculumEscolaridade')->updateById($id, $payload);
            Response::json(['status'=>200,'data'=>['linhas'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar escolaridade','erro'=>$e->getMessage()]);
        }
    }

    /**
     * REMOVER ESCOLARIDADE - DELETE /escolaridade/remover/{id}
     * 
     * Exclui uma formação do histórico educacional
     * Operação irreversível - remove registro permanentemente
     * 
     * @param int $id ID da formação a ser removida
     * @return void Retorna JSON com confirmação
     */
    public function remover(int $id = 0): void
    {
        // VALIDA ID DA FORMAÇÃO
        if ($id <= 0) {
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']);
            return;
        }

        // TENTA EXCLUIR EGISTRO DO BANCO
        try {
            $rows = $this->loadModel('CurriculumEscolaridade')->deleteById($id);
            Response::json(['status'=>200,'data'=>['linhas'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao excluir escolaridade','erro'=>$e->getMessage()]);
        }
    }
}
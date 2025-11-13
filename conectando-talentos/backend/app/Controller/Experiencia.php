<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;

/**
 * EXPERIÊNCIA CONTROLLER - GERENCIA HISTÓRICO PROFISSIONAL DO CURRÍCULO
 * 
 * Responsável por: CRUD completo da tabela curriculum_experiencia
 * Gerencia histórico profissional do candidato (empregos, cargos, atividades)
 * Sistema flexível para cargos pré-definidos ou descrição livre
 * Controle de períodos de emprego (atual ou passado)
 * Herda de ControllerMain para funcionalidades básicas
 */
class Experiencia extends ControllerMain
{
    /**
     * MÉTODOS PÚBLICOS - Configuração de acesso
     * 
     * 'cargos' - Lista de cargos disponível publicamente para selects
     * Se quiser exigir login para tudo, deixe o array vazio
     */
    public const PUBLIC_ACTIONS = ['cargos'];

    /**
     * MODEL DE EXPERIÊNCIA PROFISSIONAL
     * 
     * @return object Model CurriculumExperiencia
     */
    private function expModel()   { return $this->loadModel('CurriculumExperiencia'); }

    /**
     * MODEL DE CARGOS
     * 
     * @return object Model Cargo para lista de cargos pré-definidos
     */
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /**
     * LISTA EXPERIÊNCIAS - GET /experiencia/lista/{curriculumId}
     * 
     * Retorna todo o histórico profissional de um currículo
     * Inclui empregos, períodos, cargos e atividades exercidas
     * 
     * @param int $curriculumId ID do currículo (obrigatório)
     * @return void Retorna JSON com array de experiências
     */
    public function lista(int $curriculumId): void
    {
        // 📋 BUSCA TODAS AS EXPERIÊNCIAS DO CURRÍCULO
        $itens = $this->expModel()->findByCurriculum($curriculumId);
        
        // 📤 RETORNA LISTA COMPLETA
        Response::json(['status'=>200, 'data'=>$itens]);
    }

    /**
     * LISTA DE CARGOS - GET /experiencia/cargos
     * 
     * Retorna lista de cargos pré-definidos para seleção
     * Usado pelo componente <Select> no front-end
     * Acesso público para facilitar preenchimento de formulários
     * 
     * @return void Retorna JSON com array de cargos
     */
    public function cargos(): void
    {
        // 📋 BUSCA CARGOS ORDENADOS POR DESCRIÇÃO
        $rows = $this->cargoModel()->lista('descricao', 'ASC');

        // 🎯 FORMATA RESPOSTA PADRÃO
        Response::json([
            'status' => 200,
            'cargos' => array_map(fn($c) => [
                'cargo_id'  => (int) $c['cargo_id'],      // ID numérico do cargo
                'descricao' => (string) $c['descricao'],  // Nome do cargo
            ], $rows),
        ]);
    }

    /**
     * CRIAR EXPERIÊNCIA - POST /experiencia/criar
     * 
     * Adiciona uma nova experiência profissional ao histórico
     * Suporta cargo pré-definido (cargo_id) ou descrição livre (cargoDescricao)
     * Gerencia automaticamente datas de fim para empregos atuais
     * 
     * @return void Retorna JSON com ID da experiência criada
     */
    public function criar(): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 SANITIZA E PREPARA DADOS
        $payload = $this->sanitize($dados);

        // ✅ VALIDA DADOS OBRIGATÓRIOS (modo criação)
        if ($err = $this->validate($payload, true)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

        // 💾 TENTA CRIAR REGISTRO NO BANCO
        try {
            $id = $this->expModel()->create($payload);
            Response::json(['status'=>201, 'data'=>['curriculum_experiencia_id'=>$id]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao criar experiência','erro'=>$e->getMessage()]);
        }
    }

    /**
     * ATUALIZAR EXPERIÊNCIA - PUT /experiencia/atualizar/{id}
     * 
     * Edita uma experiência profissional existente
     * Mantém flexibilidade para cargos pré-definidos ou descrição livre
     * Atualiza períodos e informações da empresa/estabelecimento
     * 
     * @param int $id ID da experiência a ser atualizada
     * @return void Retorna JSON com confirmação
     */
    public function atualizar(int $id): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 SANITIZA E PREPARA DADOS
        $payload = $this->sanitize($dados);

        // ✅ VALIDA DADOS OBRIGATÓRIOS (modo atualização)
        if ($err = $this->validate($payload, false)) {
            Response::json(['status'=>422, 'mensagem'=>$err]); 
            return;
        }

        // 💾 TENTA ATUALIZAR REGISTRO NO BANCO
        try {
            $rows = $this->expModel()->updateById($id, $payload);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar experiência','erro'=>$e->getMessage()]);
        }
    }

    /**
     * EXCLUIR EXPERIÊNCIA - DELETE /experiencia/excluir/{id}
     * 
     * Remove uma experiência profissional do histórico
     * Operação irreversível - remove registro permanentemente
     * 
     * @param int $id ID da experiência a ser excluída
     * @return void Retorna JSON com confirmação
     */
    public function excluir(int $id): void
    {
        // 🗑️ TENTA EXCLUIR REGISTRO DO BANCO
        try {
            $rows = $this->expModel()->deleteById($id);
            Response::json(['status'=>200, 'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao excluir experiência','erro'=>$e->getMessage()]);
        }
    }

    /* ----------------- HELPERS ----------------- */

    /**
     * SANITIZA DADOS DA EXPERIÊNCIA
     * 
     * Limpa e formata dados recebidos do front-end
     * Trata lógica de empregos atuais (datas de fim nulas)
     * Gerencia flexibilidade entre cargo_id e cargoDescricao
     * 
     * @param array $d Dados brutos do request
     * @return array Dados sanitizados e formatados
     */
    private function sanitize(array $d): array
    {
        // 🔄 VERIFICA SE É EMPREGO ATUAL (datas de fim devem ser nulas)
        $empregoAtual = !empty($d['empregoAtual']);
        $fimMes = $empregoAtual ? null : (isset($d['fimMes']) ? (int)$d['fimMes'] : null);
        $fimAno = $empregoAtual ? null : (isset($d['fimAno']) ? (int)$d['fimAno'] : null);

        // 🎯 TRATA FLEXIBILIDADE DE CARGOS
        // Pode usar cargo pré-definido (cargo_id) OU descrição livre (cargoDescricao)
        $cargoId   = isset($d['cargo_id']) && $d['cargo_id'] !== '' ? (int)$d['cargo_id'] : null;
        $cargoDesc = isset($d['cargoDescricao']) ? trim((string)$d['cargoDescricao']) : null;

        // 🧹 RETORNA DADOS SANITIZADOS
        return [
            'curriculum_id'       => (int)($d['curriculum_id'] ?? 0),           // ID do currículo
            'inicioMes'           => (int)($d['inicioMes'] ?? 0),               // Mês de início (1-12)
            'inicioAno'           => (int)($d['inicioAno'] ?? 0),               // Ano de início
            'fimMes'              => $fimMes,                                   // Mês de fim (null se atual)
            'fimAno'              => $fimAno,                                   // Ano de fim (null se atual)
            'estabelecimento'     => isset($d['estabelecimento']) ? trim((string)$d['estabelecimento']) : null, // Nome da empresa
            'cargo_id'            => $cargoId,                                  // ID do cargo pré-definido
            'cargoDescricao'      => $cargoDesc,                                // Descrição livre do cargo
            'atividadesExercidas' => isset($d['atividadesExercidas']) ? trim((string)$d['atividadesExercidas']) : null, // Atribuições
        ];
    }

    /**
     * VALIDA DADOS DA EXPERIÊNCIA
     * 
     * Verifica integridade e regras de negócio dos dados
     * Valida períodos, cargos e campos obrigatórios
     * 
     * @param array $p Dados sanitizados para validação
     * @param bool $isCreate Indica se é criação (true) ou atualização (false)
     * @return string|null Mensagem de erro ou null se válido
     */
    private function validate(array $p, bool $isCreate): ?string
    {
        // ✅ VALIDAÇÕES BÁSICAS DE CAMPOS OBRIGATÓRIOS
        $ok =
            $p['curriculum_id'] > 0 &&                    // Curriculum deve existir
            $p['inicioMes'] >= 1 && $p['inicioMes'] <= 12 && // Mês entre 1-12
            $p['inicioAno'] >= 1900;                     // Ano realista

        if (!$ok) return 'Campos obrigatórios inválidos (curriculum_id, inicioMes, inicioAno).';

        // 🎯 VALIDA FLEXIBILIDADE DE CARGOS
        // Deve ter pelo menos: cargo_id OU cargoDescricao
        if (empty($p['cargo_id']) && ($p['cargoDescricao'] === null || $p['cargoDescricao'] === '')) {
            return 'Informe o cargo (catálogo ou descrição).';
        }

        // 📅 VALIDA DATAS DE FIM (se informadas)
        if ($p['fimMes'] !== null && ($p['fimMes'] < 1 || $p['fimMes'] > 12)) return 'fimMes inválido.';
        if ($p['fimAno'] !== null && $p['fimAno'] < 1900) return 'fimAno inválido.';

        return null;
    }
}
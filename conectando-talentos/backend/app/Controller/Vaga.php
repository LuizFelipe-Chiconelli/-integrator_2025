<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * VAGA CONTROLLER - GERENCIA TODAS AS OPERAÇÕES DE VAGAS DE EMPREGO
 * 
 * Responsável por: publicação, listagem, atualização e gestão de vagas
 * Divide ações em públicas (acesso livre) e privadas (empresa logada)
 * Herda de ControllerMain para funcionalidades básicas
 */
class Vaga extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Não exigem autenticação
     * Estes métodos podem ser acessados sem estar logado
     */
    public const PUBLIC_ACTIONS = ['cargos', 'listaPublica', 'lista_publica', 'detalhe'];

    /* ========== HELPERS DE MODEL ========== */
    
    /**
     * RETORNA INSTÂNCIA DO MODEL DE VAGA
     * Helper para acesso ao model principal com type hinting implícito
     * 
     * @return object Model de Vaga
     */
    private function vagaModel()  { return $this->model; }

    /**
     * CARREGA MODEL DE CARGO
     * Helper para carregar model relacionado dinamicamente
     * 
     * @return object Model de Cargo
     */
    private function cargoModel() { return $this->loadModel('Cargo'); }

    /* ========== ROTAS PÚBLICAS ========== */

    /**
     * LISTA DE CARGOS DISPONÍVEIS - GET /vaga/cargos
     * 
     * Retorna lista completa de cargos para seleção em formulários
     * Usado no cadastro de vagas e filtros
     * 
     * @return void Retorna JSON com array de cargos
     */
    public function cargos(): void
    {
        // 📋 BUSCA TODOS OS CARGOS ORDENADOS POR DESCRIÇÃO
        $rows = $this->cargoModel()->lista('descricao', 'ASC');

        // 🎯 FORMATA RESPOSTA PADRÃO
        Response::json([
            'status' => 200,
            'cargos' => array_map(fn($c) => [
                'cargo_id'  => (int) $c['cargo_id'],      // ID numérico
                'descricao' => (string) $c['descricao'],  // Nome do cargo
            ], $rows),
        ]);
    }

    /**
     * LISTA PÚBLICA DE VAGAS - GET /vaga/listaPublica?busca=termo&tipo=integral&nivel=junior
     * 
     * @param string $action Nome da ação (obrigatório pelo roteador)
     * @param int $id ID ou status (obrigatório pelo roteador)
     * @return void Retorna JSON com lista de vagas
     */
    public function listaPublica(string $action = null, int $id = 0): void
    {
        // 🎯 DEFINE STATUS DA VAGA (11 = publicadas por padrão)
        // Se ID foi passado via rota, usa como status, senão usa 11
        $status = ($id > 0) ? (int)$id : 11;
        
        // 🔍 OBTÉM FILTROS
        $busca = isset($_GET['busca']) ? trim((string)$_GET['busca']) : null;
        $tipoVaga = isset($_GET['tipo']) ? trim((string)$_GET['tipo']) : null;
        $nivelExperiencia = isset($_GET['nivel']) ? trim((string)$_GET['nivel']) : null;
        
        // 📋 BUSCA VAGAS PÚBLICAS COM FILTROS
        $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo(0, $status, $busca, $tipoVaga, $nivelExperiencia);
        
        // 📤 RETORNA LISTA DE VAGAS    
        Response::json(['status' => 200, 'data' => $rows]);
    }

    /**
     * DETALHE DA VAGA - GET /vaga/detalhe/{id}
     * 
     * Retorna informações completas de uma vaga específica
     * Inclui dados da empresa, cargo, requisitos, etc.
     * Acesso público - não requer autenticação
     * 
     * @param int $id ID da vaga (obrigatório)
     * @return void Retorna JSON com dados completos da vaga
     */
    public function detalhe(int $id = 0): void
    {
        // ✅ VALIDA ID DA VAGA
        if ($id <= 0) { 
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']); 
            return; 
        }

        // 🔍 BUSCA VAGA COMPLETA PELO ID
        // ✅ CORRETO: Usa método completo que inclui todos os dados relacionados
        $row = $this->vagaModel()->findByIdCompleta($id);
        
        // ⚠️ VERIFICA SE VAGA EXISTE
        if (!$row) { 
            Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); 
            return; 
        }

        // 🔄 PADRONIZA CAMPO DE DESCRIÇÃO (compatibilidade)
        // Garante que sempre tenha o campo 'sobreVaga'
        $row['sobreVaga'] = $row['descricao'] ?? ($row['sobreaVaga'] ?? '');

        // 📤 RETORNA DADOS COMPLETOS DA VAGA
        Response::json(['status'=>200,'data'=>$row]);
    }

    /* ========== ROTAS PRIVADAS (EMPRESA LOGADA) ========== */

    /**
     * MINHAS VAGAS - GET /vaga/minhas?status={status}&busca={termo}
     * 
     * ✅ ATUALIZADO: Agora aceita filtro por texto via query parameter 'busca'
     * 
     * @return void Retorna JSON com vagas da empresa
     */
    public function minhas(): void
    {
    // 🔐 VERIFICA SE EMPRESA ESTÁ LOGADA
    $eid = $this->getLoggedEmpresaId();
    if ($eid <= 0) { 
        Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
        return; 
    }

    // 🎯 OBTÉM FILTROS
    $status = isset($_GET['status']) ? (int) $_GET['status'] : null;
    $busca = isset($_GET['busca']) ? trim((string)$_GET['busca']) : null;
    
    // 📋 BUSCA VAGAS DA EMPRESA LOGADA COM FILTROS
    $rows = $this->vagaModel()->listarPorEstabelecimentoComCargo($eid, $status, $busca);

    // 📤 RETORNA LISTA DE VAGAS
    Response::json(['status'=>200, 'data'=>$rows]);
    }

    /**
     * PUBLICAR VAGA - POST /vaga/publicar
     * 
     * Cria uma nova vaga de emprego para a empresa logada
     * Processo completo: validação → sanitização → criação
     * Acesso restrito - requer empresa logada
     * 
     * @return void Retorna JSON com ID da vaga criada
     */
    public function publicar(): void
    {
        // 🔐 VERIFICA SE EMPRESA ESTÁ LOGADA
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }

        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🧹 SANITIZA E PREPARA DADOS
        $payload = $this->sanitize($dados);
        $payload['estabelecimento_id'] = $eid; // Garante vínculo com empresa

        // ✅ VALIDA DADOS OBRIGATÓRIOS
        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422,'mensagem'=>$err]); 
            return;
        }

        // 💾 TENTA CRIAR VAGA NO BANCO
        try {
            $id = (int) $this->vagaModel()->criarVaga($payload);
            
            // ⚠️ VERIFICA SE CRIAÇÃO FOI BEM-SUCEDIDA
            if ($id <= 0) {
                // 🗑️ RECUPERA MENSAGEM DE ERRO DA SESSÃO (se existir)
                $motivo = Session::getDestroy('msgError') ?: 'Falha ao inserir no banco.';
                Response::json([
                    'status'=>500,
                    'mensagem'=>'Erro ao publicar vaga.',
                    'erro'=>$motivo
                ]);
                return;
            }
            
            // 🎉 RETORNA SUCESSO COM ID DA VAGA
            Response::json(['status'=>201,'data'=>['vaga_id'=>$id]]);
            
        } catch (\Throwable $e) {
            // 🚨 CAPTURA ERROS INESPERADOS
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao publicar vaga.',
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * ATUALIZAR VAGA - PUT /vaga/atualizar/{id}
     * 
     * Atualiza dados completos de uma vaga existente
     * Verifica permissão da empresa sobre a vaga
     * Acesso restrito - requer empresa logada + permissão
     * 
     * @param int $id ID da vaga a ser atualizada
     * @return void Retorna JSON com confirmação
     */
    public function atualizar(int $id = 0): void
    {
        // 🔐 VERIFICA AUTENTICAÇÃO E PERMISSÕES
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }
        if ($id  <= 0) { 
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']); 
            return; 
        }

        // 🔒 VERIFICA SE EMPRESA PODE ALTERAR ESTA VAGA
        if (!$this->empresaPodeAlterar($eid, $id)) return;

        // 📨 OBTÉM DADOS PARA ATUALIZAÇÃO
        $dados   = json_decode(file_get_contents('php://input'), true) ?? [];
        $payload = $this->sanitize($dados);
        $payload['estabelecimento_id'] = $eid; // Mantém vínculo

        // ✅ VALIDA DADOS ATUALIZADOS
        if ($err = $this->validate($payload)) {
            Response::json(['status'=>422,'mensagem'=>$err]); 
            return;
        }

        // 💾 EXECUTA ATUALIZAÇÃO NO BANCO
        try {
            $rows = $this->vagaModel()->atualizarPorId($id, $payload);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao atualizar vaga.',
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * ALTERAR STATUS DA VAGA - PATCH /vaga/status/{id}
     * 
     * Altera apenas o status de uma vaga (publicar, arquivar, etc)
     * Operação mais leve que atualização completa
     * Acesso restrito - requer empresa logada + permissão
     * 
     * @param int $id ID da vaga
     * @return void Retorna JSON com confirmação
     */
    public function status(int $id = 0): void
    {
        // 🔐 VERIFICA AUTENTICAÇÃO E PERMISSÕES
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }
        if ($id  <= 0) { 
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']); 
            return; 
        }

        // 🔒 VERIFICA SE EMPRESA PODE ALTERAR ESTA VAGA
        if (!$this->empresaPodeAlterar($eid, $id)) return;

        // 📨 OBTÉM NOVO STATUS DO CORPO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $novo  = (int)($dados['statusVaga'] ?? 0);
        
        // ✅ VALIDA STATUS
        if ($novo <= 0) { 
            Response::json(['status'=>422,'mensagem'=>'statusVaga inválido.']); 
            return; 
        }

        // 💾 ATUALIZA STATUS NO BANCO
        try {
            $rows = $this->vagaModel()->atualizarStatus($id, $novo);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao atualizar status da vaga.',
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /**
     * REMOVER VAGA - DELETE /vaga/remover/{id}
     * 
     * Exclui permanentemente uma vaga do sistema
     * Operação irreversível - use com cuidado
     * Acesso restrito - requer empresa logada + permissão
     * 
     * @param int $id ID da vaga a ser removida
     * @return void Retorna JSON com confirmação
     */
    public function remover(int $id = 0): void
    {
        // 🔐 VERIFICA AUTENTICAÇÃO E PERMISSÕES
        $eid = $this->getLoggedEmpresaId();
        if ($eid <= 0) { 
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']); 
            return; 
        }
        if ($id  <= 0) { 
            Response::json(['status'=>400,'mensagem'=>'ID inválido.']); 
            return; 
        }

        // 🔒 VERIFICA SE EMPRESA PODE ALTERAR ESTA VAGA
        if (!$this->empresaPodeAlterar($eid, $id)) return;

        // 🗑️ EXECUTA EXCLUSÃO NO BANCO
        try {
            $rows = $this->vagaModel()->excluirPorId($id);
            Response::json(['status'=>200,'data'=>['rows'=>$rows]]);
        } catch (\Throwable $e) {
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao remover vaga.',
                'erro'=>$e->getMessage()
            ]);
        }
    }

    /* ========== HELPERS INTERNOS ========== */

    /**
     * OBTÉM ID DA EMPRESA LOGADA
     * 
     * Recupera ID da empresa da sessão atual
     * Compatível com diferentes nomes de sessão
     * 
     * @return int ID da empresa ou 0 se não logado
     */
    private function getLoggedEmpresaId(): int
    {
        return (int)(Session::get('empresa_id') ?: Session::get('estabelecimento_id') ?: 0);
    }

    /**
     * VERIFICA PERMISSÃO DA EMPRESA SOBRE VAGA
     * 
     * Valida se empresa logada é dona da vaga
     * Medida de segurança contra alterações cruzadas
     * 
     * @param int $empresaId ID da empresa logada
     * @param int $vagaId ID da vaga a verificar
     * @return bool True se tem permissão, false caso contrário
     */
    private function empresaPodeAlterar(int $empresaId, int $vagaId): bool
    {
        // 🔍 BUSCA DADOS DA VAGA
        $vaga = $this->vagaModel()->findById($vagaId);
        
        // ⚠️ VERIFICA SE VAGA EXISTE
        if (!$vaga) { 
            Response::json(['status'=>404,'mensagem'=>'Vaga não encontrada.']); 
            return false; 
        }
        
        // 🔒 VERIFICA SE EMPRESA É DONA DA VAGA
        if ((int)$vaga['estabelecimento_id'] !== $empresaId) {
            Response::json(['status'=>403,'mensagem'=>'Você não tem permissão para alterar esta vaga.']);
            return false;
        }
        
        return true;
    }

    /**
     * SANITIZA DADOS DA VAGA
     * 
     * Limpa e formata dados recebidos do front-end
     * Converte datas, remove espaços, trata campos opcionais
     * 
     * @param array $d Dados brutos do request
     * @return array Dados sanitizados e formatados
     */
    private function sanitize(array $d): array
    {
        // 📅 CONVERTE DATAS FLEXÍVEIS PARA FORMATO PADRÃO
        $dtInicio = $this->parseDateFlexible($d['dtInicio'] ?? '') ?: date('Y-m-d');
        $dtFim    = $this->parseDateFlexible($d['dtFim'] ?? '') ?: null;

        // 🧹 RETORNA DADOS SANITIZADOS
        return [
            'titulo'             => isset($d['titulo']) ? trim((string)$d['titulo']) : '',
            'descricao'          => trim((string)($d['descricao'] ?? '')),
            'cargo_id'           => ($d['cargo_id'] ?? null) !== null && $d['cargo_id'] !== '' ? (int)$d['cargo_id'] : null,
            'requisitos'         => trim((string)($d['requisitos']   ?? '')),
            'localizacao'        => trim((string)($d['localizacao']  ?? '')),
            'salario_minimo'     => isset($d['salario_minimo']) ? trim((string)$d['salario_minimo']) : '',
            'salario_maximo'     => isset($d['salario_maximo']) ? trim((string)$d['salario_maximo']) : '',
            'nivel'              => (int)($d['nivel'] ?? 0),
            'modalidade'         => (int)($d['modalidade'] ?? 0),
            'vinculo'            => (int)($d['vinculo'] ?? 0),
            'dtInicio'           => $dtInicio,
            'dtFim'              => $dtFim,
            'estabelecimento_id' => (int)($d['estabelecimento_id'] ?? 0),
            'statusVaga'         => (int)($d['statusVaga'] ?? 11),
        ];
    }

    /**
     * VALIDA DADOS DA VAGA
     * 
     * Verifica integridade e regras de negócio dos dados
     * Retorna mensagem de erro ou null se válido
     * 
     * @param array $p Dados sanitizados para validação
     * @return string|null Mensagem de erro ou null se válido
     */
    private function validate(array $p): ?string
    {
        // ✅ VALIDAÇÕES BÁSICAS DE CAMPOS OBRIGATÓRIOS
        if ($p['estabelecimento_id'] <= 0) return 'estabelecimento_id inválido.';
        if ($p['titulo'] === '' || mb_strlen($p['titulo']) > 60) return 'titulo inválido (1–60 chars).';
        if (empty($p['cargo_id']) || (int)$p['cargo_id'] <= 0) return 'cargo_id inválido.';
        if ((int)$p['modalidade'] <= 0) return 'modalidade inválida.';
        if ((int)$p['vinculo']    <= 0) return 'vinculo inválido.';
        if (trim((string)$p['requisitos']) === '') return 'requisitos é obrigatório.';
        if (empty($p['dtFim']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $p['dtFim'])) return 'dtFim inválida.';
        
        // 💰 VALIDAÇÃO DE SALÁRIOS (OPCIONAL)
        if (!empty($p['salario_minimo']) && !empty($p['salario_maximo'])) {
            // 🔄 CONVERTE PARA NÚMERO PARA COMPARAÇÃO
            $min = $this->converterSalarioParaNumero($p['salario_minimo']);
            $max = $this->converterSalarioParaNumero($p['salario_maximo']);
            
            // ⚠️ VERIFICA SE MÍNIMO NÃO É MAIOR QUE MÁXIMO
            if ($min !== null && $max !== null && $min > $max) {
                return 'salario_minimo não pode ser maior que salario_maximo.';
            }
        }
        
        return null;
    }

    /**
     * CONVERTE STRING DE SALÁRIO PARA NÚMERO
     * 
     * Converte formato "R$ 4.000,00" para 4000.00
     * Remove símbolos e formatação monetária
     * 
     * @param string $salarioString Salário no formato brasileiro
     * @return float|null Valor numérico ou null se inválido
     */
    private function converterSalarioParaNumero(string $salarioString): ?float
    {
        // 🧹 LIMPA CARACTERES NÃO NUMÉRICOS
        // Remove "R$", pontos e converte vírgula para ponto
        $limpo = preg_replace('/[^\d,]/', '', $salarioString);
        $limpo = str_replace(',', '.', str_replace('.', '', $limpo));
        
        // 🔄 CONVERTE PARA FLOAT
        return is_numeric($limpo) ? (float)$limpo : null;
    }

    /**
     * CONVERSOR FLEXÍVEL DE DATAS
     * 
     * Aceita múltiplos formatos de data:
     * - yyyy-mm-dd (padrão ISO)
     * - dd/mm/yyyy (brasileiro)
     * - dd-mm-yyyy (alternativo)
     * - ddmmyyyy (compacto)
     * 
     * @param string|null $s Data em qualquer formato suportado
     * @return string|null Data no formato yyyy-mm-dd ou null se inválida
     */
    private function parseDateFlexible(?string $s): ?string
    {
        $s = trim((string)$s);
        if ($s === '') return null;

        // 🔍 TENTA DIFERENTES PADRÕES DE DATA
        if (preg_match('/^(\d{2})(\d{2})(\d{4})$/', $s, $m)) return "{$m[3]}-{$m[2]}-{$m[1]}";
        if (preg_match('/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/', $s, $m)) return "{$m[3]}-{$m[2]}-{$m[1]}";

        // ⏰ USA strtotime COMO FALLBACK
        $t = strtotime(str_replace('/', '-', $s));
        return $t ? date('Y-m-d', $t) : null;
    }
}
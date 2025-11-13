<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Session;
use Core\Library\Response;

/**
 * EMPRESA CONTROLLER - GERENCIA TODAS AS OPERAÇÕES DE EMPRESAS/ESTABELECIMENTOS
 * 
 * Responsável por: cadastro, login, logout e gestão de perfil de empresas
 * Similar ao UsuarioController mas com dados específicos de empresas (CNPJ, telefones, etc)
 */
class Empresa extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Não exigem autenticação
     * Estes métodos podem ser acessados sem a empresa estar logada
     */
    public const PUBLIC_ACTIONS = ['cadastrar', 'login', 'logout'];

    /* ================= CADASTRO ================= */
    
    /**
     * CADASTRAR NOVA EMPRESA - POST /empresa/cadastrar
     * 
     * Cria um novo estabelecimento/empresa no sistema
     * Valida CNPJ único e email único antes do cadastro
     * 
     * @return void Retorna JSON com resultado da operação
     */
    public function cadastrar(): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO (JSON)
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        //  VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
        if (
            empty($dados['nome'])  ||
            empty($dados['cnpj'])  ||
            empty($dados['email']) ||
            empty($dados['senha'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos obrigatórios.']);
            return;
        }

        //  VERIFICA SE EMAIL JÁ ESTÁ CADASTRADO
        if ($this->model->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }
        
        //  VERIFICA SE CNPJ JÁ ESTÁ CADASTRADO (apenas números)
        if ($this->model->verificarCnpjExistente(preg_replace('/\D/', '', $dados['cnpj']))) {
            Response::json(['status'=>409,'mensagem'=>'CNPJ já cadastrado.']);
            return;
        }

        //  PREPARA DADOS PARA INSERÇÃO NO BANCO
        $payload = [
            'nome'      => trim($dados['nome']),                          // Nome da empresa
            'cnpj'      => preg_replace('/\D/', '', $dados['cnpj']),      // CNPJ apenas números
            'endereco'  => $dados['endereco']  ?? '',                     // Endereço (opcional)
            'email'     => strtolower(trim($dados['email'])),             // Email em minúsculo
            'descricao' => $dados['descricao'] ?? '',                     // Descrição da empresa
            'website'   => $dados['website']   ?? null,                   // Site (opcional)
            'setor'     => $dados['setor']     ?? null,                   // Setor de atuação
            'linkedin'  => $dados['linkedin']  ?? null,                   // LinkedIn (opcional)
            'instagram' => $dados['instagram'] ?? null,                   // Instagram (opcional)
            'facebook'  => $dados['facebook']  ?? null,                   // Facebook (opcional)
            'senha'     => password_hash($dados['senha'], PASSWORD_DEFAULT) // Senha com hash seguro
        ];

        //  TENTA CADASTRAR A EMPRESA NO BANCO
        try {
            $id = $this->model->cadastrarEmpresa($payload);
            Response::json(['status'=>201,'mensagem'=>'Empresa cadastrada com sucesso!','id'=>$id]);
        } catch (\Throwable $e) {
            //  CAPTURA QUALQUER ERRO DURANTE O CADASTRO
            Response::json(['status'=>500,'mensagem'=>'Erro ao cadastrar empresa.','erro'=>$e->getMessage()]);
        }
    }

    /* ================= LOGIN ================= */
    
    /**
     * LOGIN DE EMPRESA - POST /empresa/login
     * 
     * Autentica empresa com email e senha
     * Cria sessão específica para empresas
     * 
     * @return void Retorna JSON com dados da empresa logada
     */
    public function login(): void
    {
        //  OBTÉM CREDENCIAIS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        //  VALIDA CAMPOS OBRIGATÓRIOS
        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        //  BUSCA EMPRESA POR EMAIL
        $empresa = $this->model->verificarEmailExistente($dados['email']);
        
        //  VERIFICA SE EMPRESA EXISTE E SENHA ESTÁ CORRETA
        if (!$empresa || !password_verify($dados['senha'], $empresa['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        //  CRIA SESSÃO DA EMPRESA (DADOS DUPLICADOS PARA COMPATIBILIDADE)
        Session::set('empresa_id',          (int)$empresa['estabelecimento_id']);     // ID principal
        Session::set('estabelecimento_id',  (int)$empresa['estabelecimento_id']);     // ID extra para vagas
        Session::set('empresa_nome',        (string)$empresa['nome']);                // Nome da empresa
        Session::set('empresa_email',       (string)$empresa['email']);               // Email da empresa
        session_regenerate_id(true); // Prevenção contra fixation attacks

        // 🎉 RETORNA SUCESSO COM DADOS DA EMPRESA
        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'empresa' => [
                'id'    => (int)$empresa['estabelecimento_id'],
                'nome'  => (string)$empresa['nome'],
                'email' => (string)$empresa['email']
            ]
        ]);
    }

    /* ================= PERFIL (GET/POST) ================= */
    
    /**
     * GERENCIAMENTO DE PERFIL DA EMPRESA - GET/POST /empresa/perfil
     * 
     * GET: Retorna dados completos da empresa logada + telefones
     * POST: Atualiza dados da empresa e gerencia telefones
     * 
     * @return void Retorna dados do perfil ou confirma atualização
     */
    public function perfil(): void
    {
    //🔍 OBTÉM ID DA EMPRESA DA SESSÃO E VERIFICA AUTENTICAÇÃO
    $empresaId = (int) Session::get('empresa_id');
    if (!$empresaId) {
        Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
        return;
    }

    //  IDENTIFICA O MÉTODO DA REQUISIÇÃO (GET ou POST)
    $metodo = $_SERVER['REQUEST_METHOD'];

    //  MÉTODO GET - CONSULTA DE DADOS
    if ($metodo === 'GET') {
        //  BUSCA DADOS DA EMPRESA
        $empresa = $this->model->findById($empresaId);
        if (!$empresa) {
            Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
            return;
        }

        //  REMOVE SENHA POR SEGURANÇA (nunca retornar senha)
        unset($empresa['senha']);

        //  BUSCA TELEFONES DA EMPRESA
        $telefones = $this->loadModel('Telefone')->buscarPorEmpresa($empresaId);

        //  RETORNA DADOS COMPLETOS DA EMPRESA
        Response::json([
            'status'    => 200,
            'empresa'   => $empresa,       // Dados da empresa
            'telefones' => $telefones      // Lista de telefones
        ]);
        return;
    }

    //  MÉTODO POST - ATUALIZAÇÃO DE DADOS
    if ($metodo === 'POST') {
        //  OBTÉM DADOS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        //  VERIFICA SE EMPRESA AINDA EXISTE NO BANCO
        $empresaAtual = $this->model->findById($empresaId);
        if (!$empresaAtual) {
            Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
            return;
        }

        //  REMOVE SENHA DOS DADOS ATUAIS
        unset($empresaAtual['senha']);

        //  PREPARA DADOS PARA ATUALIZAÇÃO (mantém valores atuais se não informados)
        $payload = [
            'nome'      => trim($dados['nome'] ?? $empresaAtual['nome']),
            'cnpj'      => preg_replace('/\D/', '', $dados['cnpj'] ?? $empresaAtual['cnpj']),
            'endereco'  => $dados['endereco']  ?? $empresaAtual['endereco'],
            'email'     => strtolower(trim($dados['email'] ?? $empresaAtual['email'])),
            'descricao' => $dados['descricao'] ?? $empresaAtual['descricao'],
            'website'   => $dados['website']   ?? $empresaAtual['website'],
            'setor'     => $dados['setor']     ?? $empresaAtual['setor'],
            'linkedin'  => $dados['linkedin']  ?? $empresaAtual['linkedin'],
            'instagram' => $dados['instagram'] ?? $empresaAtual['instagram'],
            'facebook'  => $dados['facebook']  ?? $empresaAtual['facebook'],
        ];

        //  ATUALIZA SENHA SE FORNECIDA (opcional)
        if (!empty($dados['senha'])) {
            $payload['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
        }

        //  TENTA ATUALIZAR OS DADOS DA EMPRESA
        try {
            // 1. ATUALIZA DADOS PRINCIPAIS DA EMPRESA
            $this->model->atualizarPorId($empresaId, $payload);

            // 2.  CORREÇÃO: GERENCIA TELEFONES (aceita "telefone" ou "telefones")
            $telModel = $this->loadModel('Telefone');

            // Verifica se o model foi carregado corretamente
            if (!$telModel) {
                throw new \Exception('Model de Telefone não encontrado');
            }

            //  REMOVE TODOS OS TELEFONES EXISTENTES DA EMPRESA
            $telModel->deleteByEmpresa($empresaId);

            //  ADICIONA OS NOVOS TELEFONES
            $telefonesParaSalvar = [];

            //  CAPTURA TELEFONES DE DIFERENTES FORMATOS
            if (isset($dados['telefones']) && is_array($dados['telefones'])) {
                // Formato: "telefones": ["numero1", "numero2"]
                $telefonesParaSalvar = $dados['telefones'];
            } elseif (isset($dados['telefone']) && !empty($dados['telefone'])) {
                // Formato: "telefone": "numero" (seu formato atual)
                $telefonesParaSalvar = [$dados['telefone']];
            }

            //  SALVA OS TELEFONES
            foreach ($telefonesParaSalvar as $telefone) {
                // Remove caracteres não numéricos
                $numeroLimpo = preg_replace('/\D/', '', $telefone);
                
                // Valida se tem pelo menos 10 dígitos (DDD + número)
                if (!empty($numeroLimpo) && strlen($numeroLimpo) >= 10) {
                    $telModel->inserir([
                        'estabelecimento_id' => $empresaId,
                        'usuario_id' => null,
                        'numero' => $numeroLimpo,
                        'tipo' => 'm' // móvel como padrão
                    ]);
                }
            }

            //  RETORNA SUCESSO
            Response::json(['status'=>200,'mensagem'=>'Perfil atualizado com sucesso!']);
        } catch (\Throwable $e) {
            //  CAPTURA ERROS DURANTE A ATUALIZAÇÃO
            Response::json([
                'status'=>500,
                'mensagem'=>'Erro ao atualizar perfil.',
                'erro'=>$e->getMessage(),
                'debug'=>['empresa_id' => $empresaId]
            ]);
        }
        return;
    }

    //  MÉTODO NÃO PERMITIDO
    Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }

    /* ================= LOGOUT ================= */
    
    /**
     * LOGOUT - POST /empresa/logout
     * 
     * Encerra a sessão da empresa atual
     * Remove todos os dados específicos da sessão de empresa
     * 
     * @return void Retorna confirmação de logout
     */
    public function logout(): void
    {
        //  REMOVE TODOS OS DADOS DA SESSÃO DA EMPRESA
        Session::destroy('empresa_id');         // ID principal
        Session::destroy('estabelecimento_id'); // ID para vagas  
        Session::destroy('empresa_nome');       // Nome da empresa
        Session::destroy('empresa_email');      // Email da empresa
        
        //  DESTRÓI A SESSÃO COMPLETAMENTE
        session_destroy();

        //  RETORNA CONFIRMAÇÃO
        Response::json(['status'=>200,'mensagem'=>'Sessão encerrada com sucesso!']);
    }
    /* ================= TROCA DE SENHA ================= */

    /**
     * TROCAR SENHA - POST /empresa/trocar-senha
     * 
     * Altera a senha da empresa logada
     * Requer confirmação da senha atual por segurança
     * 
     * @return void Retorna JSON com confirmação
     */
    public function trocarSenha(): void
    {
    //  OBTÉM ID DA EMPRESA DA SESSÃO E VERIFICA AUTENTICAÇÃO
    $empresaId = (int) Session::get('empresa_id');
    if (!$empresaId) {
        Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
        return;
    }

    //  OBTÉM DADOS DO CORPO DA REQUISIÇÃO
    $dados = json_decode(file_get_contents('php://input'), true) ?? [];

    // VALIDA CAMPOS OBRIGATÓRIOS
    if (empty($dados['senha_atual']) || empty($dados['nova_senha']) || empty($dados['confirmar_senha'])) {
        Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos.']);
        return;
    }

    // VERIFICA SE AS NOVAS SENHAS COINCIDEM
    if ($dados['nova_senha'] !== $dados['confirmar_senha']) {
        Response::json(['status'=>422,'mensagem'=>'Nova senha e confirmação não coincidem.']);
        return;
    }

    // VERIFICA TAMANHO MÍNIMO DA SENHA
    if (strlen($dados['nova_senha']) < 6) {
        Response::json(['status'=>422,'mensagem'=>'A nova senha deve ter pelo menos 6 caracteres.']);
        return;
    }

    //  BUSCA DADOS ATUAIS DA EMPRESA
    $empresa = $this->model->findById($empresaId);
    if (!$empresa) {
        Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
        return;
    }

    // VERIFICA SE A SENHA ATUAL ESTÁ CORRETA
    if (!password_verify($dados['senha_atual'], $empresa['senha'])) {
        Response::json(['status'=>401,'mensagem'=>'Senha atual incorreta.']);
        return;
    }

    //  TENTA ATUALIZAR A SENHA
    try {
        $novaSenhaHash = password_hash($dados['nova_senha'], PASSWORD_DEFAULT);
        $linhasAfetadas = $this->model->atualizarPorId($empresaId, ['senha' => $novaSenhaHash]);
        
        if ($linhasAfetadas > 0) {
            Response::json(['status'=>200,'mensagem'=>'Senha alterada com sucesso!']);
        } else {
            Response::json(['status'=>500,'mensagem'=>'Erro ao alterar senha.']);
        }
    } catch (\Throwable $e) {
        Response::json(['status'=>500,'mensagem'=>'Erro ao alterar senha.','erro'=>$e->getMessage()]);
    }
}
}
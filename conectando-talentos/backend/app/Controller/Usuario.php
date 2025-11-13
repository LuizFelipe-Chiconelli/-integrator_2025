<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

/**
 * USUARIO CONTROLLER - GERENCIA TODAS AS OPERAÇÕES DE USUÁRIO
 * 
 * Responsável por: cadastro, login, logout e gestão de perfil de usuários
 * Herda de ControllerMain para funcionalidades básicas
 */
class Usuario extends ControllerMain
{
    /** 
     * MÉTODOS PÚBLICOS - Não exigem autenticação
     * Estes métodos podem ser acessados sem estar logado
     */
    public const PUBLIC_ACTIONS = ['cadastrar', 'login', 'logout'];

    /* ================= CADASTRO ================= */
    
    /**
     * CADASTRAR NOVO USUÁRIO - POST /usuario/cadastrar
     * 
     * Cria um novo usuário no sistema com todos os dados necessários
     * Fluxo: Pessoa Física → Usuario → Termo de Uso
     * 
     * @return void Retorna JSON com resultado da operação
     */
    public function cadastrar(): void
    {
        // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO (JSON)
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // 🎯 DEFINE TIPO PADRÃO DO USUÁRIO (CL = Candidato)
        $tipo = $dados['tipo'] ?? 'CL'; // CL = candidato

        // ✅ VALIDAÇÃO BÁSICA DOS CAMPOS OBRIGATÓRIOS
        if (
            empty($dados['nome'])  ||
            empty($dados['email']) ||
            empty($dados['senha']) ||
            empty($dados['aceite'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos e aceite o termo.']);
            return;
        }

        // 🔍 VERIFICA SE EMAIL JÁ ESTÁ CADASTRADO
        if ($this->model->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }

        // 👤 1. CRIA REGISTRO NA TABELA PESSOA FÍSICA
        $pfId = $this->loadModel('PessoaFisica')->inserir([
            'nome' => trim($dados['nome']),  // Remove espaços extras
            'cpf'  => $dados['cpf'] ?? null // CPF opcional
        ]);

        // 🔐 2. CRIA USUÁRIO COM SENHA CRIPTOGRAFADA
        $userId = $this->model->cadastrarUsuario([
            'login'            => $dados['email'],
            'senha'            => password_hash($dados['senha'], PASSWORD_DEFAULT), // Hash seguro
            'pessoa_fisica_id' => $pfId, // Vincula à pessoa física
            'tipo'             => $tipo  // Tipo do usuário
        ]);

        // ⚠️ VERIFICA SE O USUÁRIO FOI CRIADO COM SUCESSO
        if ($userId <= 0) {
            Response::json(['status'=>500,'mensagem'=>'Falha ao salvar usuário.']);
            return;
        }

        // 📝 3. REGISTRA ACEITE DO TERMO DE USO (se existir)
        if ($termo = $this->loadModel('TermoUso')->ultimo()) {
            $this->loadModel('TermoUsoAceite')->registrarAceite([
                'termodeuso_id'  => $termo['id'],
                'usuario_id'     => $userId,
                'dataHoraAceite' => date('Y-m-d H:i:s') // Data/hora atual
            ]);
        }
        
        // 🎉 RETORNA SUCESSO
        Response::json(['status'=>200,'mensagem'=>'Usuário cadastrado com sucesso!']);
    }

    /* ================= LOGIN ================= */
    
    /**
     * LOGIN DE USUÁRIO - POST /usuario/login
     * 
     * Autentica usuário com email e senha
     * Cria sessão e retorna dados do usuário
     * 
     * @return void Retorna JSON com dados do usuário logado
     */
    public function login(): void
    {
        // 📨 OBTÉM CREDENCIAIS DO CORPO DA REQUISIÇÃO
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        // ✅ VALIDA CAMPOS OBRIGATÓRIOS
        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        // 🔍 BUSCA USUÁRIO POR EMAIL
        $usuario = $this->model->verificarEmailExistente($dados['email']);
        
        // 🔐 VERIFICA SE USUÁRIO EXISTE E SENHA ESTÁ CORRETA
        if (!$usuario || !password_verify($dados['senha'], $usuario['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        // 💾 CRIA SESSÃO DO USUÁRIO
        Session::set('usuario_id',  $usuario['usuario_id']);   // ID único
        Session::set('usuario_tipo',$usuario['tipo']);         // Tipo (CL, ADM, etc)
        session_regenerate_id(true); // Prevenção contra fixation attacks

        // 🎉 RETORNA SUCESSO COM DADOS DO USUÁRIO
        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'usuario' => [
                'id'    => $usuario['usuario_id'],
                'email' => $usuario['login'],
                'tipo'  => $usuario['tipo']
            ]
        ]);
    }

    /* ================= LOGOUT ================= */
    
    /**
     * LOGOUT - POST /usuario/logout
     * 
     * Encerra a sessão do usuário atual
     * Remove todos os dados da sessão
     * 
     * @return void Retorna confirmação de logout
     */
    public function logout(): void
    {
        // 🗑️ REMOVE DADOS ESPECÍFICOS DA SESSÃO
        Session::destroy('usuario_id');
        Session::destroy('usuario_tipo');
        
        // 💥 DESTRÓI A SESSÃO COMPLETAMENTE
        session_destroy();

        // ✅ RETORNA CONFIRMAÇÃO
        Response::json([
            'status'  => 200,
            'mensagem'=> 'Logout realizado com sucesso!'
        ]);
    }

    /* ================= PERFIL ================= */
    
    /**
     * GERENCIAMENTO DE PERFIL - GET/POST /usuario/perfil
     * 
     * GET: Retorna dados completos do perfil do usuário logado
     * POST: Atualiza dados do perfil e currículo
     * 
     * @return void Retorna dados do perfil ou confirma atualização
     */
    public function perfil(): void
    {
        // 🔍 OBTÉM ID DO USUÁRIO DA SESSÃO
        $usuarioId = Session::get('usuario_id');
        
        // 📡 IDENTIFICA O MÉTODO DA REQUISIÇÃO (GET ou POST)
        $metodo = $_SERVER['REQUEST_METHOD'];

        // 📥 MÉTODO GET - CONSULTA DE DADOS
        if ($metodo === 'GET') {
            // 👤 BUSCA DADOS BÁSICOS DO USUÁRIO
            $usuario = $this->model->findById($usuarioId);
            if (!$usuario) {
                Response::json(['status'=>404,'mensagem'=>'Usuário não encontrado.']);
                return;
            }

            // 👥 BUSCA DADOS DA PESSOA FÍSICA
            $pfId       = (int) $usuario['pessoa_fisica_id'];
            $pessoa     = $this->loadModel('PessoaFisica')->findById($pfId);
            
            // 📄 BUSCA DADOS DO CURRÍCULO (se existir)
            $curriculum = $this->loadModel('Curriculum')->getByPessoaFisica($pfId) ?? [];

            // 🏙️ COMPLETA DADOS DA CIDADE (se houver)
            if (!empty($curriculum['cidade_id'])) {
                $cidade = $this->loadModel('Cidade')->findById((int)$curriculum['cidade_id']);
                if ($cidade) {
                    $curriculum['cidade'] = $cidade['cidade']; // Nome da cidade
                    $curriculum['uf']     = $cidade['uf'];     // Sigla do estado
                }
            }

            // 📤 RETORNA DADOS COMPLETOS DO PERFIL
            Response::json([
                'status'        => 200,
                'usuario'       => [
                    'id'    => $usuario['usuario_id'],
                    'login' => $usuario['login'],
                    'tipo'  => $usuario['tipo']
                ],
                'pessoa_fisica' => $pessoa,     // Dados pessoais
                'curriculum'    => $curriculum  // Dados profissionais
            ]);
            return;
        }

        // 📤 MÉTODO POST - ATUALIZAÇÃO DE DADOS
        if ($metodo === 'POST') {
            // 📨 OBTÉM DADOS DO CORPO DA REQUISIÇÃO
            $dados = json_decode(file_get_contents('php://input'), true) ?? [];

            // ✅ VALIDA CAMPOS OBRIGATÓRIOS
            if (empty($dados['nome']) || empty($dados['cpf'])) {
                Response::json(['status'=>422,'mensagem'=>'Nome e CPF são obrigatórios.']);
                return;
            }

            // 🔍 VERIFICA SE USUÁRIO AINDA EXISTE
            $usuario = $this->model->findById($usuarioId);
            if (!$usuario) {
                Response::json(['status'=>404,'mensagem'=>'Usuário não encontrado.']);
                return;
            }

            // 👤 ATUALIZA DADOS DA PESSOA FÍSICA
            $pfId = (int) $usuario['pessoa_fisica_id'];
            
            $this->loadModel('PessoaFisica')->updateById($pfId, [
                'nome' => trim($dados['nome']),
                'cpf'  => preg_replace('/\D/','', $dados['cpf']) // Remove não-numéricos
            ]);

            // 📝 ATUALIZA/CRIA CURRÍCULO
            try {
                $curriculumId = $this->loadModel('Curriculum')
                    ->updateByPessoaFisica($pfId, [
                        'logradouro'          => $dados['logradouro']          ?? '',
                        'bairro'              => $dados['bairro']              ?? '',
                        'cep'                 => preg_replace('/\D/','', $dados['cep'] ?? ''), // Apenas números
                        'cidade_id'           => (int) ($dados['cidade_id']    ?? 0),
                        'celular'             => preg_replace('/\D/','', $dados['telefone'] ?? ''), // Apenas números
                        'dataNascimento'      => $dados['data_nascimento']     ?? '1900-01-01',
                        'sexo'                => $dados['sexo']                ?? '',
                        'email'               => $dados['email']               ?? $usuario['login'], // Mantém original se não informado
                        'numero'              => $dados['numero']              ?? '',
                        'complemento'         => $dados['complemento']         ?? '',
                        'apresentacaoPessoal' => $dados['apresentacao']        ?? '' // Texto livre sobre o usuário
                    ]);
                    
            } catch (\PDOException $e) {
                // 🚨 CAPTURA ERROS DE BANCO DE DADOS
                Response::json([
                    'status'   => 500,
                    'mensagem' => 'Erro ao gravar currículo.',
                    'erroSQL'  => $e->getMessage() // Detalhe do erro para debug
                ]);
                return;
            }

            // ✅ RETORNA SUCESSO
            Response::json([
                'status'        => 200,
                'mensagem'      => 'Perfil atualizado com sucesso!',
                'curriculum_id' => $curriculumId // ID do currículo criado/atualizado
            ]);
            return;
        }

        // 🚫 MÉTODO NÃO PERMITIDO
        Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }
}
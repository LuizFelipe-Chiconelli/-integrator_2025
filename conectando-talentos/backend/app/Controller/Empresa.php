<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Session;
use Core\Library\Response;

class Empresa extends ControllerMain
{
    public const PUBLIC_ACTIONS = ['cadastrar', 'login'];

    /* =========================================================
     * CADASTRO
     * =======================================================*/
    public function cadastrar(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (
            empty($dados['nome'])  ||
            empty($dados['cnpj'])  ||
            empty($dados['email']) ||
            empty($dados['senha'])
        ) {
            Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos obrigatórios.']);
            return;
        }

        if ($this->model->verificarEmailExistente($dados['email'])) {
            Response::json(['status'=>409,'mensagem'=>'E-mail já cadastrado.']);
            return;
        }
        if ($this->model->verificarCnpjExistente(preg_replace('/\D/', '', $dados['cnpj']))) {
            Response::json(['status'=>409,'mensagem'=>'CNPJ já cadastrado.']);
            return;
        }

        $payload = [
            'nome'     => trim($dados['nome']),
            'cnpj'     => preg_replace('/\D/', '', $dados['cnpj']),
            'endereco' => $dados['endereco'] ?? '',
            'email'    => strtolower(trim($dados['email'])),
            'descricao'=> $dados['descricao'] ?? '',
            'website'  => $dados['website'] ?? null,
            'setor'    => $dados['setor'] ?? null,
            'linkedin' => $dados['linkedin'] ?? null,
            'instagram'=> $dados['instagram'] ?? null,
            'facebook' => $dados['facebook'] ?? null,
            'senha'    => password_hash($dados['senha'], PASSWORD_DEFAULT)
        ];

        try {
            $id = $this->model->cadastrarEmpresa($payload);
            Response::json(['status'=>201,'mensagem'=>'Empresa cadastrada com sucesso!','id'=>$id]);
        } catch (\Throwable $e) {
            Response::json(['status'=>500,'mensagem'=>'Erro ao cadastrar empresa.','erro'=>$e->getMessage()]);
        }
    }

    /* =========================================================
     * LOGIN
     * =======================================================*/
    public function login(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($dados['email']) || empty($dados['senha'])) {
            Response::json(['status'=>400,'mensagem'=>'Informe e-mail e senha.']);
            return;
        }

        $empresa = $this->model->verificarEmailExistente($dados['email']);
        if (!$empresa || !password_verify($dados['senha'], $empresa['senha'])) {
            Response::json(['status'=>401,'mensagem'=>'E-mail ou senha inválidos.']);
            return;
        }

        Session::set('empresa_id', $empresa['estabelecimento_id']);
        Session::set('empresa_nome', $empresa['nome']);
        session_regenerate_id(true);

        Response::json([
            'status'  => 200,
            'mensagem'=> 'Login realizado com sucesso!',
            'empresa' => [
                'id'    => $empresa['estabelecimento_id'],
                'nome'  => $empresa['nome'],
                'email' => $empresa['email']
            ]
        ]);
    }

    /* =========================================================
     * PERFIL
     * =======================================================*/
    public function perfil(): void
    {
        $empresaId = Session::get('empresa_id');
        if (!$empresaId) {
            Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
            return;
        }

        $metodo = $_SERVER['REQUEST_METHOD'];

        /* ---------- GET ---------- */
        if ($metodo === 'GET') {
            $empresa = $this->model->findById((int)$empresaId);
            if (!$empresa) {
                Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
                return;
            }

            unset($empresa['senha']);

            $telefones = $this->loadModel('Telefone')->buscarPorEmpresa((int)$empresaId);

            Response::json([
                'status'=>200,
                'empresa'=>$empresa,
                'telefones'=>$telefones
            ]);
            return;
        }

        /* ---------- POST ---------- */
        if ($metodo === 'POST') {
            $dados = json_decode(file_get_contents('php://input'), true) ?? [];

            // buscar empresa atual
            $empresaAtual = $this->model->findById((int)$empresaId);
            if (!$empresaAtual) {
                Response::json(['status'=>404,'mensagem'=>'Empresa não encontrada.']);
                return;
            }

            // remove senha antiga do merge
            unset($empresaAtual['senha']);

            // campos permitidos para update
            $payload = [
                'nome'     => trim($dados['nome'] ?? $empresaAtual['nome']),
                'cnpj'     => preg_replace('/\D/', '', $dados['cnpj'] ?? $empresaAtual['cnpj']),
                'endereco' => $dados['endereco'] ?? $empresaAtual['endereco'],
                'email'    => strtolower(trim($dados['email'] ?? $empresaAtual['email'])),
                'descricao'=> $dados['descricao'] ?? $empresaAtual['descricao'],
                'website'  => $dados['website'] ?? $empresaAtual['website'],
                'setor'    => $dados['setor'] ?? $empresaAtual['setor'],
                'linkedin' => $dados['linkedin'] ?? $empresaAtual['linkedin'],
                'instagram'=> $dados['instagram'] ?? $empresaAtual['instagram'],
                'facebook' => $dados['facebook'] ?? $empresaAtual['facebook'],
            ];

            // senha só se enviada
            if (!empty($dados['senha'])) {
                $payload['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
            }

            try {
                $this->model->atualizarPorId((int)$empresaId, $payload);

                // telefones (se enviados)
                if (!empty($dados['telefones']) && is_array($dados['telefones'])) {
                    $telModel = $this->loadModel('Telefone');
                    $existentes = $telModel->buscarPorEmpresa((int)$empresaId);

                    foreach ($existentes as $t) {
                        $telModel->excluir((int)$t['telefone_id']);
                    }
                    foreach ($dados['telefones'] as $numero) {
                        if (trim($numero) !== '') {
                            $telModel->inserir([
                                'estabelecimento_id' => $empresaId,
                                'usuario_id'         => null,
                                'numero'             => $numero,
                                'tipo'               => 'm'
                            ]);
                        }
                    }
                }

                Response::json(['status'=>200,'mensagem'=>'Perfil atualizado com sucesso!']);
            } catch (\Throwable $e) {
                Response::json(['status'=>500,'mensagem'=>'Erro ao atualizar perfil.','erro'=>$e->getMessage()]);
            }
            return;
        }

        Response::json(['status'=>405,'mensagem'=>'Método não permitido.']);
    }

    /* =========================================================
     * PUBLICAR VAGA  (POST /empresa/vaga/publicar)
    * =======================================================*/
    public function publicarVaga(): void
    {
    $empresaId = Session::get('empresa_id');
    if (!$empresaId) {
        Response::json(['status'=>401,'mensagem'=>'Acesso não autorizado.']);
        return;
    }

    $dados = json_decode(file_get_contents('php://input'), true) ?? [];

    // validação básica
    if (
        empty($dados['descricao']) ||
        empty($dados['sobreaVaga']) ||
        empty($dados['modalidade']) ||
        empty($dados['vinculo']) ||
        empty($dados['dtFim'])
    ) {
        Response::json(['status'=>400,'mensagem'=>'Preencha todos os campos obrigatórios.']);
        return;
    }

    // payload preparado para salvar no banco
    $payload = [
        'cargo_id'          => (int) ($dados['cargo_id'] ?? 0),
        'descricao'         => trim($dados['descricao']),
        'sobreaVaga'        => trim($dados['sobreaVaga']),
        'modalidade'        => (int) $dados['modalidade'],   // 1=Presencial, 2=Remoto
        'vinculo'           => (int) $dados['vinculo'],      // 1=CLT, 2=PJ
        'dtInicio'          => date('Y-m-d'),                // data atual
        'dtFim'             => $dados['dtFim'],              // data final da vaga
        'estabelecimento_id'=> $empresaId,                   // empresa logada
        'statusVaga'        => 11                            // padrão = em aberto
    ];

    try {
        $vagaId = $this->loadModel('Vaga')->criarVaga($payload);
        Response::json([
            'status'=>201,
            'mensagem'=>'Vaga publicada com sucesso!',
            'vaga_id'=>$vagaId
        ]);
    } catch (\Throwable $e) {
        Response::json([
            'status'=>500,
            'mensagem'=>'Erro ao publicar vaga.',
            'erro'=>$e->getMessage()
        ]);
    }
    }


    /* =========================================================
     * LOGOUT
     * =======================================================*/
    public function logout(): void
    {
        Session::destroy('empresa_id');
        Session::destroy('empresa_nome');
        session_destroy();

        Response::json(['status'=>200,'mensagem'=>'Sessão encerrada com sucesso!']);
    }
}

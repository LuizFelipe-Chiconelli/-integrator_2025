<?php
namespace App\Controller;

use Core\Library\ControllerMain;

/**
 * Endpoints de EMPRESA
 */
class Empresa extends ControllerMain
{
    /*----------------------------------------------------
     | POST /empresa/cadastrar
     *---------------------------------------------------*/
    public function cadastrar()
    {
        header('Content-Type: application/json');

        $d = json_decode(file_get_contents('php://input'), true) ?? [];

        /* 1. campos obrigatórios */
        if (empty($d['nome_fantasia']) || empty($d['cnpj']) ||
            empty($d['email'])         || empty($d['senha'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"Preencha todos os campos obrigatórios."]);
            return;
        }

        $empresaModel = $this->loadModel('Empresa');

        /* 2. duplicidade */
        if ($empresaModel->existeCnpj($d['cnpj'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"CNPJ já cadastrado."]); return;
        }
        if ($empresaModel->existeEmail($d['email'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"E-mail já utilizado."]); return;
        }

        /* 3. INSERT em estabelecimento */
        $estabId = $empresaModel->inserir([
            'nome'      => trim($d['nome_fantasia']),
            'cnpj'      => preg_replace('/\D/','', $d['cnpj']),
            'email'     => trim($d['email']),
            'senha'     => password_hash(trim($d['senha']), PASSWORD_DEFAULT),
            'descricao' => $d['descricao'] ?? null,
            'endereco'  => $d['endereco']  ?? null
            // 'created_at' => date('Y-m-d H:i:s')  // criar coluna primeiro
        ]);

        if ($estabId <= 0) {
            echo json_encode(["status"=>"erro","mensagem"=>"Falha ao salvar empresa."]); return;
        }

        /* 3.1 telefone (opcional) */
        if (!empty($d['telefone'])) {
            $this->loadModel('Telefone')->inserir([
                'estabelecimento_id' => $estabId,
                'numero'             => preg_replace('/\D/','', $d['telefone']),
                'tipo'               => $d['tipo_telefone'] ?? 'm'
            ]);
        }

        /* 3.2 categoria (opcional) */
        if (!empty($d['categoria_id'])) {
            $this->loadModel('CategoriaEstabelecimento')
                 ->vincular($estabId, (int) $d['categoria_id']);
        }

        /* 4. sucesso */
        echo json_encode([
            "status"  => "sucesso",
            "mensagem"=> "Empresa cadastrada com sucesso!",
            "empresa" => ["id" => $estabId]
        ]);
    }

    /*----------------------------------------------------
     | POST /empresa/login
     *---------------------------------------------------*/
    public function login()
    {
        header('Content-Type: application/json');

        $d = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($d['email']) || empty($d['senha'])) {
            echo json_encode(["status"=>"erro","mensagem"=>"Informe e-mail e senha."]);
            return;
        }

        $emp = $this->loadModel('Empresa')
                    ->autenticar(trim($d['email']), trim($d['senha']));

        if (!$emp) {
            echo json_encode(["status"=>"erro","mensagem"=>"E-mail ou senha inválidos."]); return;
        }

        echo json_encode([
            "status"   => "sucesso",
            "mensagem" => "Login realizado com sucesso!",
            "empresa"  => [
                "id"    => $emp['estabelecimento_id'],
                "nome"  => $emp['nome'],
                "email" => $emp['email']
            ]
        ]);
    }
}

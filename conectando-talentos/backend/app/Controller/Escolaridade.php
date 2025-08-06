<?php
namespace App\Controller;

use Core\Library\ControllerMain;
use Core\Library\Response;
use Core\Library\Session;

class Escolaridade extends ControllerMain
{
    // public const PUBLIC_ACTIONS = ['index','show'];

    public function __construct()
    {
        parent::__construct();
        $this->model = $this->loadModel('Escolaridade');
    }

    /* =========================================================
       GET /escolaridade  → lista tudo
    ========================================================= */
    public function index(): void
    {
        Response::json([
            'status' => 200,
            'data'   => $this->model->listaJoinCurriculum()
        ]);
    }

    /* =========================================================
       GET /escolaridade/show/{id}  → registro único
    ========================================================= */
    public function show($id): void
    {
        $row = $this->model->getById($id);

        Response::json([
            'status' => $row ? 200 : 404,
            'data'   => $row ?: ['erro' => 'Registro não encontrado']
        ]);
    }

    /* =========================================================
       POST /escolaridade/insert  → cria
    ========================================================= */
    public function insert(): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];

        if ($this->model->insert($dados) === true) {
            Response::json(['status' => 201, 'mensagem' => 'Inserido com sucesso']);
            return;
        }

        Response::json([
            'status' => 422,
            'errors' => Session::getDestroy('errors')
        ]);
    }

    /* =========================================================
       PUT /escolaridade/update/{id}  → atualiza
    ========================================================= */
    public function update($id): void
    {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $dados['curriculum_escolaridade_id'] = $id;   // garante PK

        if ($this->model->update($dados) === true) {
            Response::json(['status' => 200, 'mensagem' => 'Atualizado']);
            return;
        }

        Response::json([
            'status' => 422,
            'errors' => Session::getDestroy('errors')
        ]);
    }

    /* =========================================================
       DELETE /escolaridade/delete/{id}  → exclui
    ========================================================= */
    public function delete($id): void
    {
        if ($this->model->delete(['curriculum_escolaridade_id' => $id])) {
            Response::json(['status' => 200, 'mensagem' => 'Excluído']);
            return;
        }

        Response::json(['status' => 404, 'erro' => 'Registro não encontrado']);
    }
}

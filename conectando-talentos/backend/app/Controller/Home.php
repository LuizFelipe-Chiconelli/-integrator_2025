<?php

namespace App\Controller;

use Core\Library\ControllerMain;

class Home extends ControllerMain
{
    public function index()
    {
        echo json_encode(["mensagem" => "Home carregado com sucesso"]);
    }
}

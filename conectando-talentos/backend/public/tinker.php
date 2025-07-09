<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../core/Helper/utilits.php';
require_once __DIR__ . '/../app/Config/Constants.php';

(new \Core\Library\Ambiente)->load();

$model = new \App\Model\CurriculumModel;
print_r($model->getByPessoaFisica(1252));


<?php
namespace App\Model;

use Core\Library\ModelMain;

class CargoModel extends ModelMain
{
    protected $table      = 'cargo';
    protected $primaryKey = 'cargo_id';

    public function lista($orderby = 'descricao', $direction = 'ASC')
    {
        return $this->db
            ->orderBy($orderby, $direction)
            ->findAll();
    }
}

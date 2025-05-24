<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela que registra QUAL usuário aceitou QUAL termo.
 */
class TermoUsoAceiteModel extends ModelMain
{
    protected $table = 'termodeusoaceite';

    /**
     * Registra o aceite.
     * @param array $dados ['termodeuso_id'=>, 'usuario_id'=>, 'dataHoraAceite'=>]
     * @return int  id inserido
     */
    public function registrarAceite(array $dados): int
    {
        return $this->db->insert($dados);
    }
}

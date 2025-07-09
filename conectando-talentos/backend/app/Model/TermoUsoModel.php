<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model responsável pela tabela "termodeuso".
 * Herda todos os métodos CRUD de ModelMain (select, insert, etc.).
 */
class TermoUsoModel extends ModelMain
{
    protected $table = 'termodeuso';

    /**
     * Recupera a última versão publicada e ativa do termo.
     * @return array|null  (null se não existir)
     */
    public function ultimo()
    {
        return $this->db
            ->where('statusRegistro', 1)  // 1 = ativo
            ->where('rascunho', 0)        // 0 = publicado
            ->orderBy('id', 'DESC')       // maior id = mais recente
            ->first();                    // retorna a primeira linha
    }
}

<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela `curriculum`
 */
class CurriculumModel extends ModelMain
{
    protected $table      = 'curriculum';
    protected $primaryKey = 'curriculum_id';

    /*-------------------------------------------------------------
     | 1. Busca pelo FK da pessoa física
     *------------------------------------------------------------*/
    public function getByPessoaFisica(int $pfId): ?array
    {
        return $this->db
            ->where('pessoa_fisica_id', $pfId)
            ->first();
    }

    /*-------------------------------------------------------------
     | 2. UPDATE se já existir – INSERT caso contrário
     |    (com LOG de depuração 🔍)
     *------------------------------------------------------------*/
    public function updateByPessoaFisica(int $pfId, array $data): int
    {
    /* ping: confirma se este método está realmente sendo executado */
    file_put_contents(
        __DIR__ . '/../../runtime/passo-model.txt',
        date('[H:i:s] ') . "entrou em CurriculumModel::updateByPessoaFisica\n",
        FILE_APPEND
    );

    /* valores-padrão para colunas NOT NULL */
    $data = array_merge([
        'logradouro'         => '',
        'bairro'             => '',
        'cep'                => '',
        'cidade_id'          => 0,
        'celular'            => '',
        'dataNascimento'     => '1900-01-01',
        'sexo'               => '',
        'email'              => ''
    ], $data);

    $row = $this->getByPessoaFisica($pfId);

    try {
        if ($row) {
            /* UPDATE */
            return $this->db
                ->where('curriculum_id', $row['curriculum_id'])
                ->update($data);
        }

        /* INSERT */
        $data['pessoa_fisica_id'] = $pfId;
        return $this->db->insert($data);
    }
    catch (\PDOException $e) {
        /* grava detalhe do erro SQL para debug */
        file_put_contents(
            __DIR__ . '/../../runtime/erro-sql.txt',
            date('[H:i:s] ') . $e->getMessage() . PHP_EOL,
            FILE_APPEND
        );
        throw $e;   // deixa a exceção propagar (verá 500 no Network)
    }
    }

}

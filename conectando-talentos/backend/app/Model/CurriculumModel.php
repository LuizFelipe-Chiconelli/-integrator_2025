<?php
namespace App\Model;

use Core\Library\ModelMain;

/**
 * Model da tabela `curriculum`
 * Gerencia os currículos dos candidatos
 */
class CurriculumModel extends ModelMain
{
    protected $table      = 'curriculum';
    protected $primaryKey = 'curriculum_id';

    /** Busca currículo pelo ID da pessoa física */
    public function getByPessoaFisica(int $pfId): ?array
    {
        return $this->db
            ->where('pessoa_fisica_id', $pfId)
            ->first();
    }

    /** 
     * Atualiza ou cria currículo para uma pessoa física
     * Se já existe: UPDATE, se não: INSERT
     * Inclui logs para debug em caso de erro
     */
    public function updateByPessoaFisica(int $pfId, array $data): int
    {
        // Log para debug - confirma execução do método
        file_put_contents(
            __DIR__ . '/../../runtime/passo-model.txt',
            date('[H:i:s] ') . "entrou em CurriculumModel::updateByPessoaFisica\n",
            FILE_APPEND
        );

        // Define valores padrão para campos obrigatórios
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

        // Verifica se já existe currículo
        $row = $this->getByPessoaFisica($pfId);

        try {
            if ($row) {
                // UPDATE do currículo existente
                return $this->db
                    ->where('curriculum_id', $row['curriculum_id'])
                    ->update($data);
            }

            // INSERT de novo currículo
            $data['pessoa_fisica_id'] = $pfId;
            return $this->db->insert($data);
        }
        catch (\PDOException $e) {
            // Log detalhado do erro SQL para debug
            file_put_contents(
                __DIR__ . '/../../runtime/erro-sql.txt',
                date('[H:i:s] ') . $e->getMessage() . PHP_EOL,
                FILE_APPEND
            );
            throw $e; // Propaga a exceção para o controller
        }
    }
}
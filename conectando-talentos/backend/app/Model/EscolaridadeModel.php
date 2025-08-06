<?php
namespace App\Model;

use Core\Library\ModelMain;

class EscolaridadeModel extends ModelMain
{
    /** tabela no banco */
    protected $table = 'curriculum_escolaridade';

    /** PK real */
    protected $primaryKey = 'curriculum_escolaridade_id';

    /** campos permitidos */
    protected $allowedFields = [
        'curriculum_curriculum_id',
        'inicioMes', 'inicioAno',
        'fimMes', 'fimAno',
        'descricao', 'instituicao'
    ];

    /** regras de validação */
    public $validationRules = [
        'curriculum_curriculum_id' => [
            'rules' => 'required|int',
            'label' => 'Currículo'
        ],
        'inicioMes' => [
            'rules' => 'required|int|min:1|max:12',
            'label' => 'Mês de início'
        ],
        'inicioAno' => [
            'rules' => 'required|int',
            'label' => 'Ano de início'
        ],
        'fimMes' => [
            'rules' => 'required|int|min:1|max:12',
            'label' => 'Mês de término'
        ],
        'fimAno' => [
            'rules' => 'required|int',
            'label' => 'Ano de término'
        ],
        'descricao' => [
            'rules' => 'required|max:60',
            'label' => 'Descrição'
        ],
        'instituicao' => [
            'rules' => 'required|max:60',
            'label' => 'Instituição'
        ]
    ];

    /** Busca um registro pela PK */
    public function getById($id)
    {
        return $this->db
                    ->where($this->primaryKey, $id)
                    ->first();
    }

    /** Lista com JOIN (usa campo existente em curriculum) */
    public function listaJoinCurriculum()
    {
        return $this->db
            ->select('e.*, c.apresentacaoPessoal AS curriculum_info') // ajuste se quiser outro campo
            ->table("{$this->table} e")
            ->join('curriculum c', 'c.curriculum_id = e.curriculum_curriculum_id')
            ->findAll();
    }
}

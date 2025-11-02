<?php
namespace App\Model;

use Core\Library\ModelMain;

class CidadeModel extends ModelMain
{
    protected $table      = 'cidade';
    protected $primaryKey = 'cidade_id';

    /** 
     * Busca uma cidade pelo ID 
     * Retorna os dados da cidade ou null se não encontrar
     */
    public function findById(int $id): ?array
    {
        return $this->db
            ->where($this->primaryKey, $id)
            ->first(); // Retorna array ou null
    }

    /** 
     * Lista cidades com opção de filtro por UF
     * @param string $uf Filtro opcional por estado (ex: 'SP', 'MG')
     * @return array Lista de cidades ordenadas
     */
    public function lista($orderby = 'cidade', $direction = 'ASC', $uf = null)
    {
        $query = $this->db->orderBy($orderby, $direction);
        
        // Aplica filtro por UF se fornecido
        if ($uf) {
            $query->where('uf', $uf);
        }
        
        return $query->findAll();
    }
}
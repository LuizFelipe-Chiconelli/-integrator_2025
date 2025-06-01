<?php
namespace App\Model;

use Core\Library\ModelMain;
use PDOException;

/**
 * Model da tabela `estabelecimento`
 */
class EmpresaModel extends ModelMain
{
    protected $table = 'estabelecimento';

    /*----------------------------------------------------
     | INSERT (cadastra empresa) – devolve PK gerada
     *---------------------------------------------------*/
    public function inserir(array $data): int
    {
        try {
            $cols  = implode(', ', array_keys($data));
            $binds = ':' . implode(', :', array_keys($data));
            $sql   = "INSERT INTO {$this->table} ($cols) VALUES ($binds)";

            $con   = $this->db->connect();   // objeto Database
            $stmt  = $con->prepare($sql);
            $stmt->execute($data);

            return (int) $con->lastInsertId();
        }
        /* DEBUG: mostra erro SQL em desenvolvimento  */
        catch (PDOException $e) {
            echo json_encode([
                "status"   => "erro-sql",
                "mensagem" => $e->getMessage()
                /* "sql"  => $sql,           // ☑ mostre só se precisar
                   "dados"=> $data          */
            ]);
            exit;
        }
    }

    /* duplicidade */
    public function existeCnpj(string $cnpj): bool  { return (bool) $this->db->where('cnpj',  $cnpj)->first(); }
    public function existeEmail(string $email): bool{ return (bool) $this->db->where('email', $email)->first(); }

    /* consulta simples */
    public function findById(int $id): ?array
    {
        return $this->db->where('estabelecimento_id', $id)->first();
    }

    /* login */
    public function autenticar(string $email, string $senha): ?array
    {
        $emp = $this->db->where('email', $email)->first();
        if ($emp && password_verify($senha, $emp['senha'])) {
            unset($emp['senha']);
            return $emp;
        }
        return null;
    }

    /* opcional: liga usuário dono */
    public function definirDono(int $estabId, int $usuarioId): bool
    {
        return $this->db
            ->where('estabelecimento_id', $estabId)
            ->update(['usuario_id' => $usuarioId]) > 0;
    }
}

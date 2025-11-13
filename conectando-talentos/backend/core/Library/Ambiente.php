<?php

namespace Core\Library;

class Ambiente
{

    //Separação de Ambientes: Permite configurações diferentes para dev/prod

    //Superglobal $_ENV: Armazena variáveis de ambiente acessíveis em toda aplicação

    //Segurança: Mantém dados sensíveis fora do código

    //Flexibilidade: Facilita mudança entre ambientes sem alterar código
    //1Carrega arquivo .env → 2. Configurações globais → 3. Configurações do ambiente específico

    //Esta classe é fundamental para o funcionamento do framework, garantindo que cada ambiente tenha suas configurações apropriadas.
    
    /**
     * load
     *
     * @return void
     */
    public function load()
    {
        // analisa e carregar o conteúdo do arquivo .env em um array
        $confAmbiente = parse_ini_file('..' . DIRECTORY_SEPARATOR . '.env', true);

        foreach ($confAmbiente as $key => $value) {
            if (gettype($confAmbiente[$key]) != "array") {
                $_ENV[$key] = $value;
            }
        }

        // Pegar as configurações do ambiente
        if (isset($_ENV['ENVIRONMENT'])) {
            foreach($confAmbiente[$_ENV['ENVIRONMENT']] as $key => $value) {
                $_ENV[$key] = $value;
            }
        }

        return null;
    }
}
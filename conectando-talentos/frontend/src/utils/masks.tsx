/* 
  Arquivo: utils/masks.tsx
  Máscaras reutilizáveis para formulários
  ---------------------------------------
  - Todas as funções removem caracteres não numéricos
  - Limitam o tamanho máximo esperado
  - Formatam em tempo real enquanto o usuário digita
*/

/** Mascara de CPF: 000.000.000-00 */
export const maskCPF = (v: string) =>
  v
    .replace(/\D/g, "")                           // só números
    .replace(/(\d{3})(\d)/, "$1.$2")              // 000.
    .replace(/(\d{3})(\d)/, "$1.$2")              // 000.000.
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")        // 000.000.000-00
    .slice(0, 14);                                // máximo 14 chars

/** Mascara de CNPJ: 00.000.000/0000-00 */
export const maskCNPJ = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")             // 00.
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // 00.000.
    .replace(/\.(\d{3})(\d)/, ".$1/$2")           // 00.000.000/
    .replace(/(\d{4})(\d)/, "$1-$2")              // 00.000.000/0000-00
    .slice(0, 18);

/** Mascara de CEP: 00000-000 */
export const maskCEP = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);

/** Mascara de telefone: (00) 00000-0000 */
export const maskPhone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")           // (00)
    .replace(/(\d{5})(\d)/, "$1-$2")              // (00) 00000-0000
    .slice(0, 15);

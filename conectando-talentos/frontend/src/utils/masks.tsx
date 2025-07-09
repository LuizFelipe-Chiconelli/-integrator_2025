export const maskCPF = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .slice(0, 14);

export const maskCEP = (v: string) =>
  v.replace(/\D/g, "")
   .replace(/^(\d{5})(\d)/, "$1-$2")
   .slice(0, 9);

export const maskPhone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d)/, "($1")
    .replace(/^(\(\d{2})(\d)/, "$1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);

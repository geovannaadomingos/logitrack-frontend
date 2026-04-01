/**
 * Converte uma string de data no formato PT-BR "dd/MM/yyyy" para um objeto Date.
 * @param dateString - String de data (ex: "01/04/2026")
 * @returns Objeto Date ou null se inválido
 */
export function parseBRDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  
  if (dateString.includes('-') && !dateString.includes('/')) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts;
  const isoDate = `${year}-${month}-${day}`;
  const date = new Date(isoDate);
  
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formata uma data para o padrão PT-BR.
 * @param date - Objeto Date ou string
 * @param fallback - Valor de retorno caso a data seja inválida (padrão: "-")
 */
export function formatBRDate(date: Date | string | null | undefined, fallback = '-'): string {
  if (!date) return fallback;
  
  let dateObj: Date | null;
  
  if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = parseBRDate(date);
  }
  
  if (!dateObj || isNaN(dateObj.getTime())) return fallback;
  
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Converte uma data para o formato ISO local (YYYY-MM-DDTHH:mm:ss) sem timezone UTC.
 * @param date - Objeto Date
 * @returns String ISO ou null se inválida
 */
export function toLocalISOString(date: Date): string | null {
  if (!date || isNaN(date.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}


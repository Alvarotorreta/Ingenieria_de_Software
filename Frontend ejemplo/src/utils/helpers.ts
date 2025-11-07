// =========================================================
// Funciones auxiliares útiles para el proyecto
// =========================================================

/**
 * Genera un código aleatorio de 6 dígitos
 */
export function generarCodigoSala(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Valida un código de sala (debe ser 6 dígitos)
 */
export function validarCodigoSala(codigo: string): boolean {
  return /^\d{6}$/.test(codigo);
}

/**
 * Valida un email UDD
 */
export function validarEmailUDD(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@(udd\.cl|mail\.udd\.cl)$/.test(email);
}

/**
 * Formatea una fecha para mostrar
 */
export function formatearFecha(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea una fecha en formato corto
 */
export function formatearFechaCorta(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Calcula el tiempo transcurrido desde una fecha
 */
export function tiempoTranscurrido(fecha: string | Date): string {
  const ahora = new Date();
  const entonces = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const diff = ahora.getTime() - entonces.getTime();
  
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'Recién';
}

/**
 * Obtiene las iniciales de un nombre
 */
export function obtenerIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Genera un color aleatorio para avatares
 */
export function generarColorAleatorio(): string {
  const colores = [
    '#ff4757', '#3742fa', '#2ed573', '#ffa502',
    '#5f27cd', '#ee5a6f', '#1e90ff', '#ff6348'
  ];
  return colores[Math.floor(Math.random() * colores.length)];
}

/**
 * Trunca un texto a cierta longitud
 */
export function truncarTexto(texto: string, maxLength: number = 50): string {
  if (texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength) + '...';
}

/**
 * Convierte un número a formato con separador de miles
 */
export function formatearNumero(num: number): string {
  return num.toLocaleString('es-CL');
}

/**
 * Calcula el porcentaje
 */
export function calcularPorcentaje(parte: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((parte / total) * 100);
}

/**
 * Mezcla un array aleatoriamente (Fisher-Yates shuffle)
 */
export function mezclarArray<T>(array: T[]): T[] {
  const nuevo = [...array];
  for (let i = nuevo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevo[i], nuevo[j]] = [nuevo[j], nuevo[i]];
  }
  return nuevo;
}

/**
 * Agrupa un array en chunks
 */
export function agruparEnChunks<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Debounce para inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Descarga un archivo JSON
 */
export function descargarJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copia texto al portapapeles
 */
export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Valida una contraseña (mínimo 8 caracteres, 1 letra y 1 número)
 */
export function validarContrasena(password: string): {
  valida: boolean;
  errores: string[];
} {
  const errores: string[] = [];

  if (password.length < 8) {
    errores.push('Debe tener al menos 8 caracteres');
  }
  if (!/[a-zA-Z]/.test(password)) {
    errores.push('Debe contener al menos una letra');
  }
  if (!/[0-9]/.test(password)) {
    errores.push('Debe contener al menos un número');
  }

  return {
    valida: errores.length === 0,
    errores
  };
}

/**
 * Genera un ID único simple (para uso temporal)
 */
export function generarIdUnico(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convierte un estado de la DB a texto legible
 */
export function estadoATexto(estado: 'programada' | 'en_juego' | 'finalizado'): string {
  const estados = {
    'programada': 'Programada',
    'en_juego': 'En Juego',
    'finalizado': 'Finalizado'
  };
  return estados[estado] || estado;
}

/**
 * Obtiene el color del estado
 */
export function colorPorEstado(estado: 'programada' | 'en_juego' | 'finalizado'): string {
  const colores = {
    'programada': '#ffa502',
    'en_juego': '#2ed573',
    'finalizado': '#747d8c'
  };
  return colores[estado] || '#747d8c';
}

/**
 * Sleep/delay para async functions
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry para llamadas API
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delay * attempt);
    }
  }
  throw new Error('Max attempts reached');
}

/**
 * Verifica si estamos en modo desarrollo
 */
export function isDevelopment(): boolean {
  return typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;
}

/**
 * Log de desarrollo (solo en dev)
 */
export function devLog(...args: any[]) {
  if (isDevelopment()) {
    console.log('[DEV]', ...args);
  }
}

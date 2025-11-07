import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner@2.0.3';
import Confetti from '../../components/Confetti';

// Palabras a encontrar (6 palabras de emprendimiento - simplificado)
const PALABRAS = [
  'IDEA',
  'META',
  'EQUIPO',
  'PITCH',
  'LIDER',
  'RIESGO'
];

const GRID_SIZE = 12;

// Generar sopa de letras con posiciones fijas
const generarSopaDeLetras = () => {
  // Inicializar grilla vacía
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const posicionesPalabras: { palabra: string; celdas: { row: number; col: number }[] }[] = [];

  // Posiciones fijas para cada palabra (solo horizontal y vertical)
  // Asegurándonos de que no se sobrepongan
  const palabrasConPosiciones = [
    { palabra: 'IDEA', row: 1, col: 1, horizontal: true },      // I-D-E-A (fila 1, col 1-4)
    { palabra: 'META', row: 3, col: 7, horizontal: false },     // M-E-T-A (col 7, fila 3-6)
    { palabra: 'EQUIPO', row: 5, col: 0, horizontal: true },    // E-Q-U-I-P-O (fila 5, col 0-5)
    { palabra: 'PITCH', row: 0, col: 9, horizontal: false },    // P-I-T-C-H (col 9, fila 0-4)
    { palabra: 'LIDER', row: 8, col: 4, horizontal: true },     // L-I-D-E-R (fila 8, col 4-8)
    { palabra: 'RIESGO', row: 10, col: 2, horizontal: true },   // R-I-E-S-G-O (fila 10, col 2-7)
  ];

  // Colocar cada palabra en su posición fija
  palabrasConPosiciones.forEach(({ palabra, row: startRow, col: startCol, horizontal }) => {
    const celdas: { row: number; col: number }[] = [];
    
    for (let i = 0; i < palabra.length; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;
      
      // Verificar límites
      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        grid[row][col] = palabra[i];
        celdas.push({ row, col });
      }
    }
    
    if (celdas.length === palabra.length) {
      posicionesPalabras.push({ palabra, celdas });
    }
  });

  // Llenar espacios vacíos con letras predefinidas para consistencia
  const letras = 'ABCDEFGHIJLMNOPQRSTUVYZ';
  let letraIndex = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letras[letraIndex % letras.length];
        letraIndex++;
      }
    }
  }

  return { grid, posicionesPalabras };
};

interface Celda {
  row: number;
  col: number;
}

export default function TabletMiniJuego() {
  const navigate = useNavigate();
  const [sopaLetras] = useState(() => generarSopaDeLetras());
  const [palabrasEncontradas, setPalabrasEncontradas] = useState<string[]>([]);
  const [seleccionActual, setSeleccionActual] = useState<Celda[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const isCeldaSeleccionada = (row: number, col: number) => {
    return seleccionActual.some(c => c.row === row && c.col === col);
  };

  const isCeldaEncontrada = (row: number, col: number) => {
    return sopaLetras.posicionesPalabras.some(({ palabra, celdas }) => 
      palabrasEncontradas.includes(palabra) && 
      celdas.some(c => c.row === row && c.col === col)
    );
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSeleccionActual([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return;
    
    // Verificar si la celda ya está seleccionada
    if (!isCeldaSeleccionada(row, col)) {
      setSeleccionActual(prev => [...prev, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    verificarPalabra();
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    setIsSelecting(true);
    setSeleccionActual([{ row, col }]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.hasAttribute('data-cell')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      
      if (!isCeldaSeleccionada(row, col)) {
        setSeleccionActual(prev => [...prev, { row, col }]);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isSelecting) return;
    setIsSelecting(false);
    verificarPalabra();
  };

  const verificarPalabra = () => {
    if (seleccionActual.length === 0) return;

    const palabraSeleccionada = seleccionActual
      .map(({ row, col }) => sopaLetras.grid[row][col])
      .join('');

    // Verificar en ambas direcciones
    const palabraReversa = palabraSeleccionada.split('').reverse().join('');

    const palabraEncontrada = sopaLetras.posicionesPalabras.find(({ palabra, celdas }) => {
      if (palabrasEncontradas.includes(palabra)) return false;
      
      // Verificar si coinciden las celdas
      if (celdas.length !== seleccionActual.length) return false;
      
      const coincide = celdas.every((celda, i) => 
        (celda.row === seleccionActual[i].row && celda.col === seleccionActual[i].col) ||
        (celda.row === seleccionActual[seleccionActual.length - 1 - i].row && 
         celda.col === seleccionActual[seleccionActual.length - 1 - i].col)
      );
      
      return coincide;
    });

    if (palabraEncontrada) {
      setPalabrasEncontradas(prev => [...prev, palabraEncontrada.palabra]);
      toast.success(`🎉 ¡Encontraste "${palabraEncontrada.palabra}"!`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setSeleccionActual([]);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        verificarPalabra();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, seleccionActual]);

  const handleContinuar = () => {
    navigate('/tablet/espera-etapa');
  };

  const juegoCompletado = palabrasEncontradas.length === PALABRAS.length;

  return (
    <div className="h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-4 overflow-hidden">
      {showConfetti && <Confetti />}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl h-full flex items-center"
      >
        <Card className="p-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1"></div>
            <div className="text-center flex-1">
              <h1 className="text-[#093c92] mb-1 text-3xl">
                🔍 Sopa de Letras - Emprendimiento
              </h1>
              <p className="text-gray-600 text-lg">
                Encuentra las 6 palabras deslizando con el dedo
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                onClick={handleContinuar}
                variant="outline"
                className="border-2 border-gray-300 hover:border-[#f757ac] hover:bg-[#f757ac] hover:text-white transition-all"
              >
                Saltar juego
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {/* Panel lateral izquierdo - Lista de palabras */}
            <div className="flex flex-col gap-3">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-purple-900 text-lg">Palabras a encontrar</h3>
                  <div className="bg-white rounded-full px-3 py-1 shadow-sm">
                    <span className="text-purple-900 text-sm">
                      {palabrasEncontradas.length}/{PALABRAS.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {PALABRAS.map((palabra) => {
                    const encontrada = palabrasEncontradas.includes(palabra);
                    return (
                      <motion.div
                        key={palabra}
                        initial={false}
                        animate={{ 
                          scale: encontrada ? [1, 1.1, 1] : 1,
                        }}
                        className={`
                          inline-flex items-center gap-1.5 px-4 py-2 rounded-full transition-all
                          ${encontrada 
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'bg-white text-gray-700 border-2 border-gray-200'
                          }
                        `}
                      >
                        <span className={encontrada ? 'line-through' : ''}>
                          {palabra}
                        </span>
                        {encontrada && (
                          <CheckCircle className="w-4 h-4 ml-auto" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Botón continuar */}
              <AnimatePresence>
                {juegoCompletado && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Button
                      onClick={handleContinuar}
                      className="w-full h-12 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-xl shadow-lg"
                    >
                      ¡Completado! Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid de sopa de letras */}
            <div
              ref={gridRef}
              className="inline-block bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-2xl shadow-lg select-none"
              onMouseLeave={() => {
                if (isSelecting) {
                  setIsSelecting(false);
                  verificarPalabra();
                }
              }}
            >
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                {sopaLetras.grid.map((fila, rowIndex) =>
                  fila.map((letra, colIndex) => {
                    const seleccionada = isCeldaSeleccionada(rowIndex, colIndex);
                    const encontrada = isCeldaEncontrada(rowIndex, colIndex);

                    return (
                      <motion.div
                        key={getCellKey(rowIndex, colIndex)}
                        data-cell="true"
                        data-row={rowIndex}
                        data-col={colIndex}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        whileHover={{ scale: 1.1 }}
                        className={`
                          w-8 h-8 flex items-center justify-center cursor-pointer text-sm
                          rounded-md transition-all duration-200
                          ${encontrada 
                            ? 'bg-green-400 text-white shadow-md' 
                            : seleccionada 
                              ? 'bg-blue-400 text-white shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-blue-100'
                          }
                        `}
                      >
                        <span className="select-none pointer-events-none">
                          {letra}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Contador de encontradas */}
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 text-center shadow-lg">
              <Trophy className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <div className="text-4xl text-orange-900 mb-1">
                {palabrasEncontradas.length}
              </div>
              <div className="text-orange-700">encontradas</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

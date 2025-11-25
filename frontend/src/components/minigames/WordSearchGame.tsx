import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WordSearchData } from './types';
import { toast } from 'sonner';

interface WordSearchGameProps {
  data: WordSearchData;
  foundWords: string[];
  onWordFound: (word: string, cells: Array<{ row: number; col: number }>) => void;
  onComplete: () => void;
}

interface Cell {
  row: number;
  col: number;
}

export function WordSearchGame({
  data,
  foundWords,
  onWordFound,
  onComplete,
}: WordSearchGameProps) {
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = data.grid.length;
  const allWordsFound = foundWords.length === data.words.length;
  const completedRef = useRef(false);

  useEffect(() => {
    if (allWordsFound && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [allWordsFound, onComplete]);

  // Cleanup: restaurar scroll al desmontar el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(c => c.row === row && c.col === col);
  };

  const isCellFound = (row: number, col: number) => {
    return data.wordPositions.some(({ word, cells }) => 
      foundWords.includes(word) && 
      cells.some(c => c.row === row && c.col === col)
    );
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !startCell) return;

    // Calcular celdas entre startCell y la celda actual
    const newCells = getCellsBetween(startCell, { row, col });
    setSelectedCells(newCells);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    verifySelection();
    setStartCell(null);
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
    // Prevenir scroll en el body mientras se selecciona
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting || !startCell) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.hasAttribute('data-cell')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      const newCells = getCellsBetween(startCell, { row, col });
      setSelectedCells(newCells);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    if (!isSelecting) return;
    setIsSelecting(false);
    verifySelection();
    setStartCell(null);
  };

  const getCellsBetween = (start: Cell, end: Cell): Cell[] => {
    const cells: Cell[] = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;

    // Solo permitir direcciones horizontales, verticales y diagonales
    if (rowDiff === 0) {
      // Horizontal
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ row: start.row, col });
      }
    } else if (colDiff === 0) {
      // Vertical
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      for (let row = minRow; row <= maxRow; row++) {
        cells.push({ row, col: start.col });
      }
    } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      // Diagonal
      const rowStep = rowDiff > 0 ? 1 : -1;
      const colStep = colDiff > 0 ? 1 : -1;
      let row = start.row;
      let col = start.col;
      while (
        (rowStep > 0 ? row <= end.row : row >= end.row) &&
        (colStep > 0 ? col <= end.col : col >= end.col)
      ) {
        cells.push({ row, col });
        row += rowStep;
        col += colStep;
      }
    } else {
      // Si no es una línea recta, solo devolver la celda inicial
      return [start];
    }

    return cells;
  };

  const verifySelection = () => {
    if (selectedCells.length === 0) {
      setSelectedCells([]);
      return;
    }

    // Obtener la palabra formada por las celdas seleccionadas
    const selectedWord = selectedCells
      .map(({ row, col }) => data.grid[row]?.[col] || '')
      .join('')
      .toUpperCase();

    const reversedWord = selectedWord.split('').reverse().join('');

    // Buscar si coincide con alguna palabra no encontrada
    const foundWord = data.wordPositions.find(({ word, cells }) => {
      if (foundWords.includes(word)) return false;
      if (cells.length !== selectedCells.length) return false;

      // Verificar si las celdas coinciden (en cualquier dirección)
      const wordUpper = word.toUpperCase();
      const matchesForward = selectedWord === wordUpper && 
        cells.every((cell, i) => 
          cell.row === selectedCells[i].row && cell.col === selectedCells[i].col
        );
      
      const matchesReverse = reversedWord === wordUpper && 
        cells.every((cell, i) => 
          cell.row === selectedCells[selectedCells.length - 1 - i].row && 
          cell.col === selectedCells[selectedCells.length - 1 - i].col
        );

      return matchesForward || matchesReverse;
    });

    if (foundWord) {
      onWordFound(foundWord.word, foundWord.cells);
      toast.success(`🎉 ¡Encontraste "${foundWord.word}"!`);
      setSelectedCells([]);
    } else {
      setSelectedCells([]);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        verifySelection();
        setStartCell(null);
        // Restaurar scroll del body
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      // Asegurar que se restaure el scroll al desmontar
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isSelecting, selectedCells]);

  return (
    <div className="space-y-6">
      {/* Lista de palabras a encontrar */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-900 font-bold text-base sm:text-lg">
            Palabras a encontrar
          </h3>
          <div className="bg-white rounded-full px-3 py-1 shadow-sm">
            <span className="text-purple-900 font-semibold text-sm">
              {foundWords.length}/{data.words.length}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.words.map((word) => {
            const encontrada = foundWords.includes(word);
            return (
              <motion.div
                key={word}
                initial={false}
                animate={{ 
                  scale: encontrada ? [1, 1.1, 1] : 1,
                }}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold
                  ${encontrada 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                  }
                `}
              >
                <span className={encontrada ? 'line-through' : ''}>
                  {word}
                </span>
                {encontrada && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Grid de sopa de letras */}
      <div className="flex flex-col items-center gap-4">
        <div
          ref={gridRef}
          className="inline-block bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl shadow-lg select-none"
          style={{ touchAction: 'none' }}
          onMouseLeave={() => {
            if (isSelecting) {
              setIsSelecting(false);
              verifySelection();
              setStartCell(null);
              // Restaurar scroll del body
              document.body.style.overflow = '';
              document.body.style.touchAction = '';
            }
          }}
          onTouchStart={(e) => {
            // Prevenir scroll cuando se toca el grid
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            // Prevenir scroll cuando se mueve sobre el grid
            if (isSelecting) {
              e.preventDefault();
            }
          }}
        >
          <div 
            className="grid gap-0.5" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              touchAction: 'none'
            }}
          >
            {data.grid.map((fila, rowIndex) =>
              fila.map((letra, colIndex) => {
                const seleccionada = isCellSelected(rowIndex, colIndex);
                const encontrada = isCellFound(rowIndex, colIndex);

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
                    whileHover={{ scale: encontrada ? 1 : 1.05 }}
                    style={{ touchAction: 'none' }}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer text-sm sm:text-base
                      font-bold rounded-md transition-all duration-200 select-none
                      ${encontrada 
                        ? 'bg-green-400 text-white shadow-md' 
                        : seleccionada 
                          ? 'bg-blue-400 text-white shadow-md' 
                          : 'bg-white text-gray-700 hover:bg-blue-100'
                      }
                    `}
                  >
                    <span className="pointer-events-none">
                      {letra}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Contador de encontradas */}
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 sm:p-6 text-center shadow-lg w-full max-w-xs">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 mx-auto mb-2" />
          <div className="text-3xl sm:text-4xl text-orange-900 font-bold mb-1">
            {foundWords.length}
          </div>
          <div className="text-orange-700 text-sm sm:text-base font-semibold">
            encontradas
          </div>
        </div>
      </div>

      {/* Mensaje de completado */}
      <AnimatePresence>
        {allWordsFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center"
          >
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-3" />
            <p className="text-xl sm:text-2xl font-bold text-green-700 mb-2">
              ¡Felicidades!
            </p>
            <p className="text-green-800 text-sm sm:text-base">
              Has encontrado todas las palabras
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


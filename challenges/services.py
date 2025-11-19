"""
Servicios para generar sopas de letras y otros minijuegos
"""
import random
import string
from typing import List, Dict, Tuple, Optional


class SeededRandom:
    """Generador de números pseudoaleatorios con semilla fija"""
    def __init__(self, seed: int):
        self.seed = seed

    def next(self) -> float:
        self.seed = (self.seed * 9301 + 49297) % 233280
        return self.seed / 233280


def generate_word_search(words: List[str], seed: Optional[int] = None) -> Dict:
    """
    Genera una sopa de letras con las palabras proporcionadas
    
    Args:
        words: Lista de palabras a colocar en la sopa de letras
        seed: Semilla opcional para generar la misma sopa de letras determinísticamente
    
    Returns:
        Diccionario con 'words', 'grid' y 'wordPositions'
    """
    GRID_SIZE = 12
    grid = [['' for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    word_positions = []
    
    # Palabras por defecto si no hay suficientes
    palabras_default = ['IDEA', 'META', 'EQUIPO', 'PITCH', 'LIDER', 'RIESGO', 'NEGOCIO', 'VENTA', 'CLIENTE', 'PRODUCTO']
    
    # Usar las palabras proporcionadas o las por defecto, limitando a un máximo razonable
    # Por defecto usar 5 palabras para probar el correcto funcionamiento
    palabras_usar = words if len(words) >= 5 else palabras_default[:max(len(words), 5)]
    palabras_usar = [w.upper() for w in palabras_usar[:10]]  # Máximo 10 palabras
    
    # Crear una semilla determinística basada en las palabras si no se proporciona
    if seed is None:
        seed_string = ''.join(palabras_usar)
        seed = abs(sum(ord(c) for c in seed_string))
    
    rng = SeededRandom(seed)
    
    # Posiciones iniciales con mayor complejidad: horizontal, vertical y diagonal
    posiciones_iniciales = []
    for i, palabra in enumerate(palabras_usar[:10]):
        if i < 3:
            # Diagonales hacia abajo-derecha
            posiciones_iniciales.append({
                'palabra': palabra,
                'row': i * 2,
                'col': i * 2,
                'direction': 'diagonal_down_right'
            })
        elif i < 5:
            # Diagonales hacia abajo-izquierda
            posiciones_iniciales.append({
                'palabra': palabra,
                'row': (i - 3) * 2,
                'col': 11 - (i - 3) * 2,
                'direction': 'diagonal_down_left'
            })
        elif i < 7:
            # Horizontales
            posiciones_iniciales.append({
                'palabra': palabra,
                'row': 6 + (i - 5),
                'col': 0,
                'direction': 'horizontal'
            })
        else:
            # Verticales
            posiciones_iniciales.append({
                'palabra': palabra,
                'row': 0,
                'col': 5 + (i - 7),
                'direction': 'vertical'
            })
    
    placed_words = set()
    
    def try_place_word(palabra: str, start_row: int, start_col: int, direction: str) -> Tuple[bool, List[Dict]]:
        """Intenta colocar una palabra en la posición especificada"""
        celdas = []
        palabra_upper = palabra.upper()
        
        def calcular_celda(index: int) -> Tuple[int, int]:
            if direction == 'horizontal':
                return (start_row, start_col + index)
            elif direction == 'vertical':
                return (start_row + index, start_col)
            elif direction == 'diagonal_down_right':
                return (start_row + index, start_col + index)
            elif direction == 'diagonal_down_left':
                return (start_row + index, start_col - index)
            return (start_row, start_col + index)
        
        # Verificar si se puede colocar
        puede_colocarse = True
        for i in range(len(palabra_upper)):
            row, col = calcular_celda(i)
            if row < 0 or row >= GRID_SIZE or col < 0 or col >= GRID_SIZE:
                puede_colocarse = False
                break
            if grid[row][col] != '' and grid[row][col] != palabra_upper[i]:
                puede_colocarse = False
                break
        
        if puede_colocarse:
            # Colocar la palabra
            for i in range(len(palabra_upper)):
                row, col = calcular_celda(i)
                if grid[row][col] == '' or grid[row][col] == palabra_upper[i]:
                    grid[row][col] = palabra_upper[i]
                    celdas.append({'row': row, 'col': col})
            
            if len(celdas) == len(palabra_upper):
                direction_standard = 'diagonal' if 'diagonal' in direction else direction
                return True, celdas
        
        return False, []
    
    # Colocar palabras en posiciones iniciales
    for pos in posiciones_iniciales:
        if pos['palabra'] not in placed_words:
            exito, celdas = try_place_word(
                pos['palabra'],
                pos['row'],
                pos['col'],
                pos['direction']
            )
            if exito:
                direction_standard = 'diagonal' if 'diagonal' in pos['direction'] else pos['direction']
                word_positions.append({
                    'word': pos['palabra'],
                    'cells': celdas,
                    'direction': direction_standard
                })
                placed_words.add(pos['palabra'])
    
    # Si no se han colocado suficientes palabras, intentar colocarlas en posiciones aleatorias
    min_words_to_place = 5
    all_possible_directions = ['horizontal', 'vertical', 'diagonal_down_right', 'diagonal_down_left']
    
    while len(placed_words) < min_words_to_place and len(placed_words) < len(palabras_usar):
        remaining_words = [w for w in palabras_usar if w not in placed_words]
        if not remaining_words:
            break
        
        word_to_place = remaining_words[0]
        placed_in_this_attempt = False
        
        for _ in range(20):  # Intentar hasta 20 veces
            random_row = int(rng.next() * GRID_SIZE)
            random_col = int(rng.next() * GRID_SIZE)
            random_direction = all_possible_directions[int(rng.next() * len(all_possible_directions))]
            
            exito, celdas = try_place_word(word_to_place, random_row, random_col, random_direction)
            if exito:
                direction_standard = 'diagonal' if 'diagonal' in random_direction else random_direction
                word_positions.append({
                    'word': word_to_place,
                    'cells': celdas,
                    'direction': direction_standard
                })
                placed_words.add(word_to_place)
                placed_in_this_attempt = True
                break
        
        if not placed_in_this_attempt:
            # Si no se pudo colocar después de muchos intentos, pasar a la siguiente palabra
            placed_words.add(word_to_place)  # Marcar como "intentada"
    
    # Llenar espacios vacíos con letras determinísticas (estáticas)
    letras = string.ascii_uppercase
    for i in range(GRID_SIZE):
        for j in range(GRID_SIZE):
            if grid[i][j] == '':
                # Usar una semilla determinística basada en la posición de la celda
                cell_seed = (i * GRID_SIZE + j + seed) % 1000000
                cell_rng = SeededRandom(cell_seed)
                random_index = int(cell_rng.next() * len(letras))
                grid[i][j] = letras[random_index]
    
    # Eliminar palabras duplicadas, manteniendo solo la primera ocurrencia
    palabras_unicas = []
    palabras_vistas = set()
    
    for wp in word_positions:
        if wp['word'] not in palabras_vistas:
            palabras_unicas.append(wp['word'])
            palabras_vistas.add(wp['word'])
    
    # Filtrar word_positions para mantener solo las primeras ocurrencias de cada palabra
    word_positions_unicas = []
    palabras_vistas = set()
    for wp in word_positions:
        if wp['word'] not in palabras_vistas:
            word_positions_unicas.append(wp)
            palabras_vistas.add(wp['word'])
    
    return {
        'words': palabras_unicas,
        'grid': grid,
        'wordPositions': word_positions_unicas,
    }





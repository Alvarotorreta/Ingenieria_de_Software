import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Edit2, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface Bubble {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  isEditing: boolean;
}

export default function TabletBubbleMap() {
  const navigate = useNavigate();
  
  // Estructura jerárquica: 1 core + 6 main categories + 12 specific ideas (2 por categoría)
  const [coreElement, setCoreElement] = useState<Bubble>({
    id: 'core',
    text: 'Idea Central',
    x: 50,
    y: 50,
    size: 140,
    color: '#093c92',
    isEditing: false
  });

  // Main Categories distribuidas en círculo perfecto (radio 30%)
  const [mainCategories, setMainCategories] = useState<Bubble[]>([
    { id: 'cat1', text: 'Categoría 1', x: 50, y: 20, size: 95, color: '#8b5cf6', isEditing: false },      // Arriba
    { id: 'cat2', text: 'Categoría 2', x: 76, y: 35, size: 95, color: '#8b5cf6', isEditing: false },      // Superior derecha
    { id: 'cat3', text: 'Categoría 3', x: 76, y: 65, size: 95, color: '#8b5cf6', isEditing: false },      // Inferior derecha
    { id: 'cat4', text: 'Categoría 4', x: 50, y: 80, size: 95, color: '#8b5cf6', isEditing: false },      // Abajo
    { id: 'cat5', text: 'Categoría 5', x: 24, y: 65, size: 95, color: '#8b5cf6', isEditing: false },      // Inferior izquierda
    { id: 'cat6', text: 'Categoría 6', x: 24, y: 35, size: 95, color: '#8b5cf6', isEditing: false },      // Superior izquierda
  ]);

  // Specific Ideas: 2 por cada categoría, posicionadas más lejos
  const [specificIdeas, setSpecificIdeas] = useState<Bubble[]>([
    // Cat 1 (Arriba)
    { id: 'idea1-1', text: 'Idea 1.1', x: 38, y: 7, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea1-2', text: 'Idea 1.2', x: 62, y: 7, size: 68, color: '#f3f4f6', isEditing: false },
    // Cat 2 (Superior derecha)
    { id: 'idea2-1', text: 'Idea 2.1', x: 88, y: 22, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea2-2', text: 'Idea 2.2', x: 93, y: 42, size: 68, color: '#f3f4f6', isEditing: false },
    // Cat 3 (Inferior derecha)
    { id: 'idea3-1', text: 'Idea 3.1', x: 93, y: 58, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea3-2', text: 'Idea 3.2', x: 88, y: 78, size: 68, color: '#f3f4f6', isEditing: false },
    // Cat 4 (Abajo)
    { id: 'idea4-1', text: 'Idea 4.1', x: 62, y: 93, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea4-2', text: 'Idea 4.2', x: 38, y: 93, size: 68, color: '#f3f4f6', isEditing: false },
    // Cat 5 (Inferior izquierda)
    { id: 'idea5-1', text: 'Idea 5.1', x: 12, y: 78, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea5-2', text: 'Idea 5.2', x: 7, y: 58, size: 68, color: '#f3f4f6', isEditing: false },
    // Cat 6 (Superior izquierda)
    { id: 'idea6-1', text: 'Idea 6.1', x: 7, y: 42, size: 68, color: '#f3f4f6', isEditing: false },
    { id: 'idea6-2', text: 'Idea 6.2', x: 12, y: 22, size: 68, color: '#f3f4f6', isEditing: false },
  ]);

  const [editingText, setEditingText] = useState('');

  const handleBubbleClick = (bubble: Bubble, type: 'core' | 'main' | 'specific') => {
    setEditingText(bubble.text);
    
    if (type === 'core') {
      setCoreElement({ ...coreElement, isEditing: true });
    } else if (type === 'main') {
      setMainCategories(mainCategories.map(cat => 
        cat.id === bubble.id ? { ...cat, isEditing: true } : { ...cat, isEditing: false }
      ));
    } else {
      setSpecificIdeas(specificIdeas.map(idea => 
        idea.id === bubble.id ? { ...idea, isEditing: true } : { ...idea, isEditing: false }
      ));
    }
  };

  const handleSaveEdit = (bubble: Bubble, type: 'core' | 'main' | 'specific') => {
    if (type === 'core') {
      setCoreElement({ ...coreElement, text: editingText, isEditing: false });
    } else if (type === 'main') {
      setMainCategories(mainCategories.map(cat => 
        cat.id === bubble.id ? { ...cat, text: editingText, isEditing: false } : cat
      ));
    } else {
      setSpecificIdeas(specificIdeas.map(idea => 
        idea.id === bubble.id ? { ...idea, text: editingText, isEditing: false } : idea
      ));
    }
  };

  // Función para dibujar líneas conectoras
  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    
    // Conectar core con main categories
    mainCategories.forEach((cat, index) => {
      lines.push(
        <motion.line
          key={`core-cat-${index}`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          x1={`${coreElement.x}%`}
          y1={`${coreElement.y}%`}
          x2={`${cat.x}%`}
          y2={`${cat.y}%`}
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      );
    });

    // Conectar main categories con specific ideas
    const ideasPerCategory = 2;
    specificIdeas.forEach((idea, index) => {
      const categoryIndex = Math.floor(index / ideasPerCategory);
      const category = mainCategories[categoryIndex];
      
      if (category) {
        lines.push(
          <motion.line
            key={`cat-idea-${index}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
            x1={`${category.x}%`}
            y1={`${category.y}%`}
            x2={`${idea.x}%`}
            y2={`${idea.y}%`}
            stroke="#d1d5db"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        );
      }
    });

    return lines;
  };

  const renderBubble = (bubble: Bubble, type: 'core' | 'main' | 'specific', index: number) => {
    const isTextDark = bubble.color === '#f3f4f6';
    
    return (
      <motion.div
        key={bubble.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: type === 'core' ? 0 : (type === 'main' ? 0.3 + index * 0.1 : 0.8 + index * 0.05) }}
        style={{
          position: 'absolute',
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          transform: 'translate(-50%, -50%)',
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
        }}
        className="cursor-pointer group"
        onClick={() => handleBubbleClick(bubble, type)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div 
          className="w-full h-full rounded-full flex items-center justify-center shadow-lg relative overflow-visible"
          style={{ 
            backgroundColor: bubble.color,
            border: bubble.isEditing ? '4px solid #fbbf24' : 'none'
          }}
        >
          {bubble.isEditing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-20">
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="text-center mb-2 h-8 text-sm"
                style={{ fontSize: bubble.size > 100 ? '14px' : '12px' }}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit(bubble, type);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit(bubble, type);
                }}
                className="h-6 px-3 bg-green-500 hover:bg-green-600"
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <>
              <p 
                className={`text-center px-3 ${isTextDark ? 'text-gray-700' : 'text-white'}`}
                style={{ 
                  fontSize: bubble.size > 120 ? '16px' : bubble.size > 90 ? '13px' : '11px',
                  lineHeight: '1.2'
                }}
              >
                {bubble.text}
              </p>
              
              {/* Edit icon on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full flex items-center justify-center transition-all">
                <Edit2 className={`w-4 h-4 opacity-0 group-hover:opacity-70 ${isTextDark ? 'text-gray-700' : 'text-white'}`} />
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] p-4 flex flex-col relative overflow-hidden">
      {/* Animated decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl"
      />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-4 relative z-10"
      >
        <h1 className="text-white mb-2 drop-shadow-lg text-4xl">
          Bubble Map
        </h1>
        <p className="text-white/90 text-lg">
          Haz clic en cada burbuja para editar las ideas
        </p>
      </motion.div>

      {/* Bubble Map Container */}
      <div className="flex-1 relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden">
        {/* SVG for connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {renderConnections()}
        </svg>

        {/* Bubbles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {/* Core Element */}
          {renderBubble(coreElement, 'core', 0)}

          {/* Main Categories */}
          {mainCategories.map((cat, index) => renderBubble(cat, 'main', index))}

          {/* Specific Ideas */}
          {specificIdeas.map((idea, index) => renderBubble(idea, 'specific', index))}
        </div>
      </div>

      {/* Footer Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-4 relative z-10"
      >
        <Button 
          onClick={() => navigate('/tablet/resultados-etapa2')} 
          className="w-full h-16 bg-yellow-400 hover:bg-yellow-500 text-[#093c92] rounded-full text-xl shadow-xl"
        >
          Finalizar Bubble Map
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

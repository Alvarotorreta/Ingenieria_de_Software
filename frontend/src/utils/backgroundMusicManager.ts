// Singleton para gestionar la música de fondo globalmente
class BackgroundMusicManager {
  private static instance: BackgroundMusicManager;
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private volume: number = 0.3;
  private musicUrl: string = '/music/dimelo-ma.mp3';
  private storageKey: string = 'backgroundMusicEnabled';
  private hasUserInteracted: boolean = false;
  private listeners: Set<(isMuted: boolean, isPlaying: boolean) => void> = new Set();

  private constructor() {
    // Inicializar audio solo una vez
    this.initializeAudio();
    this.setupUserInteraction();
  }

  public static getInstance(): BackgroundMusicManager {
    if (!BackgroundMusicManager.instance) {
      BackgroundMusicManager.instance = new BackgroundMusicManager();
    }
    return BackgroundMusicManager.instance;
  }

  private initializeAudio() {
    if (this.audio) return;

    // Cargar preferencia desde localStorage
    const savedPreference = localStorage.getItem(this.storageKey);
    const shouldPlay = savedPreference === 'true';
    this.isMuted = !shouldPlay;

    // Crear elemento de audio
    const audio = new Audio(this.musicUrl);
    audio.loop = true;
    audio.volume = this.volume;
    audio.preload = 'auto';
    this.audio = audio;

    // Manejar eventos de audio
    audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });

    audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    audio.addEventListener('ended', () => {
      if (!this.isMuted) {
        audio.play().catch(() => {
          this.isMuted = true;
          this.notifyListeners();
        });
      }
    });

    // Si ya debería estar reproduciéndose y el usuario ya interactuó, reproducir
    if (shouldPlay && this.hasUserInteracted) {
      audio.play().catch(() => {
        console.log('No se pudo reproducir automáticamente');
      });
    }
  }

  private setupUserInteraction() {
    // Detectar interacción del usuario para poder reproducir
    const handleUserInteraction = () => {
      this.hasUserInteracted = true;
      const shouldPlay = localStorage.getItem(this.storageKey) === 'true';
      if (shouldPlay && this.audio) {
        this.audio.play().catch(() => {
          console.log('No se pudo reproducir automáticamente');
        });
      }
    };

    // Solo agregar listeners si aún no ha interactuado
    if (!this.hasUserInteracted) {
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
    }
  }

  public toggleMute() {
    this.hasUserInteracted = true;
    this.setMuted(!this.isMuted);
  }

  public setMuted(muted: boolean) {
    if (this.isMuted === muted) return;
    
    this.isMuted = muted;
    
    if (this.audio) {
      if (this.isMuted) {
        this.audio.pause();
        localStorage.setItem(this.storageKey, 'false');
      } else {
        if (this.hasUserInteracted) {
          this.audio.play().then(() => {
            localStorage.setItem(this.storageKey, 'true');
          }).catch((error) => {
            console.log('Error al reproducir:', error);
            this.isMuted = true;
          });
        }
      }
    }
    
    this.notifyListeners();
  }

  public getState() {
    return {
      isMuted: this.isMuted,
      isPlaying: this.isPlaying,
    };
  }

  public subscribe(callback: (isMuted: boolean, isPlaying: boolean) => void) {
    this.listeners.add(callback);
    // Notificar estado actual inmediatamente
    callback(this.isMuted, this.isPlaying);
    
    // Retornar función de desuscripción
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.isMuted, this.isPlaying);
    });
  }

  public configure(config: { musicUrl?: string; volume?: number; storageKey?: string }) {
    if (config.musicUrl && config.musicUrl !== this.musicUrl) {
      this.musicUrl = config.musicUrl;
      // Si el audio ya existe, cambiar la fuente
      if (this.audio) {
        const wasPlaying = this.isPlaying;
        this.audio.pause();
        this.audio.src = config.musicUrl;
        this.audio.load();
        if (wasPlaying && !this.isMuted) {
          this.audio.play().catch(() => {});
        }
      }
    }
    
    if (config.volume !== undefined && config.volume !== this.volume) {
      this.volume = config.volume;
      if (this.audio) {
        this.audio.volume = this.volume;
      }
    }
    
    if (config.storageKey && config.storageKey !== this.storageKey) {
      // Guardar estado actual en el storageKey anterior si estaba activo
      if (this.audio && this.isPlaying) {
        localStorage.setItem(this.storageKey, 'true');
      }
      
      this.storageKey = config.storageKey;
      // Cargar preferencia desde el nuevo storageKey
      const savedPreference = localStorage.getItem(this.storageKey);
      const shouldPlay = savedPreference === 'true';
      
      // Si el audio ya está inicializado, aplicar el nuevo estado
      if (this.audio) {
        if (shouldPlay && !this.isMuted) {
          // Ya debería estar reproduciéndose, no hacer nada
        } else if (shouldPlay && this.isMuted) {
          // Debería reproducirse pero está silenciado, activar
          this.setMuted(false);
        } else if (!shouldPlay && !this.isMuted) {
          // No debería reproducirse pero está activo, silenciar
          this.setMuted(true);
        }
      } else {
        // Si el audio aún no está inicializado, establecer el estado
        this.isMuted = !shouldPlay;
      }
      
      this.notifyListeners();
    }
  }
}

export const musicManager = BackgroundMusicManager.getInstance();


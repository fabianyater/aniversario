import { useEffect, useRef, useState } from 'react';
import './App.css';
import Heart from './components/Heart';
import audioFile from './resources/nudito.mp3';
import pause from './resources/pause.svg';
import play from './resources/playsvg.svg';

const photoArray = Array.from({ length: 158 }, (_, index) => require(`./resources/Photos/photo${index + 1}.jpg`));
const exitAnimationDuration = 500;

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hearts, setHearts] = useState();
  const audioRef = useRef(new Audio(audioFile));
  const [photosToShow, setPhotosToShow] = useState([]);
  const [photosToRemove, setPhotosToRemove] = useState([]);

  const generateHearts = () => {
    const initialHearts = [];
    const now = Date.now();
    for (let i = 0; i < 70; i++) {
      initialHearts.push({
        id: now + i,
        style: {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          opacity: Math.random(),
        },
      });
    }
    return initialHearts;
  }

  const updatePhotosToShow = () => {
    setPhotosToShow((prevPhotos) => {
      // Obtener las fotos actuales sin la primera foto (la más vieja)
      const activePhotos = prevPhotos.length >= 6 ? prevPhotos.slice(2) : prevPhotos.slice(1);

      // Agregar nueva foto
      const randomIndex = Math.floor(Math.random() * photoArray.length);
      const newPhoto = {
        id: Date.now() + randomIndex, // clave única usando la hora actual
        src: photoArray[randomIndex],
        style: {
          top: `${Math.random() * 41}vh`,
          left: `${Math.random() * 76}vw`,
          position: 'absolute',
          animation: 'fadeIn 5s',
        },
      };

      // Si ya hay 5 fotos, programar la eliminación de la primera foto
      if (activePhotos.length >= 4) {
        const photosToRemoveNow = activePhotos.slice(0, 2);
        setPhotosToRemove((prev) => [...prev, ...photosToRemoveNow]);
      }

      // Regresar las fotos activas con la nueva foto añadida
      return [...activePhotos, newPhoto];
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    const preloadImages = () => {
      const promises = photoArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      return Promise.all(promises);
    };

    preloadImages().then(() => {
      console.log('Todas las imágenes han sido precargadas');
      // Aquí puedes manejar el estado de la aplicación sabiendo que todas las imágenes están cargadas
    }).catch((error) => {
      console.error('Error al precargar imágenes', error);
    });

    const photoInterval = setInterval(() => {
      updatePhotosToShow();
    }, 20000);

    setHearts(generateHearts)

    return () => {
      audio.removeEventListener('ended', handleEnded);
      clearInterval(photoInterval)
    };
  }, []);

  useEffect(() => {
    if (photosToRemove.length < 2) return;

    const photosToRemoveNow = photosToRemove.slice(0, 2);
    const timeoutId = setTimeout(() => {
      setPhotosToRemove((prev) => prev.filter((p) => !photosToRemoveNow.find(pr => pr.id === p.id)));
      setPhotosToShow((prev) => prev.filter((p) => !photosToRemoveNow.find(pr => pr.id === p.id)));
    }, exitAnimationDuration);

    return () => clearTimeout(timeoutId);
  }, [photosToRemove]);

  return (
    <>
      <div id="numero" className="numero">5</div>
      <div className="mensaje">Feliz Aniversario</div>
      <div id="corazones">
        {hearts && hearts.map(heart => (
          <Heart
            key={heart.id}
            style={{
              left: heart.style.left,
              animationDuration: heart.style.animationDuration,
              opacity: heart.style.opacity,
              animation: `float ${heart.style.animationDuration}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
      {photosToShow.map((photo, index) => (
        <img
          loading='lazy'
          key={photo.id}
          src={photo.src}
          style={{
            ...photo.style,
            animation: photosToRemove.find(p => p.id === photo.id) ? `fadeOut ${exitAnimationDuration}ms` : photo.style.animation,
          }}
          alt={`Random ${index}`}
          className="random-photo"
        />
      ))}

      <button onClick={togglePlay} className="playButton" type='button'>
        <img src={isPlaying ? pause : play} alt="play song" width="32" height="32" className="play-icon" />
      </button>

      <audio loop>
        <source src="nudito.mp3" type="audio/mpeg" />
        Tu navegador no soporta audio HTML5.
      </audio>
    </>
  );
}

export default App;

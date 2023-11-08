function generarCorazon() {
  const corazon = document.createElement('div');
  corazon.classList.add('corazon');
  corazon.style.left = Math.random() * 100 + 'vw';
  corazon.style.animationDuration = Math.random() * 3 + 2 + 's';
  corazon.style.opacity = Math.random();
  document.body.appendChild(corazon);

  // Eliminar el corazón después de que termina su animación para no sobrecargar el DOM
  setTimeout(() => {
    corazon.remove();
  }, 5000); // Asegúrate de que esto coincida con la duración de la animación
}

// Generar corazones cada segundo
setInterval(generarCorazon, 100);

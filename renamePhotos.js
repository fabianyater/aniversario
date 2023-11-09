const fs = require('fs');
const path = require('path');

const photosDir = './app/src/resources/Photos';
const newPhotosDir = './app/src/resources/Photos/'; // Asegúrate de que este directorio exista en tu proyecto React

// Leer el directorio de fotos
fs.readdir(photosDir, (err, files) => {
  if (err) {
    return console.error('Error al leer el directorio:', err);
  }

  // Filtro para obtener sólo archivos de imagen
  files = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

  // Arreglo para guardar las rutas de las fotos
  const photoUrls = [];

  // Renombrar cada archivo
  files.forEach((file, index) => {
    const fileExtension = path.extname(file);
    const newFileName = `photo${index + 1}${fileExtension}`;
    const oldFilePath = path.join(photosDir, file);
    const newFilePath = path.join(newPhotosDir, newFileName);

    // Renombrar archivo
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        return console.error(`Error al renombrar ${file}:`, err);
      }

      // Agregar la ruta del archivo renombrado al arreglo de URLs
      photoUrls.push(newFilePath);

      // Si estamos en el último archivo, imprimir el arreglo
      if (index === files.length - 1) {
        console.log('Arreglo de URLs de las fotos:', photoUrls);
        // Aquí podrías escribir el arreglo en un archivo si así lo deseas
      }
    });
  });
});

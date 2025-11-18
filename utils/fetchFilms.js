require('dotenv').config(); //para cargar
const fetchFilm = async (title) => {
try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!title) throw new Error("Se requiere un título de película");
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`
    );
    const data = await response.json();
    if (data.Response === "False") {
      return null; // no se encontró
    }
    return data;
  }catch(error){
    console.error("Error al obtener detalles de la película:", error.message);
    return null;
  }
}

module.exports =  fetchFilm;


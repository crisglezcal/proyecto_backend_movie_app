require('dotenv').config(); //para cargar

//este es para película detalle
const fetchOneFilm = async (title) => {
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
    return [data];
  }catch(error){
    console.error("Error al obtener detalles de la película:", error.message);
    return null;
  }
}

//este es para todas las películas
const fetchAllFilms = async (title) => {
try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!title) throw new Error("Se requiere un título de película");
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`
    );
    const data = await response.json();
    if (data.Response === "False") {
      return []; // no se encontró
    }
    return data.Search;
  }catch(error){
    console.error("Error al obtener detalles de la película:", error.message);
    return null;
  }
}

//este es para peliculas favoritas
const fetchFilmById = async (id) => {
try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!id) throw new Error("Se requiere un id de película");
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
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

module.exports = {
fetchOneFilm,
fetchAllFilms,
fetchFilmById
} 


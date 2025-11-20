const mongoose = require("mongoose");
require('../config/db_mongo') // Conexión a BDD MongoDB
// Crear Objeto
const objectSchema = {
    Title: {
        type: String,
        required: true
    },
    Year: {
        type: Number,
        required: true
    },
    Rated: {
        type: String,
        required: true
    },
    Released: {
        type: String,
        required: true
    },
    Runtime: {
        type: String,
        required: true
    },
    Genre: {
        type: String,
        required: true
    },
    Director: {
        type: String,
        required: true
    },
    Actors: {
        type: String,
        required: true
    },
    Plot: {
        type: String,
        required: true
    },
    Poster: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        required: true
    },
    Ratings: [
        {
            type: {
                type: String,
                required: true
            },
            Source: {
                type: String,
                required: true
            },
            Value: {
                type: String,
                required: true
            }
        }
    ],
    Opinions: [
        {
            type: String,
            message: String
        }
    ]
}
// Crear Esquema
const filmsSchema = mongoose.Schema(objectSchema);
// Crear Colección y el tener el modelo que tengo que importar al resto de archivos donde interactue con mi BD de Mongo
const Film = mongoose.model("Films", filmsSchema);

/* 
const film1 = new Film({
  Title: "Guardians of the Galaxy Vol. 2",
  Year: 2017,
  Rated: "PG-13",
  Released: "05 May 2017",
  Runtime: "136 min",
  Genre: "Action, Adventure, Comedy",
  Director: "James Gunn",
  Actors: "Chris Pratt, Zoe Saldaña, Dave Bautista",
  Plot: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.",
  Poster: "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
  imdbID: "tt3896198",
  Ratings: [
    {
      type: "imdb",
      Source: "Internet Movie Database",
      Value: "7.6/10"
    },
    {
      type: "rotten",
      Source: "Rotten Tomatoes",
      Value: "85%"
    },
    {
      type: "metacritic",
      Source: "Metacritic",
      Value: "67/100"
    }
  ],
  Opinions: [] // vacío inicialmente
});
film1.save()
.then((data) => console.log(data))
.catch(error => console.log(error))
*/
/* film1.save()
.then((data) => console.log(data))
.catch(error => console.log(error)) */

module.exports = Film;
const mongoose = require("mongoose");

// Crear Objeto
const objectSchema = {
    id_film: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    sinopsis: {
        type: String,
        required: true,
    },
    actors: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    opinions: {
        opinionSensacine: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sensacine",
                required: true
            }
        ],
        opinionFilmafinitty: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FilmaFinitty",
                required: true
            }
        ]
    }
}

// Crear Esquema
const filmsSchema = mongoose.Schema(objectSchema);

// Crear Colección
const Film = mongoose.model("Films", filmsSchema);

// Documento de prueba
const film1 = new Film({
    id_film: 1,
    title: "Película Prueba 1",
    image: "https://img.freepik.com/fotos-premium/palomitas-maiz-voladoras-gafas-3d-carrete-pelicula-tablilla-sobre-fondo-amarillo-concepto-pelicula-cine-3d_989822-1302.jpg?semt=ais_hybrid&w=740&q=80",
    year: 2025,
    director: "Inventado 1",
    gender: "Masculino",
    duration: "120 min",
    sinopsis: "Sinopsis de prueba",
    actors: "Actor 1, Actor 2",
    rating: "PG-16",
    opinions: {
        opinionSensacine: [
            "6760d94f02c44b3c49ea3711",
            "6760d94f02c44b3c49ea3712"
        ],
        opinionFilmafinitty: [
            "6760d95e02c44b3c49ea3713",
            "6760d95e02c44b3c49ea3714"
        ]
    }
});

film1.save()
.then((data) => console.log(data))
.catch(error => console.log(error))

module.exports = Film;
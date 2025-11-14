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
    opinionSensacine: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Sensacine",
        required: true,
    },
    opinionFilmafinitty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Filmafinitty",
        required: true,
    }

}

// Crear Esquema
const filmsSchema = mongoose.Schema(objectSchema);

// Crear Colección
const Films = mongoose.model("Films", filmsSchema);

module.exports = Films;
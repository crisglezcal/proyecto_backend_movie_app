/* Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
	name VARCHAR(24) NOT NULL,
	surname VARCHAR(24) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'user')) NOT NULL DEFAULT 'user');

Crear tabla de películas favoritas
CREATE TABLE favorite_films (
    id_fav SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    film_id VARCHAR(50) NOT NULL,  -- ID de Mongo (ObjectId se guarda como texto)

    CONSTRAINT fk_user
        FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE (asegura que si un usuario se borra, también se eliminan sus favoritos.)
);

-- Insertar un usuario
INSERT INTO users (name, surname, email, password, role)
VALUES ('carlos', 'gomez', 'admin@example.com', '123abc', 'admin');

-- Insertar una película favorita para ese usuario
INSERT INTO favorite_films (id_user, film_id)
VALUES (1, '507f1f77bcf86cd799439011');

-- Añadir logado a la tabla users
ALTER TABLE users
ADD COLUMN logado BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN auth_method VARCHAR(20) DEFAULT 'google';
    */
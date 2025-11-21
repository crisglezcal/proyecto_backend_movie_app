# Aplicación Web de Búsqueda y Gestión de Películas

Este proyecto es una aplicación web completa que permite buscar, gestionar y administrar películas. Incluye funcionalidades para usuarios finales y administradores, así como autenticación mediante Google.

## 🚀 Tecnologías utilizadas

A continuación se listan las tecnologías empleadas en el desarrollo, basadas en las dependencias del proyecto:

### **Backend**

* **Node.js** – Plataforma de ejecución del servidor.
* **Express** – Framework para la creación de rutas y controladores.
* **Express-session** – Manejo de sesiones.
* **Cookie-parser** – Gestión de cookies.

### **Autenticación y Seguridad**

* **bcryptjs** – Encriptación de contraseñas.
* **jsonwebtoken (JWT)** – Autenticación basada en tokens.
* **passport** – Middleware de autenticación.
* **passport-google-oauth20** – Inicio de sesión mediante Google OAuth.

### **Bases de Datos**

* **mongoose** – ORM para MongoDB.
* **pg** – Cliente para PostgreSQL.

### **Vistas / Frontend**

* **Pug** – Motor de plantillas HTML.

### **Documentación**

* **swagger-jsdoc** – Generación de documentación a partir de comentarios JSDoc.
* **swagger-ui-express** – Interfaz gráfica para visualizar la documentación.

### **Utilidades**

* **dotenv** – Manejo de variables de entorno.
* **cowsay** – Utilidad de consola.

### **Testing y Desarrollo**

* **jest** – Framework de testing.
* **supertest** – Testing de endpoints.
* **nodemon** – Recarga automática en desarrollo.
* **jsdoc** – Documentación del código.
* **morgan** – Logger HTTP.

---

## 🎬 Funcionalidades de la Aplicación Web

La aplicación incluye un conjunto de funcionalidades orientadas al usuario y al administrador.

### 🔍 **Búsqueda de Películas**

El usuario puede buscar películas mediante un buscador integrado que consume la base de datos propia o una API externa.

### ⭐ **Gestión de Favoritos**

Los usuarios pueden marcar películas como favoritas y visualizarlas en una sección dedicada.

### 🔑 **Login con Google**

Autenticación mediante Google OAuth usando Passport.

### 🛠️ **Panel de Administración de Películas**

Accesible solo para administradores.
Incluye:

* Crear películas
* Editar películas
* Eliminar películas

### 👤 **Perfil de Usuario**

Cada usuario dispone de un perfil donde puede:

* Editar sus datos personales
* Actualizar información relevante

---

## 📁 Estructura del Proyecto

*(Agregar si lo necesitas)*

## ▶️ Cómo ejecutar el proyecto

*(Agregar instrucciones si lo deseas)*

---

Si quieres, puedo añadir imágenes, instrucciones de instalación, diagramas o mejorar el tono del README.

// Cuando se hace click en el botón de búsqueda
document.getElementById("searchButton").addEventListener("click", async () => {
    const title = document.getElementById("movieName").value.trim();

    if (!title) {
        document.getElementById("result").innerHTML = "<p>Escribe el nombre de una película</p>";
        return;
    }

    try {
        const res = await fetch(`/search/${encodeURIComponent(title)}`);
        const data = await res.json();

        // Si es un objeto (MongoDB) lo convertimos en array para unificar
        const movies = Array.isArray(data) ? data : [data];

        // Generar HTML de todas las películas
        const html = movies.map(movie => `
            <article class="movie-card">
                <h2>${movie.Title}</h2>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "/img/default.png"}" alt="${movie.Title}" class="img_logo">
                <p><strong>Año:</strong> ${movie.Year || "Desconocido"}</p>
                <p><strong>Director:</strong> ${movie.Director || "Desconocido"}</p>
                <p><strong>Género:</strong> ${movie.Genre || "Desconocido"}</p>
                <p><strong>Duración:</strong> ${movie.Runtime || "Desconocido"}</p>
            </article>
        `).join("");

        document.getElementById("result").innerHTML = html;

    } catch (error) {
        console.error("Error al buscar películas:", error);
        document.getElementById("result").innerHTML = "<p>Ocurrió un error al buscar películas</p>";
    }
});


/*
// Cuando se envía el formulario de producto
document.getElementById("productForm").addEventListener("submit",(event) => {
    event.preventDefault(); // Evitamos que se recargue la página

    // Obtenemos todos los valores del formulario
    const id = event.target.id.value;
    const title = event.target.title.value;
    const price = event.target.price.value;
    const description = event.target.description.value;
    const image = event.target.image.value;
    const companyName = event.target.companyName.value;

    console.log(id,title,price,description,image,companyName);

    // Creamos objeto con los datos del producto
    const movieData= {
        id,
        title,
        price,
        description,
        image,
        companyName
    };

    // Enviamos petición POST para crear el producto
    fetch('/api/movies',{
            method:"POST", // Método POST para crear
            body:JSON.stringify(movieData), // Convertimos objeto a JSON
            headers:{
                "Content-Type":"application/json" // Indicamos que enviamos JSON
            }
        })
            .then(res=>res.json()) // Convertimos respuesta a JSON
            .then(data=>{
                console.log(data);
                alert("Pelicula creada con éxito");
                // Recargamos la página para ver el nuevo producto
                window.location.reload();
            })
})*/
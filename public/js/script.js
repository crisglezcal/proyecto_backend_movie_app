// console.log("hola desde VanillaJS. Aquí va tu código para manipular el DOM de la web y para hacer llamadas a API");

// // Cuando se hace click en el botón de búsqueda
// document.getElementById("searchButton").addEventListener("click", async e => {
//     const title = document.getElementById("productName").value; // Obtenemos el título del input
//     alert(title); // Mostramos alerta con el título
    
//     try{
//         // Hacemos petición a nuestra propia API
//         const res = await fetch(`/api/books/${title}`);
//         const data = await res.json(); // Convertimos respuesta a JSON
//         alert(data);
//         console.log(data);
//         // Mostramos el resultado en la página
//         document.getElementById("result").innerHTML = JSON.stringify(data);
//     }
//     catch(error){
//         console.log(error); // Si hay error, lo mostramos
//     }
// })

// // Cuando se envía el formulario de producto
// document.getElementById("productForm").addEventListener("submit",(event) => {
//     event.preventDefault(); // Evitamos que se recargue la página

//     // Obtenemos todos los valores del formulario
//     const id = event.target.id.value;
//     const title = event.target.title.value;
//     const price = event.target.price.value;
//     const description = event.target.description.value;
//     const image = event.target.image.value;
//     const companyName = event.target.companyName.value;

//     console.log(id,title,price,description,image,companyName);

//     // Creamos objeto con los datos del producto
//     const productData = {
//         id,
//         title,
//         price,
//         description,
//         image,
//         companyName
//     };

//     // Enviamos petición POST para crear el producto
//     fetch('/api/products',{
//             method:"POST", // Método POST para crear
//             body:JSON.stringify(productData), // Convertimos objeto a JSON
//             headers:{
//                 "Content-Type":"application/json" // Indicamos que enviamos JSON
//             }
//         })
//             .then(res=>res.json()) // Convertimos respuesta a JSON
//             .then(data=>{
//                 console.log(data);
//                 alert("Producto creado con éxito");
//                 // Recargamos la página para ver el nuevo producto
//                 window.location.reload();
//             })
// })
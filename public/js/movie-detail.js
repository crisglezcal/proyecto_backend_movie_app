// Seleccionar botón de añadir a favoritos
const favButton = document.querySelector(".add-fav");

if (favButton) {
  favButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const form = favButton.closest("form");
    
    fetch(form.action, {
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {
      alert("Película añadida a favoritos");
    })
    .catch(err => {
      console.error(err);
      alert("Error al añadir a favoritos");
    });
  });
}

const titulo = document.getElementById("titulo")
const texto = document.getElementById("contenido")
const imagen = document.getElementById("imagen")

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function cargarLibro(){

const res = await fetch("/contenido")
const data = await res.json()

const libro = data.find(p => p.id == id)

if(!libro) return

titulo.textContent = libro.nombre
texto.textContent = libro.contenido
imagen.src = libro.imagen

}

cargarLibro()
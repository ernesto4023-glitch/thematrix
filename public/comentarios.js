const btnComentarios = document.getElementById("btnComentarios")
const modal = document.getElementById("modalComentarios")
const cerrar = document.getElementById("cerrarModal")

const lista = document.getElementById("listaComentarios")

const form = document.getElementById("formComentario")

const nombre = document.getElementById("nombreComentario")
const textoComentario = document.getElementById("textoComentario")

const urlParams = new URLSearchParams(window.location.search)
const libroId = urlParams.get("id")

btnComentarios.onclick = () => {

modal.style.display="flex"
cargarComentarios()

}

cerrar.onclick = () => {

modal.style.display="none"

}

async function cargarComentarios(){

const res = await fetch("/comentarios/"+libroId)
const data = await res.json()

lista.innerHTML=""

data.forEach(c=>{

const div = document.createElement("div")

div.classList.add("comentario")

div.innerHTML=`

<strong>${c.nombre}</strong>
<p>${c.texto}</p>

`

lista.appendChild(div)

})

}

form.addEventListener("submit", async e=>{

e.preventDefault()

await fetch("/agregar-comentario",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

libroId,
nombre:nombre.value,
texto:textoComentario.value

})

})

form.reset()

cargarComentarios()

})
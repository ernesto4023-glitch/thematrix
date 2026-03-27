const contenedor = document.getElementById("listaCategorias")
const btnCategoria = document.getElementById("btnCategoria")

const formPost = document.getElementById("formPost")
const categoriaInput = document.getElementById("categoriaInput")

/* ========================= */
/* NAVEGACION SECCIONES */
/* ========================= */

const botones = document.querySelectorAll(".admin-menu button")
const secciones = document.querySelectorAll(".seccion")

botones.forEach(btn=>{

btn.onclick = ()=>{

secciones.forEach(sec=>sec.classList.remove("activa"))

const id = btn.dataset.seccion

document.getElementById(id).classList.add("activa")

// ✅ AQUI ESTA LA CLAVE
if(id === "comentarios"){
cargarComentariosAdmin()
}

}

})

/* ========================= */
/* CARGAR CATEGORIAS */
/* ========================= */

async function cargarCategorias(){

const res = await fetch("/categorias")
const data = await res.json()

contenedor.innerHTML=""

data.forEach(cat=>{

const div = document.createElement("div")
div.classList.add("categoria")

div.dataset.id = cat.id

div.innerHTML=`

<h2>${cat.nombre}</h2>

<button class="btns" data-id="${cat.id}">Agregar contenido</button>

`

div.querySelector("button").onclick = ()=>{

categoriaInput.value = cat.id

// cambiar a sección contenido
document.querySelectorAll(".seccion").forEach(sec=>sec.classList.remove("activa"))
document.getElementById("contenido").classList.add("activa")

}

contenedor.appendChild(div)

})

cargarPosts()

}

cargarCategorias()

/* ========================= */
/* CREAR CATEGORIA */
/* ========================= */

btnCategoria.onclick = async ()=>{

const nombre = prompt("Nombre categoria")

if(!nombre) return

await fetch("/crear-categoria",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({nombre})

})

cargarCategorias()

}

/* ========================= */
/* GUARDAR POST */
/* ========================= */

formPost.addEventListener("submit",async e=>{

e.preventDefault()

const formData = new FormData(formPost)

await fetch("/crear-post",{

method:"POST",
body:formData

})

formPost.reset()

alert("Contenido agregado")

cargarPosts()

})

/* ========================= */
/* CARGAR POSTS */
/* ========================= */

async function cargarPosts(){

const res = await fetch("/contenido")
const posts = await res.json()

const categorias = document.querySelectorAll(".categoria")

categorias.forEach(cat =>{

const idCategoria = cat.dataset.id

const contenedorPosts = document.createElement("div")
contenedorPosts.classList.add("admin-posts")

posts
.filter(post => post.categoria == idCategoria)
.forEach(post =>{

const card = document.createElement("div")
card.classList.add("admin-card")

card.innerHTML = `

<img src="${post.imagen}">

<h4>${post.nombre}</h4>

<p>${post.descripcion.substring(0,80)}...</p>

<div class="admin-actions">

<button onclick="editarPost(${post.id})">Editar</button>

<button onclick="eliminarPost(${post.id})">Eliminar</button>

</div>

`

contenedorPosts.appendChild(card)

})

cat.appendChild(contenedorPosts)

})

}

/* ========================= */
/* ELIMINAR */
/* ========================= */

async function eliminarPost(id){

if(!confirm("Eliminar contenido?")) return

await fetch("/eliminar-post/"+id,{
method:"DELETE"
})

location.reload()

}

/* ========================= */
/* EDITAR */
/* ========================= */

async function editarPost(id){

const nombre = prompt("Nuevo titulo")
const descripcion = prompt("Nueva descripcion")

if(!nombre || !descripcion) return

await fetch("/editar-post/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nombre,
descripcion
})

})

alert("Contenido actualizado")

location.reload()

}

/* ========================= */
/* CARGAR COMENTARIOS ADMIN */
/* ========================= */

async function cargarComentariosAdmin(){

const contenedor = document.getElementById("listaComentariosAdmin")

const resLibros = await fetch("/contenido")
const libros = await resLibros.json()

const resComentarios = await fetch("/comentarios-todos")
const comentarios = await resComentarios.json()

contenedor.innerHTML=""

libros.forEach(libro=>{

const comentariosLibro = comentarios.filter(c=>c.libroId == libro.id)

if(comentariosLibro.length === 0) return

const div = document.createElement("div")
div.classList.add("admin-card")

div.innerHTML = `

<img src="${libro.imagen}">

<h3>${libro.nombre}</h3>

<p>💬 ${comentariosLibro.length} comentarios</p>

<button onclick="verComentarios(${libro.id})">Ver comentarios</button>

`

contenedor.appendChild(div)

})


}

async function verComentarios(id){

const res = await fetch("/comentarios/"+id)
const data = await res.json()

let texto = ""

data.forEach(c=>{
texto += `\n${c.nombre}: ${c.texto}\n`
})

alert(texto || "Sin comentarios")

}

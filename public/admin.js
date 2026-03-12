const contenedor = document.getElementById("categorias")
const btnCategoria = document.getElementById("btnCategoria")

const modal = document.getElementById("modal")
const formPost = document.getElementById("formPost")

const categoriaInput = document.getElementById("categoriaInput")

/* cargar categorias */

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

<button data-id="${cat.id}">Agregar contenido</button>

`

div.querySelector("button").onclick = ()=>{

categoriaInput.value = cat.id

modal.style.display="block"

}

contenedor.appendChild(div)


div.dataset.id = cat.id

})

cargarPosts()

}

cargarCategorias()

/* crear categoria */

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

/* guardar post */

formPost.addEventListener("submit",async e=>{

e.preventDefault()

const formData = new FormData(formPost)

await fetch("/crear-post",{

method:"POST",
body:formData

})

modal.style.display="none"

formPost.reset()

alert("Contenido agregado")

})

async function cargarPosts(){

const res = await fetch("/contenido")

const posts = await res.json()

const categorias = document.querySelectorAll(".categoria")

categorias.forEach(cat =>{

const idCategoria = cat.dataset.id

const contenedor = document.createElement("div")

contenedor.classList.add("posts")

posts
.filter(post => post.categoria == idCategoria)
.forEach(post =>{

const card = document.createElement("div")

card.classList.add("tarjetas")

card.innerHTML = `
<img src="${post.imagen}">
<h3>${post.nombre}</h3>
<p>${post.descripcion}</p>
`

contenedor.appendChild(card)

})

cat.appendChild(contenedor)

})

}
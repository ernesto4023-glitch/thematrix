const contenedor = document.getElementById("temas")

async function cargarTemas(){

const resCat = await fetch("/categorias")
const categorias = await resCat.json()

const resPost = await fetch("/contenido")
const posts = await resPost.json()

contenedor.innerHTML = ""

categorias.forEach(categoria => {

const section = document.createElement("section")

section.classList.add("section")

section.innerHTML = `

<h2>${categoria.nombre}</h2>

<div class="cards" id="cat-${categoria.id}"></div>

`

contenedor.appendChild(section)

const contCards = section.querySelector(".cards")

posts
.filter(post => post.categoria == categoria.id)
.forEach(post => {

const card = document.createElement("div")

card.classList.add("card")

card.innerHTML = `

<a href="libro.html?id=${post.id}">

<img src="${post.imagen}" 
style="
width:100%;
height:320px;
object-fit:cover;
border-radius:8px;
margin-bottom:10px;">

<h3>${post.nombre}</h3>

<p>${post.descripcion}</p>

</a>

`

contCards.appendChild(card)

})

})

}

cargarTemas()


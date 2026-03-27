const express = require("express")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const app = express()

// =====================
// MIDDLEWARES
// =====================

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// =====================
// CREAR ARCHIVOS/CARPETAS SI NO EXISTEN
// =====================

// carpeta uploads
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

// contenido.json
if (!fs.existsSync("contenido.json")) {
  fs.writeFileSync("contenido.json", "[]")
}

// categorias.json
if (!fs.existsSync("categorias.json")) {
  fs.writeFileSync("categorias.json", "[]")
}


// =====================
// CONFIGURACIÓN MULTER
// =====================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    const nombre = Date.now() + path.extname(file.originalname)
    cb(null, nombre)
  }
})

const upload = multer({ storage })


// =====================
// SUBIR CONTENIDO
// =====================

app.post("/subir", upload.single("imagen"), (req, res) => {

  try {

    const { nombre, descripcion, categoria } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "No se subió imagen" })
    }

    const nuevaData = {
      id: Date.now(),
      nombre,
      descripcion,
      categoria, // guarda la categoría
      imagen: "uploads/" + req.file.filename
    }

    const data = fs.readFileSync("contenido.json", "utf8")
    const contenido = JSON.parse(data)

    contenido.push(nuevaData)

    fs.writeFileSync("contenido.json", JSON.stringify(contenido, null, 2))

    res.json({ mensaje: "Contenido guardado correctamente" })

  } catch (error) {

    console.log("ERROR:", error)
    res.status(500).json({ error: "Error interno del servidor" })

  }

})


// =====================
// CREAR CATEGORÍA
// =====================

app.post("/crear-categoria", (req, res) => {

  try {

    const { nombre } = req.body

    const data = fs.readFileSync("categorias.json", "utf8")
    const categorias = JSON.parse(data)

    const nueva = {
      id: Date.now(),
      nombre
    }

    categorias.push(nueva)

    fs.writeFileSync("categorias.json", JSON.stringify(categorias, null, 2))

    res.json(nueva)

  } catch (error) {

    console.log("ERROR:", error)
    res.status(500).json({ error: "Error al crear categoría" })

  }

})

// =====================
// CREAR POST
// =====================

app.post("/crear-post", upload.single("imagen"), (req, res) => {

  try {

    const { nombre, descripcion, contenido, categoria } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "No se subió imagen" })
    }

    const data = fs.readFileSync("contenido.json", "utf8")
    const posts = JSON.parse(data)

    const nuevoPost = {
      id: Date.now(),
      nombre,
      descripcion,
      contenido,
      categoria,
      imagen: "uploads/" + req.file.filename
    }

    posts.push(nuevoPost)

    fs.writeFileSync("contenido.json", JSON.stringify(posts, null, 2))

    res.json({ mensaje: "Post creado correctamente" })

  } catch (error) {

    console.log("ERROR:", error)
    res.status(500).json({ error: "Error creando post" })

  }

})

// =====================
// OBTENER CATEGORÍAS
// =====================

app.get("/categorias", (req, res) => {

  try {

    const data = fs.readFileSync("categorias.json", "utf8")
    const categorias = JSON.parse(data)

    res.json(categorias)

  } catch (error) {

    res.json([])

  }

})


// =====================
// OBTENER CONTENIDO
// =====================

app.get("/contenido", (req, res) => {

  try {

    const data = fs.readFileSync("contenido.json", "utf8")
    const contenido = JSON.parse(data)

    res.json(contenido)

  } catch (error) {

    res.json([])

  }

})

app.delete("/eliminar-post/:id",(req,res)=>{

const id = Number(req.params.id)

const data = JSON.parse(fs.readFileSync("contenido.json"))

const nuevo = data.filter(p => p.id != id)

fs.writeFileSync("contenido.json",JSON.stringify(nuevo,null,2))

res.json({mensaje:"eliminado"})

})

app.put("/editar-post/:id",(req,res)=>{

const id = Number(req.params.id)
const {nombre, descripcion} = req.body

const data = JSON.parse(fs.readFileSync("contenido.json"))

const post = data.find(p => p.id == id)

if(post){

post.nombre = nombre
post.descripcion = descripcion

}

fs.writeFileSync("contenido.json",JSON.stringify(data,null,2))

res.json({mensaje:"actualizado"})

})

// comentarios.json

if (!fs.existsSync("comentarios.json")) {
  fs.writeFileSync("comentarios.json", "[]")
}

/* SERVER COMENTARIOS*/

app.post("/agregar-comentario",(req,res)=>{

const {libroId,nombre,texto} = req.body

const data = JSON.parse(fs.readFileSync("comentarios.json"))

data.push({

id:Date.now(),
libroId,
nombre,
texto

})

fs.writeFileSync("comentarios.json",JSON.stringify(data,null,2))

res.json({mensaje:"comentario guardado"})

})

/*OBTENER COMENTARIOS */

app.get("/comentarios/:id",(req,res)=>{

const id = req.params.id

const data = JSON.parse(fs.readFileSync("comentarios.json"))

const comentarios = data.filter(c=>c.libroId == id)

res.json(comentarios)

})

/* OBTENER TODOS LOS COMENTARIOS */

app.get("/comentarios-todos",(req,res)=>{

try{

const data = fs.readFileSync("comentarios.json","utf8")
const comentarios = JSON.parse(data)

res.json(comentarios)

}catch(error){

res.json([])

}

})


// =====================
// INICIAR SERVIDOR
// =====================

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000")
})
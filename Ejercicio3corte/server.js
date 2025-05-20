import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import SqlConnection from './sql/connection.js';
import FirestoreService from './nosql/firestore_service.js';
import { Console } from 'console';

//CONFIGURACION FIREBASE




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


console.log("Directorio actual:", __dirname); // Agrega esta línea para depurar


const app = express();
const port = 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /upload — subir imagen y guardar nombre en Firestore
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    await imagesService.PostDocument(req.file.filename, {
      filename: req.file.filename,
      uploadedAt: new Date().toISOString()
    });
    res.send(`Image uploaded: ${req.file.filename}`);
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).send('Error saving image info.');
  }
});

// POST /register — insertar empleado en base de datos SQL
app.post('/register', async (req, res) => {
  console.log("Datos recibidos:", req.body); // Agrega esta línea para depurar

  const { idEmployers, address, name, number, idbranch, password } = req.body;

  if (!idEmployers || !address || !name || !number || !idbranch || !password) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

  const db = new SqlConnection();

  try {
    await db.connectToDb();
    await db.query(
      "INSERT INTO employers (idEmployers, address, name, number, idbranch, password) VALUES (?, ?, ?, ?, ?, ?)",
      [idEmployers, address, name, number, idbranch, password]
    );
    res.status(200).send("Usuario registrado exitosamente.");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error al registrar el usuario.");
  } finally {
    await db.closeConnection();
  }
});

// GET /user/:username — consultar usuario en base de datos SQL
app.get('/user/:username', async (req, res) => {
  const db = new SqlConnection();
  try {
    await db.connectToDb();
    const result = await db.query(
      "SELECT * FROM user WHERE iduser = ?",
      [req.params.username]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving user.");
  }
});


app.get('/deudores', async (req, res) => {


    console.log("ENTRANDO A DEUDORES");

    
    res.sendFile(path.join(__dirname, 'deudores.html'));


});

// POST /login — verificar credenciales del usuario
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const db = new SqlConnection();

  try {
    await db.connectToDb();

    
    const result = await db.query(
      "SELECT * FROM employers WHERE name = ? AND password = ?",
      [name, password]
    );
    await db.closeConnection();

    if (result.length === 0) {
      console.log("Usuario no encontrado o contraseña incorrecta");
      res.status(404).send("El usuario no existe o la contraseña es incorrecta.");
    } else {

      res.status(200).send("Usuario autenticado exitosamente.");

    
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error al verificar el usuario.");
  }
});



//perfil

app.post('/perfil', upload.single('image'), async (req, res) => {
  console.log("Datos recibidos:", req.body); // Form fields: nombre, apellido, edad
  console.log("Archivo recibido:", req.file);

  const employers = new FirestoreService("employers");

  console.log("Firestore documents", await employers.getAllDocuments()); // Agrega esta línea para depurar

  let randomId = Math.floor(Math.random() * 1000000);

  employers.PostDocument(randomId, {
    filename: req.body.image,
    age: req.body.edad,
    name: req.body.nombre,
    surname: req.body.apellido
  });

  res.send({'Message': 'Success'});
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// GET /perfiles — obtener todos los perfiles de Firestore
app.get('/perfiles', async (req, res) => {
  const employers = new FirestoreService("employers");
  const data = await employers.getAllDocuments();

  if (data.length === 0) {
    res.status(404).send("No hay perfiles registrados.");
  } else {
    res.status(200).json(data);
  }
});

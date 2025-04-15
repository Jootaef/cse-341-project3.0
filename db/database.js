const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

const dbName = 'project3';

const initDb = async (callback) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    return callback('❌ MONGO_URI is missing in .env');
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB: ${dbName}`);
    callback();
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    callback(err);
  }
};

// Esta función devuelve la base de datos
const getDatabase = () => {
  if (!db) {
    throw new Error('❌ Database not initialized. Call initDb first.');
  }
  return db;
};

// Esta función se usa para cerrar la conexión cuando sea necesario
const closeDbConnection = async () => {
  if (db) {
    await db.client.close();
    console.log('✅ MongoDB connection closed');
  }
};

// Función adicional para crear el índice único para el campo 'email'
const createEmailIndex = async () => {
  try {
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Index on email created');
  } catch (err) {
    console.error('❌ Error creating index:', err);
  }
};

module.exports = {
  initDb,
  getDatabase,
  closeDbConnection,
  createEmailIndex, // Puedes llamar esta función para crear el índice
};

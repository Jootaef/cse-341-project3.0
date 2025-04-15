const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

const dbName = 'project2';

const initDb = async (callback) => {
  const uri = process.env.MONGO_URI;

  // Verificar si la variable de entorno está definida
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

const getDatabase = () => {
  if (!db) {
    throw new Error('❌ Database not initialized. Call initDb first.');
  }
  return db;
};

// Cerrar la conexión cuando el proceso termine
const closeDbConnection = async () => {
  if (db) {
    await db.client.close();
    console.log('✅ MongoDB connection closed');
  }
};

module.exports = {
  initDb,
  getDatabase,
  closeDbConnection
};

const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Store database connections
const dbConnections = {};
// Store database configurations
const dbConfigs = [];

/**
 * Initialize database service
 */
const init = () => {
  try {
    // Load databases from configuration file
    const configPath = path.join(__dirname, '../../config/databases.json');
    
    if (fs.existsSync(configPath)) {
      const databases = JSON.parse(fs.readFileSync(configPath));
      databases.forEach(db => {
        dbConfigs.push(db);
      });
      console.log(`Loaded ${dbConfigs.length} database configurations`);
    }

    // Always ensure sample database exists and is properly initialized
    createSampleDatabase();
  } catch (error) {
    console.error('Error initializing database service:', error);
  }
};

/**
 * Create sample SQLite database for testing
 */
const createSampleDatabase = () => {
  try {
    const dbDir = path.join(__dirname, '../../data');
    const dbPath = path.join(dbDir, 'sample.db');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Remove existing database file if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Removed existing database file');
    }
    
    // Create sample database
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error creating database:', err);
        throw err;
      }
      console.log('Created new SQLite database file');
    });

    // Create tables and insert data
    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Create tables
      db.run(`CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0
      )`);
      
      db.run(`CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (customer_id) REFERENCES customers (id)
      )`);
      
      db.run(`CREATE TABLE order_items (
        id INTEGER PRIMARY KEY,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`);

      // Insert sample data using parameterized queries
      const insertCustomers = db.prepare('INSERT INTO customers (id, name, email) VALUES (?, ?, ?)');
      [
        [1, 'John Doe', 'john@example.com'],
        [2, 'Jane Smith', 'jane@example.com'],
        [3, 'Bob Johnson', 'bob@example.com']
      ].forEach(customer => insertCustomers.run(customer));
      insertCustomers.finalize();

      const insertProducts = db.prepare('INSERT INTO products (id, name, description, price, stock) VALUES (?, ?, ?, ?, ?)');
      [
        [1, 'Laptop', 'High-performance laptop', 999.99, 10],
        [2, 'Smartphone', 'Latest smartphone model', 699.99, 20],
        [3, 'Headphones', 'Noise-canceling headphones', 149.99, 30],
        [4, 'Tablet', '10-inch tablet', 349.99, 15]
      ].forEach(product => insertProducts.run(product));
      insertProducts.finalize();

      const insertOrders = db.prepare('INSERT INTO orders (id, customer_id, total, status) VALUES (?, ?, ?, ?)');
      [
        [1, 1, 1149.98, 'completed'],
        [2, 2, 699.99, 'processing'],
        [3, 3, 499.97, 'pending'],
        [4, 1, 349.99, 'completed']
      ].forEach(order => insertOrders.run(order));
      insertOrders.finalize();

      const insertOrderItems = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      [
        [1, 1, 1, 999.99],
        [1, 3, 1, 149.99],
        [2, 2, 1, 699.99],
        [3, 3, 1, 149.99],
        [3, 4, 1, 349.98],
        [4, 4, 1, 349.99]
      ].forEach(item => insertOrderItems.run(item));
      insertOrderItems.finalize();
    });
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        throw err;
      }
      console.log('Database initialized successfully');
    });
    
    // Add sample database to configurations if not already present
    if (!dbConfigs.find(db => db.id === 'sample')) {
      dbConfigs.push({
        id: 'sample',
        name: 'Sample Database',
        type: 'sqlite',
        filename: 'data/sample.db'
      });
    }
    
    console.log('Created sample SQLite database for testing');
  } catch (error) {
    console.error('Error creating sample database:', error);
    throw error;
  }
};

/**
 * Get list of available databases
 */
const getDatabaseList = async () => {
  return dbConfigs.map(db => ({
    id: db.id,
    name: db.name,
    type: db.type
  }));
};

/**
 * Get connection to a database
 * @param {string} databaseId - Database ID
 */
const getConnection = async (databaseId) => {
  try {
    // Find database configuration
    const dbConfig = dbConfigs.find(db => db.id === databaseId);
    
    if (!dbConfig) {
      throw new Error(`Database with ID ${databaseId} not found`);
    }
    
    // For SQLite, create a new connection each time to avoid locking issues
    if (dbConfig.type === 'sqlite') {
      const dbPath = path.resolve(__dirname, '../../', dbConfig.filename);
      console.log('Opening SQLite database at:', dbPath);
      
      // Ensure the database file exists and is properly initialized
      if (!fs.existsSync(dbPath)) {
        console.log('Database file not found, creating sample database...');
        createSampleDatabase();
      }
      
      // Create new connection with proper error handling
      const connection = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          throw err;
        }
        console.log('Connected to SQLite database');
      });
      
      // Enable foreign keys for this connection
      connection.run('PRAGMA foreign_keys = ON');
      
      return connection;
    }
    
    // For other database types, reuse existing connection if available
    if (dbConnections[databaseId]) {
      return dbConnections[databaseId];
    }
    
    // Create new connection for other database types
    let connection;
    switch (dbConfig.type) {
      case 'postgres':
        connection = new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          user: dbConfig.user,
          password: dbConfig.password
        });
        break;
      default:
        throw new Error(`Database type ${dbConfig.type} not supported`);
    }
    
    // Store non-SQLite connections
    dbConnections[databaseId] = connection;
    return connection;
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
};

/**
 * Get database schema
 * @param {string} databaseId - Database ID
 */
const getDBSchema = async (databaseId) => {
  const dbConfig = dbConfigs.find(db => db.id === databaseId);
  
  if (!dbConfig) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }
  
  let schema = [];
  
  switch (dbConfig.type) {
    case 'postgres':
      const pgClient = await getConnection(databaseId);
      
      // Get tables
      const tablesResult = await pgClient.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      // Get columns for each table
      for (const table of tablesResult.rows) {
        const columnsResult = await pgClient.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
        `, [table.table_name]);
        
        schema.push({
          table: table.table_name,
          columns: columnsResult.rows.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES'
          }))
        });
      }
      break;
    
    case 'sqlite':
      const db = await getConnection(databaseId);
      
      // Get tables
      const getTables = () => {
        return new Promise((resolve, reject) => {
          db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, tables) => {
            if (err) reject(err);
            else resolve(tables);
          });
        });
      };
      
      const getTableInfo = (tableName) => {
        return new Promise((resolve, reject) => {
          db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
            if (err) reject(err);
            else resolve(columns);
          });
        });
      };
      
      const tables = await getTables();
      
      for (const table of tables) {
        const columns = await getTableInfo(table.name);
        
        schema.push({
          table: table.name,
          columns: columns.map(col => ({
            name: col.name,
            type: col.type,
            nullable: col.notnull === 0
          }))
        });
      }
      break;
      
    default:
      throw new Error(`Database type ${dbConfig.type} not supported`);
  }
  
  return schema;
};

/**
 * Test a database connection
 * @param {Object} connectionParams - Connection parameters
 */
const testConnection = async (connectionParams) => {
  try {
    const { type } = connectionParams;
    
    switch (type) {
      case 'postgres':
        const { host, port, database, user, password } = connectionParams;
        const pool = new Pool({
          host,
          port,
          database,
          user,
          password
        });
        
        await pool.query('SELECT 1');
        await pool.end();
        break;
        
      case 'sqlite':
        const { filename } = connectionParams;
        const db = new sqlite3.Database(filename);
        
        await new Promise((resolve, reject) => {
          db.get('SELECT 1', (err) => {
            db.close();
            if (err) reject(err);
            else resolve();
          });
        });
        break;
        
      default:
        throw new Error(`Database type ${type} not supported`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize on module load
init();

module.exports = {
  getDatabaseList,
  getDBSchema,
  getConnection,
  testConnection
}; 
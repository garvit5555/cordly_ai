const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');

/**
 * Create sample SQLite database for testing
 */
const createSampleDatabase = () => {
  const dbDir = path.join(__dirname, '../../data');
  const dbPath = path.join(dbDir, 'sample.db');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Create sample database
  const db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    // Create customer table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0
    )`);
    
    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )`);
    
    // Create order_items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);
    
    // Insert sample data - using INSERT OR IGNORE to avoid duplicates
    db.run(`INSERT OR IGNORE INTO customers (id, name, email) VALUES 
      (1, 'John Doe', 'john@example.com'),
      (2, 'Jane Smith', 'jane@example.com'),
      (3, 'Bob Johnson', 'bob@example.com')`);
      
    db.run(`INSERT OR IGNORE INTO products (id, name, description, price, stock) VALUES 
      (1, 'Laptop', 'High-performance laptop', 999.99, 10),
      (2, 'Smartphone', 'Latest smartphone model', 699.99, 20),
      (3, 'Headphones', 'Noise-canceling headphones', 149.99, 30),
      (4, 'Tablet', '10-inch tablet', 349.99, 15)`);
      
    db.run(`INSERT OR IGNORE INTO orders (id, customer_id, total, status) VALUES 
      (1, 1, 1149.98, 'completed'),
      (2, 2, 699.99, 'processing'),
      (3, 3, 499.97, 'pending'),
      (4, 1, 349.99, 'completed')`);
      
    db.run(`INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES 
      (1, 1, 1, 999.99),
      (1, 3, 1, 149.99),
      (2, 2, 1, 699.99),
      (3, 3, 1, 149.99),
      (3, 4, 1, 349.98),
      (4, 4, 1, 349.99)`);
  });
  
  db.close();
  
  // Add sample database to configurations
  dbConfigs.push({
    id: 'sample',
    name: 'Sample Database',
    type: 'sqlite',
    filename: dbPath,
    database: 'sample'
  });
  
  // Also write to config file to persist
  try {
    const configDir = path.join(__dirname, '../../config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    const configPath = path.join(configDir, 'databases.json');
    fs.writeFileSync(configPath, JSON.stringify(dbConfigs, null, 2));
  } catch (err) {
    console.error('Error writing config file:', err);
  }
  
  console.log('Created sample SQLite database for testing');
}; 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database in the correct location
const dbPath = path.join(__dirname, 'data', 'sample.db');

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log(`Removed existing database at ${dbPath}`);
}

// Create new database
const db = new sqlite3.Database(dbPath);

// Create schema and insert data
db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    state TEXT,
    join_date TEXT
  )`);
  
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0
  )`);
  
  db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date TEXT,
    total REAL NOT NULL,
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
  
  // Insert sample data
  db.run(`INSERT INTO customers (id, name, email, city, state, join_date) VALUES 
    (1, 'John Smith', 'john@example.com', 'New York', 'NY', '2022-01-15'),
    (2, 'Sarah Johnson', 'sarah@example.com', 'Los Angeles', 'CA', '2022-02-20'),
    (3, 'Michael Brown', 'michael@example.com', 'Chicago', 'IL', '2022-03-10')`);
    
  db.run(`INSERT INTO products (id, name, category, price, stock) VALUES 
    (1, 'Laptop Pro', 'Electronics', 1299.99, 45),
    (2, 'Smartphone X', 'Electronics', 899.99, 120),
    (3, 'Coffee Maker', 'Kitchen', 79.99, 30),
    (4, 'Running Shoes', 'Sports', 129.99, 75),
    (5, 'Wireless Headphones', 'Electronics', 149.99, 60)`);
    
  db.run(`INSERT INTO orders (id, customer_id, order_date, total) VALUES 
    (1, 1, '2023-01-10', 1299.99),
    (2, 2, '2023-01-15', 149.99),
    (3, 3, '2023-01-20', 279.98)`);
    
  db.run(`INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES 
    (1, 1, 1, 1, 1299.99),
    (2, 2, 5, 1, 149.99),
    (3, 3, 3, 1, 79.99),
    (4, 3, 2, 1, 899.99)`);
});

// Close database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log(`SQLite database created successfully at ${dbPath}`);
  }
}); 
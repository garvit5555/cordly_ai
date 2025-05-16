const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'backend', 'data', 'sample_store.db');

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log(`Removed existing database at ${dbPath}`);
}

// Create new database
const db = new sqlite3.Database(dbPath);

// Execute SQL statements to create schema and insert data
db.serialize(() => {
  // Customers table
  db.run(`
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      city TEXT,
      state TEXT,
      join_date DATE
    )
  `);
  
  // Products table
  db.run(`
    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      name TEXT,
      category TEXT,
      price DECIMAL(10,2),
      stock INTEGER
    )
  `);
  
  // Orders table
  db.run(`
    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date DATE,
      total_amount DECIMAL(10,2),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `);
  
  // Order items table
  db.run(`
    CREATE TABLE order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    )
  `);
  
  // Insert sample customers
  const customers = [
    [1, 'John Smith', 'john@example.com', 'New York', 'NY', '2022-01-15'],
    [2, 'Sarah Johnson', 'sarah@example.com', 'Los Angeles', 'CA', '2022-02-20'],
    [3, 'Michael Brown', 'michael@example.com', 'Chicago', 'IL', '2022-03-10'],
    [4, 'Emily Davis', 'emily@example.com', 'Houston', 'TX', '2022-01-05'],
    [5, 'David Wilson', 'david@example.com', 'Phoenix', 'AZ', '2022-04-25'],
    [6, 'Jennifer Martinez', 'jennifer@example.com', 'Philadelphia', 'PA', '2022-03-15'],
    [7, 'Robert Taylor', 'robert@example.com', 'San Diego', 'CA', '2022-02-28'],
    [8, 'Lisa Anderson', 'lisa@example.com', 'Dallas', 'TX', '2022-05-10'],
    [9, 'James Thomas', 'james@example.com', 'San Francisco', 'CA', '2022-04-12'],
    [10, 'Patricia White', 'patricia@example.com', 'Seattle', 'WA', '2022-05-22']
  ];
  
  const insertCustomerStmt = db.prepare('INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?)');
  customers.forEach(customer => insertCustomerStmt.run(customer));
  insertCustomerStmt.finalize();
  
  // Insert sample products
  const products = [
    [1, 'Laptop Pro', 'Electronics', 1299.99, 45],
    [2, 'Smartphone X', 'Electronics', 899.99, 120],
    [3, 'Coffee Maker', 'Kitchen', 79.99, 30],
    [4, 'Running Shoes', 'Sports', 129.99, 75],
    [5, 'Wireless Headphones', 'Electronics', 149.99, 60],
    [6, 'Blender', 'Kitchen', 59.99, 25],
    [7, 'Yoga Mat', 'Sports', 29.99, 100],
    [8, 'Desk Chair', 'Furniture', 199.99, 15],
    [9, 'Bookshelf', 'Furniture', 149.99, 20],
    [10, 'Table Lamp', 'Home', 49.99, 40],
    [11, 'Fitness Tracker', 'Electronics', 89.99, 55],
    [12, 'Water Bottle', 'Sports', 19.99, 150],
    [13, 'Portable Speaker', 'Electronics', 69.99, 35],
    [14, 'Cutting Board', 'Kitchen', 24.99, 45],
    [15, 'Throw Pillow', 'Home', 34.99, 65]
  ];
  
  const insertProductStmt = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?)');
  products.forEach(product => insertProductStmt.run(product));
  insertProductStmt.finalize();
  
  // Insert sample orders
  const orders = [
    [1, 1, '2023-01-10', 1299.99],
    [2, 2, '2023-01-15', 149.99],
    [3, 3, '2023-01-20', 279.98],
    [4, 4, '2023-01-25', 229.98],
    [5, 5, '2023-02-05', 899.99],
    [6, 6, '2023-02-10', 259.97],
    [7, 7, '2023-02-15', 149.99],
    [8, 8, '2023-02-20', 1499.97],
    [9, 9, '2023-03-05', 159.98],
    [10, 10, '2023-03-10', 209.98]
  ];
  
  const insertOrderStmt = db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?)');
  orders.forEach(order => insertOrderStmt.run(order));
  insertOrderStmt.finalize();
  
  // Insert sample order items
  const orderItems = [
    [1, 1, 1, 1, 1299.99],
    [2, 2, 5, 1, 149.99],
    [3, 3, 3, 1, 79.99],
    [4, 3, 7, 2, 29.99],
    [5, 4, 4, 1, 129.99],
    [6, 4, 12, 5, 19.99]
  ];
  
  const insertOrderItemStmt = db.prepare('INSERT INTO order_items VALUES (?, ?, ?, ?, ?)');
  orderItems.forEach(item => insertOrderItemStmt.run(item));
  insertOrderItemStmt.finalize();
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log(`SQLite database created successfully at ${dbPath}`);
  }
}); 
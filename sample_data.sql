-- Create Tables
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  join_date DATE
);

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price DECIMAL(10,2),
  stock INTEGER
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date DATE,
  total_amount DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert Customers
INSERT INTO customers VALUES (1, 'John Smith', 'john@example.com', 'New York', 'NY', '2022-01-15');
INSERT INTO customers VALUES (2, 'Sarah Johnson', 'sarah@example.com', 'Los Angeles', 'CA', '2022-02-20');
INSERT INTO customers VALUES (3, 'Michael Brown', 'michael@example.com', 'Chicago', 'IL', '2022-03-10');
INSERT INTO customers VALUES (4, 'Emily Davis', 'emily@example.com', 'Houston', 'TX', '2022-01-05');
INSERT INTO customers VALUES (5, 'David Wilson', 'david@example.com', 'Phoenix', 'AZ', '2022-04-25');
INSERT INTO customers VALUES (6, 'Jennifer Martinez', 'jennifer@example.com', 'Philadelphia', 'PA', '2022-03-15');
INSERT INTO customers VALUES (7, 'Robert Taylor', 'robert@example.com', 'San Diego', 'CA', '2022-02-28');
INSERT INTO customers VALUES (8, 'Lisa Anderson', 'lisa@example.com', 'Dallas', 'TX', '2022-05-10');
INSERT INTO customers VALUES (9, 'James Thomas', 'james@example.com', 'San Francisco', 'CA', '2022-04-12');
INSERT INTO customers VALUES (10, 'Patricia White', 'patricia@example.com', 'Seattle', 'WA', '2022-05-22');

-- Insert Products
INSERT INTO products VALUES (1, 'Laptop Pro', 'Electronics', 1299.99, 45);
INSERT INTO products VALUES (2, 'Smartphone X', 'Electronics', 899.99, 120);
INSERT INTO products VALUES (3, 'Coffee Maker', 'Kitchen', 79.99, 30);
INSERT INTO products VALUES (4, 'Running Shoes', 'Sports', 129.99, 75);
INSERT INTO products VALUES (5, 'Wireless Headphones', 'Electronics', 149.99, 60);
INSERT INTO products VALUES (6, 'Blender', 'Kitchen', 59.99, 25);
INSERT INTO products VALUES (7, 'Yoga Mat', 'Sports', 29.99, 100);
INSERT INTO products VALUES (8, 'Desk Chair', 'Furniture', 199.99, 15);
INSERT INTO products VALUES (9, 'Bookshelf', 'Furniture', 149.99, 20);
INSERT INTO products VALUES (10, 'Table Lamp', 'Home', 49.99, 40);
INSERT INTO products VALUES (11, 'Fitness Tracker', 'Electronics', 89.99, 55);
INSERT INTO products VALUES (12, 'Water Bottle', 'Sports', 19.99, 150);
INSERT INTO products VALUES (13, 'Portable Speaker', 'Electronics', 69.99, 35);
INSERT INTO products VALUES (14, 'Cutting Board', 'Kitchen', 24.99, 45);
INSERT INTO products VALUES (15, 'Throw Pillow', 'Home', 34.99, 65);

-- Insert Orders
INSERT INTO orders VALUES (1, 1, '2023-01-10', 1299.99);
INSERT INTO orders VALUES (2, 2, '2023-01-15', 149.99);
INSERT INTO orders VALUES (3, 3, '2023-01-20', 279.98);
INSERT INTO orders VALUES (4, 4, '2023-01-25', 229.98);
INSERT INTO orders VALUES (5, 5, '2023-02-05', 899.99);
INSERT INTO orders VALUES (6, 6, '2023-02-10', 259.97);
INSERT INTO orders VALUES (7, 7, '2023-02-15', 149.99);
INSERT INTO orders VALUES (8, 8, '2023-02-20', 1499.97);
INSERT INTO orders VALUES (9, 9, '2023-03-05', 159.98);
INSERT INTO orders VALUES (10, 10, '2023-03-10', 209.98);
INSERT INTO orders VALUES (11, 1, '2023-03-15', 149.99);
INSERT INTO orders VALUES (12, 2, '2023-03-20', 969.98);
INSERT INTO orders VALUES (13, 3, '2023-04-05', 149.99);
INSERT INTO orders VALUES (14, 4, '2023-04-10', 79.99);
INSERT INTO orders VALUES (15, 5, '2023-04-15', 179.98);
INSERT INTO orders VALUES (16, 6, '2023-04-20', 1299.99);
INSERT INTO orders VALUES (17, 7, '2023-05-05', 109.98);
INSERT INTO orders VALUES (18, 8, '2023-05-10', 899.99);
INSERT INTO orders VALUES (19, 9, '2023-05-15', 49.99);
INSERT INTO orders VALUES (20, 10, '2023-05-20', 119.98);
INSERT INTO orders VALUES (21, 1, '2023-06-05', 249.98);
INSERT INTO orders VALUES (22, 2, '2023-06-10', 129.99);
INSERT INTO orders VALUES (23, 3, '2023-06-15', 199.99);
INSERT INTO orders VALUES (24, 4, '2023-06-20', 69.99);
INSERT INTO orders VALUES (25, 5, '2023-07-05', 34.99);

-- Insert Order Items
INSERT INTO order_items VALUES (1, 1, 1, 1, 1299.99);
INSERT INTO order_items VALUES (2, 2, 5, 1, 149.99);
INSERT INTO order_items VALUES (3, 3, 3, 1, 79.99);
INSERT INTO order_items VALUES (4, 3, 7, 2, 29.99);
INSERT INTO order_items VALUES (5, 4, 4, 1, 129.99);
INSERT INTO order_items VALUES (6, 4, 12, 5, 19.99);
INSERT INTO order_items VALUES (7, 5, 2, 1, 899.99);
INSERT INTO order_items VALUES (8, 6, 6, 1, 59.99);
INSERT INTO order_items VALUES (9, 6, 14, 1, 24.99);
INSERT INTO order_items VALUES (10, 6, 12, 1, 19.99);
INSERT INTO order_items VALUES (11, 7, 5, 1, 149.99);
INSERT INTO order_items VALUES (12, 8, 1, 1, 1299.99);
INSERT INTO order_items VALUES (13, 8, 5, 1, 149.99);
INSERT INTO order_items VALUES (14, 8, 10, 1, 49.99);
INSERT INTO order_items VALUES (15, 9, 7, 1, 29.99);
INSERT INTO order_items VALUES (16, 9, 10, 1, 49.99);
INSERT INTO order_items VALUES (17, 9, 15, 1, 34.99);
INSERT INTO order_items VALUES (18, 10, 11, 1, 89.99);
INSERT INTO order_items VALUES (19, 10, 12, 6, 19.99);
INSERT INTO order_items VALUES (20, 11, 5, 1, 149.99);
INSERT INTO order_items VALUES (21, 12, 2, 1, 899.99);
INSERT INTO order_items VALUES (22, 12, 7, 1, 29.99);
INSERT INTO order_items VALUES (23, 13, 5, 1, 149.99);
INSERT INTO order_items VALUES (24, 14, 3, 1, 79.99);
INSERT INTO order_items VALUES (25, 15, 11, 2, 89.99);
INSERT INTO order_items VALUES (26, 16, 1, 1, 1299.99);
INSERT INTO order_items VALUES (27, 17, 7, 1, 29.99);
INSERT INTO order_items VALUES (28, 17, 14, 1, 24.99);
INSERT INTO order_items VALUES (29, 17, 12, 3, 19.99);
INSERT INTO order_items VALUES (30, 18, 2, 1, 899.99);
INSERT INTO order_items VALUES (31, 19, 10, 1, 49.99);
INSERT INTO order_items VALUES (32, 20, 6, 1, 59.99);
INSERT INTO order_items VALUES (33, 20, 12, 3, 19.99);
INSERT INTO order_items VALUES (34, 21, 8, 1, 199.99);
INSERT INTO order_items VALUES (35, 21, 10, 1, 49.99);
INSERT INTO order_items VALUES (36, 22, 4, 1, 129.99);
INSERT INTO order_items VALUES (37, 23, 8, 1, 199.99);
INSERT INTO order_items VALUES (38, 24, 13, 1, 69.99);
INSERT INTO order_items VALUES (39, 25, 15, 1, 34.99); 
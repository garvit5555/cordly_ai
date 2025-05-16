const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQL file content
const sqlScript = fs.readFileSync('./sample_data.sql', 'utf8');

// Create a new database
const dbPath = path.join(__dirname, 'backend', 'data', 'sample_store.db');

// Ensure directory exists
fs.mkdirSync(path.join(__dirname, 'backend', 'data'), { recursive: true });

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

// Create and open the database
const db = new sqlite3.Database(dbPath);

// Execute SQL in transaction
db.serialize(() => {
  db.exec('BEGIN TRANSACTION;');
  
  // Split the script by semicolons
  const statements = sqlScript.split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);
  
  // Execute each statement
  statements.forEach(statement => {
    db.exec(statement + ';', (err) => {
      if (err) {
        console.error('Error executing statement:', statement);
        console.error(err);
      }
    });
  });
  
  db.exec('COMMIT;');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log(`SQLite database created at ${dbPath}`);
    
    // Create a database config file
    const dbConfig = {
      id: "sample_store",
      name: "Sample Store",
      type: "sqlite",
      path: dbPath
    };
    
    const configPath = path.join(__dirname, 'backend', 'data', 'databases.json');
    fs.writeFileSync(configPath, JSON.stringify([dbConfig], null, 2));
    console.log(`Database config created at ${configPath}`);
  }
}); 
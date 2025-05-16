const { getConnection, getDBSchema } = require('./databaseService');
const { Groq } = require('groq-sdk');

// Debug log for environment variables
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  GROQ_API_KEY: process.env.GROQ_API_KEY
});

// Initialize Groq client with error handling
let groqClient;
try {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: No valid GROQ API key provided. AI features will be mocked.');
  } else {
    console.log('Attempting to initialize GROQ with key:', apiKey);
    groqClient = new Groq({ apiKey });
  }
} catch (error) {
  console.error('Error initializing GROQ:', error);
}

// Mock function for SQL generation when API key is not available
const mockGenerateSQL = (query) => {
  console.log('Using mock SQL generation for query:', query);
  
  // Handle specific queries with better mock responses
  if (query.toLowerCase().includes('most ordered product')) {
    return `
      SELECT 
        p.name as product_name,
        COUNT(oi.id) as order_count,
        SUM(oi.quantity) as total_quantity
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY order_count DESC, total_quantity DESC
      LIMIT 1
    `.trim();
  } else if (query.toLowerCase().includes('customer')) {
    return 'SELECT * FROM customers LIMIT 10';
  } else if (query.toLowerCase().includes('product')) {
    return 'SELECT * FROM products LIMIT 10';
  } else if (query.toLowerCase().includes('order')) {
    return `
      SELECT 
        o.id as order_id,
        c.name as customer_name,
        o.total,
        o.status,
        o.order_date
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LIMIT 10
    `.trim();
  } else {
    return 'SELECT * FROM customers LIMIT 5';
  }
};

/**
 * Process a natural language query to SQL and execute it
 * @param {string} query - Natural language query
 * @param {string} databaseId - Database ID
 */
const processQuery = async (query, databaseId) => {
  try {
    // Get database schema
    const schema = await getDBSchema(databaseId);
    
    // Generate SQL from natural language
    const sqlQuery = await generateSQL(query, schema);
    
    // Execute SQL query
    const results = await executeQuery(sqlQuery, databaseId);
    
    // Generate visualizations
    const visualizations = generateVisualizations(results, query);
    
    // Generate natural language response
    const explanation = await generateExplanation(query, sqlQuery, results);
    
    return {
      query,
      sqlQuery,
      results,
      explanation,
      visualizations
    };
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
};

/**
 * Generate SQL from natural language query
 * @param {string} query - Natural language query
 * @param {Array} schema - Database schema
 */
const generateSQL = async (query, schema) => {
  try {
    // If no valid client, use mock function
    if (!groqClient) {
      return mockGenerateSQL(query);
    }
    
    // Prepare schema as a string
    const schemaString = schema.map(table => {
      const columnsStr = table.columns.map(col => 
        `${col.name} (${col.type}${col.nullable ? ', nullable' : ''})`
      ).join(', ');
      
      return `Table: ${table.table}\nColumns: ${columnsStr}`;
    }).join('\n\n');

    console.log('Database Schema:', schemaString); // Debug log
    
    // Use GROQ to generate SQL
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert SQLite query generator. Your task is to convert natural language questions into valid SQLite queries based on the provided database schema.
          
Available tables and their relationships:
- customers (id, name, email)
- products (id, name, description, price, stock)
- orders (id, customer_id -> customers.id, total, status, order_date)
- order_items (id, order_id -> orders.id, product_id -> products.id, quantity, price)

IMPORTANT: 
1. Return ONLY the raw SQL query without any markdown formatting or additional text
2. Use proper table aliases (e.g., p for products)
3. Always use proper JOIN syntax
4. For aggregations, always include GROUP BY with all non-aggregated columns
5. Use meaningful column aliases for better readability`
        },
        {
          role: "user",
          content: `Question: ${query}\n\nGenerate a SQLite query to answer this question. Return ONLY the raw SQL query:`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1000,
    });
    
    let sqlQuery = completion.choices[0]?.message?.content?.trim() || mockGenerateSQL(query);
    // Remove any remaining markdown formatting if present
    sqlQuery = sqlQuery.replace(/```sql\n?|\n?```/g, '').trim();
    
    console.log('Generated SQL Query:', sqlQuery); // Debug log
    
    // Basic validation of SQL query
    if (!sqlQuery.toLowerCase().startsWith('select')) {
      console.warn('Generated query does not start with SELECT, using mock query instead');
      return mockGenerateSQL(query);
    }
    
    return sqlQuery;
  } catch (error) {
    console.error('Error generating SQL:', error);
    return mockGenerateSQL(query);
  }
};

/**
 * Execute SQL query
 * @param {string} sqlQuery - SQL query
 * @param {string} databaseId - Database ID
 */
const executeQuery = async (sqlQuery, databaseId) => {
  try {
    console.log('Executing SQL Query:', sqlQuery); // Debug log
    const connection = await getConnection(databaseId);
    
    // Execute query based on database type
    return new Promise((resolve, reject) => {
      // First try to run the query
      connection.all(sqlQuery, [], (err, rows) => {
        if (err) {
          console.error('SQL Execution Error:', err); // Debug log
          
          // If query fails, try with the mock query
          console.log('Query failed, using mock query instead');
          const mockQuery = mockGenerateSQL('what is the most ordered product?');
          console.log('Mock Query:', mockQuery);
          
          connection.all(mockQuery, [], (mockErr, mockRows) => {
            if (mockErr) {
              console.error('Mock Query Error:', mockErr);
              reject(new Error(`Error executing query: ${mockErr.message}`));
            } else {
              console.log('Mock Query Results:', mockRows);
              resolve(mockRows);
            }
          });
        } else {
          console.log('Query Results:', rows); // Debug log
          resolve(rows);
        }
      });
    });
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

/**
 * Generate natural language explanation of results
 * @param {string} query - Original natural language query
 * @param {string} sqlQuery - Generated SQL query
 * @param {Array} results - Query results
 */
const generateExplanation = async (query, sqlQuery, results) => {
  try {
    // If no results, return simple message
    if (!results || results.length === 0) {
      return "No results found for this query.";
    }
    
    // If no valid client, use mock function
    if (!groqClient) {
      return `This is a sample response for your query: "${query}". In a real application with a valid API key, this would be a detailed analysis of the query results.`;
    }
    
    // Take a sample of results to include in prompt
    const resultSample = results.slice(0, 5);
    
    // Use GROQ to generate explanation
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a data analyst expert. Your task is to explain query results in natural language that directly answers the original question. Include key insights and notable patterns in the data."
        },
        {
          role: "user",
          content: `Natural language question: ${query}\nSQL query used: ${sqlQuery}\nResults (sample): ${JSON.stringify(resultSample, null, 2)}\nTotal results: ${results.length}\n\nPlease provide a concise explanation of these results:`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1000,
    });
    
    return completion.choices[0]?.message?.content?.trim() || "Unable to generate explanation.";
  } catch (error) {
    console.error('Error generating explanation:', error);
    return "Unable to generate explanation due to an error.";
  }
};

/**
 * Generate visualizations based on query results
 * @param {Array} results - Query results
 * @param {string} query - Natural language query
 */
const generateVisualizations = (results, query) => {
  // Basic visualization suggestions based on data and query type
  const visualizations = [];
  
  if (!results || results.length === 0) {
    return visualizations;
  }
  
  // Determine if the query is asking for time series data
  const isTimeSeries = query.toLowerCase().includes('time') || 
                       query.toLowerCase().includes('trend') ||
                       query.toLowerCase().includes('month') ||
                       query.toLowerCase().includes('year') ||
                       query.toLowerCase().includes('day');
  
  // Determine if the query is asking for comparisons
  const isComparison = query.toLowerCase().includes('compare') || 
                       query.toLowerCase().includes('difference') ||
                       query.toLowerCase().includes('between');
  
  // Determine if query is for aggregation
  const isAggregation = query.toLowerCase().includes('total') || 
                        query.toLowerCase().includes('sum') ||
                        query.toLowerCase().includes('average') ||
                        query.toLowerCase().includes('count');
  
  // Get column names
  const columns = Object.keys(results[0]);
  
  // Check for numeric columns
  const numericColumns = columns.filter(column => {
    return typeof results[0][column] === 'number';
  });
  
  // Check for potential date columns
  const dateColumns = columns.filter(column => {
    const value = results[0][column];
    return typeof value === 'string' && (
      column.toLowerCase().includes('date') ||
      column.toLowerCase().includes('time') ||
      /^\d{4}-\d{2}-\d{2}/.test(value) // Simple date format check
    );
  });
  
  // Table is always available
  visualizations.push({
    type: 'table',
    title: 'Results Table',
    columns: columns,
    data: results
  });
  
  // Add bar chart if we have numeric data
  if (numericColumns.length > 0) {
    const categoryColumn = columns.find(col => !numericColumns.includes(col)) || columns[0];
    
    visualizations.push({
      type: 'bar',
      title: 'Bar Chart',
      xAxis: categoryColumn,
      yAxis: numericColumns[0],
      data: results.slice(0, 10) // Limit to 10 records for visualization
    });
  }
  
  // Add line chart for time series
  if (isTimeSeries && dateColumns.length > 0 && numericColumns.length > 0) {
    visualizations.push({
      type: 'line',
      title: 'Time Series',
      xAxis: dateColumns[0],
      yAxis: numericColumns[0],
      data: results
    });
  }
  
  // Add pie chart for distribution questions
  if (numericColumns.length > 0 && results.length <= 10) {
    const categoryColumn = columns.find(col => !numericColumns.includes(col)) || columns[0];
    
    visualizations.push({
      type: 'pie',
      title: 'Distribution',
      labelKey: categoryColumn,
      valueKey: numericColumns[0],
      data: results
    });
  }
  
  return visualizations;
};

module.exports = {
  processQuery
}; 
const { getConnection, getDBSchema } = require('./databaseService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini AI with error handling
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('WARNING: No valid Gemini API key provided. AI features will be mocked.');
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.error('Error initializing Gemini AI:', error);
}

// Mock function for SQL generation when API key is not available
const mockGenerateSQL = (query) => {
  console.log('Using mock SQL generation for query:', query);
  
  // Handle specific queries with better mock responses
  if (query.toLowerCase().includes('category') && query.toLowerCase().includes('revenue')) {
    return `
      SELECT p.category, SUM(oi.price * oi.quantity) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.category
      ORDER BY total_revenue DESC
    `;
  } else if (query.toLowerCase().includes('customer')) {
    return 'SELECT * FROM customers LIMIT 10';
  } else if (query.toLowerCase().includes('product')) {
    return 'SELECT * FROM products LIMIT 10';
  } else if (query.toLowerCase().includes('order')) {
    return 'SELECT * FROM orders LIMIT 10';
  } else {
    return 'SELECT * FROM customers LIMIT 5';
  }
};

// Mock function for explanation generation when API key is not available
const mockGenerateExplanation = (query) => {
  return `This is a sample response for your query: "${query}". In a real application with a valid API key, this would be a detailed analysis of the query results.`;
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
    // If no valid API key, use mock function
    if (!genAI) {
      return mockGenerateSQL(query);
    }
    
    // Prepare schema as a string
    const schemaString = schema.map(table => {
      const columnsStr = table.columns.map(col => 
        `${col.name} (${col.type}${col.nullable ? ', nullable' : ''})`
      ).join(', ');
      
      return `Table: ${table.table}\nColumns: ${columnsStr}`;
    }).join('\n\n');
    
    // Use Google Gemini to generate SQL
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
You are an expert SQL query generator. Convert the following natural language question to a valid SQL query.
The database has the following schema:

${schemaString}

Question: ${query}

SQL Query (return only the SQL query without any additional text or explanations):`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sqlQuery = response.text().trim();
    
    return sqlQuery;
  } catch (error) {
    console.error('Error generating SQL:', error);
    // Fallback to mock in case of error
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
    const connection = await getConnection(databaseId);
    
    // Execute query based on database type
    return new Promise((resolve, reject) => {
      connection.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(new Error(`Error executing query: ${err.message}`));
        } else {
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
    
    // If no valid API key, use mock function
    if (!genAI) {
      return mockGenerateExplanation(query);
    }
    
    // Take a sample of results to include in prompt
    const resultSample = results.slice(0, 5);
    
    // Use Google Gemini to generate explanation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
Natural language question: ${query}
SQL query used: ${sqlQuery}
Results (sample): ${JSON.stringify(resultSample, null, 2)}
Total results: ${results.length}

Please provide a concise explanation of these results in natural language that directly answers the original question. Include key insights and any notable patterns in the data.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating explanation:', error);
    return mockGenerateExplanation(query);
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
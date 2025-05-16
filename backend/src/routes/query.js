const express = require('express');
const router = express.Router();
const { processQuery } = require('../services/queryService');
const { validateQuery } = require('../middlewares/validation');

/**
 * @route POST /api/query
 * @description Process a natural language query and convert it to SQL
 * @access Public
 */
router.post('/', validateQuery, async (req, res, next) => {
  try {
    const { query, databaseId } = req.body;
    
    console.log(`Processing query: ${query} for database: ${databaseId}`);
    
    const result = await processQuery(query, databaseId);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error processing query:', error);
    next(error);
  }
});

/**
 * @route GET /api/query/history
 * @description Get query history
 * @access Public
 */
router.get('/history', async (req, res, next) => {
  try {
    // Implementation for query history
    const history = []; // Replace with actual implementation
    
    res.status(200).json({
      status: 'success',
      data: history
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
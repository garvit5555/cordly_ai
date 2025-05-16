const express = require('express');
const router = express.Router();
const { getDBSchema, testConnection, getDatabaseList } = require('../services/databaseService');
const { validateDatabaseConnection } = require('../middlewares/validation');

/**
 * @route GET /api/database/list
 * @description Get list of configured databases
 * @access Public
 */
router.get('/list', async (req, res, next) => {
  try {
    const databases = await getDatabaseList();
    
    res.status(200).json({
      status: 'success',
      data: databases
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/database/schema/:databaseId
 * @description Get schema for a specific database
 * @access Public
 */
router.get('/schema/:databaseId', async (req, res, next) => {
  try {
    const { databaseId } = req.params;
    const schema = await getDBSchema(databaseId);
    
    res.status(200).json({
      status: 'success',
      data: schema
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/database/test-connection
 * @description Test a database connection
 * @access Public
 */
router.post('/test-connection', validateDatabaseConnection, async (req, res, next) => {
  try {
    const connectionParams = req.body;
    const result = await testConnection(connectionParams);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 
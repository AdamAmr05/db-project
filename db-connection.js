/**
 * MySQL Database Connection Module
 * 
 * This module creates a connection pool to your MySQL database.
 * Connection pools are preferred over single connections for better performance.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hr_management_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Execute a query with parameters (prevents SQL injection)
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query results
 */
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params || []);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a stored procedure
 * @param {string} procedureName - Name of the stored procedure
 * @param {Array} params - Procedure parameters
 * @returns {Promise} Procedure results
 */
async function callProcedure(procedureName, params = []) {
  try {
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${procedureName}(${placeholders})`;
    const [rows] = await pool.execute(sql, params);
    return rows[0]; // Stored procedures return results in first array element
  } catch (error) {
    console.error('Stored procedure error:', error);
    throw error;
  }
}

/**
 * Get a single connection from the pool (for transactions)
 * @returns {Promise} Connection object
 */
async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  query,
  callProcedure,
  getConnection,
  testConnection
};


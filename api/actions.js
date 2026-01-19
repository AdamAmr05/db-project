/**
 * Actions API Handler
 * Processes approved AI-proposed database modifications
 */
const db = require('../db-connection');

/**
 * Parse actionId to extract operation details
 * Format: operation_entity_id (e.g., "update_employee_42", "create_employee", "delete_job_5")
 */
function parseActionId(actionId) {
    const parts = actionId.split('_');
    if (parts.length < 2) {
        throw new Error('Invalid actionId format');
    }

    const operation = parts[0]; // update, create, delete
    const entity = parts[1];     // employee, job, department, etc.
    const id = parts.length > 2 ? parts.slice(2).join('_') : null;

    return { operation, entity, id };
}

/**
 * Build and execute SQL for the action
 */
async function executeAction(actionId, fields) {
    const { operation, entity, id } = parseActionId(actionId);

    // Map entity names to table names and primary keys (matching actual DB schema)
    const entityConfig = {
        employee: { table: 'EMPLOYEE', pk: 'Employee_ID' },
        job: { table: 'JOB', pk: 'Job_ID' },
        department: { table: 'DEPARTMENT', pk: 'Department_ID' },
        training: { table: 'TRAINING_PROGRAM', pk: 'Program_ID' },
        appraisal: { table: 'PERFORMANCE_APPRAISAL', pk: 'Appraisal_ID' },
        appeal: { table: 'APPEAL', pk: 'Appeal_ID' },
        cycle: { table: 'PERFORMANCE_CYCLE', pk: 'Cycle_ID' },
        performance: { table: 'PERFORMANCE_CYCLE', pk: 'Cycle_ID' } // alias for cycle
    };

    const config = entityConfig[entity];
    if (!config) {
        throw new Error(`Unknown entity type: ${entity}`);
    }

    const { table, pk } = config;

    if (operation === 'update') {
        if (!id) throw new Error('Update requires an ID');

        // Filter out non-editable/meta fields and build SET clause
        const updateFields = Object.entries(fields)
            .filter(([key]) => !['id', 'entityId', pk.toLowerCase()].includes(key.toLowerCase()))
            .filter(([, value]) => value !== undefined && value !== null);

        if (updateFields.length === 0) {
            throw new Error('No fields to update');
        }

        const setClause = updateFields.map(([key]) => `${key} = ?`).join(', ');
        const values = updateFields.map(([, value]) => value);
        values.push(id);

        const sql = `UPDATE ${table} SET ${setClause} WHERE ${pk} = ?`;
        console.log('[Actions] Executing:', sql, values);

        const [result] = await db.pool.query(sql, values);
        return {
            success: true,
            // REMOVED ID from message
            message: `Updated ${entity}`,
            affectedRows: result.affectedRows
        };
    }

    if (operation === 'create') {
        // Exclude ID fields - let DB auto-increment
        const insertFields = Object.entries(fields)
            .filter(([key]) => !key.toLowerCase().endsWith('_id'))
            .filter(([, value]) => value !== undefined && value !== null && value !== '');

        if (insertFields.length === 0) {
            throw new Error('No fields to insert');
        }

        const columns = insertFields.map(([key]) => key).join(', ');
        const placeholders = insertFields.map(() => '?').join(', ');
        const values = insertFields.map(([, value]) => value);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        console.log('[Actions] Executing:', sql, values);

        const [result] = await db.pool.query(sql, values);
        return {
            success: true,
            // REMOVED ID from message
            message: `Created new ${entity}`,
            insertId: result.insertId
        };
    }

    if (operation === 'delete') {
        if (!id) throw new Error('Delete requires an ID');

        const sql = `DELETE FROM ${table} WHERE ${pk} = ?`;
        console.log('[Actions] Executing:', sql, [id]);

        const [result] = await db.pool.query(sql, [id]);
        return {
            success: true,
            // REMOVED ID from message
            message: `Deleted ${entity}`,
            affectedRows: result.affectedRows
        };
    }

    throw new Error(`Unknown operation: ${operation}`);
}

/**
 * POST /api/actions/execute
 * Execute an approved action
 */
async function execute(req, res) {
    try {
        const { actionId, fields } = req.body;

        if (!actionId) {
            return res.status(400).json({
                success: false,
                error: 'actionId is required'
            });
        }

        console.log('[Actions] Execute request:', { actionId, fields });

        const result = await executeAction(actionId, fields || {});

        res.json(result);
    } catch (error) {
        console.error('[Actions] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    execute
};

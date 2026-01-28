const db = require('../../db-connection');

const FORBIDDEN_KEYWORDS = [
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'TRUNCATE',
    'GRANT',
    'REVOKE',
    'EXEC',
    'EXECUTE'
];

function isSelectOnly(sql) {
    const normalized = sql.trim().toUpperCase();
    if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
        return false;
    }
    for (const keyword of FORBIDDEN_KEYWORDS) {
        if (normalized.includes(keyword)) {
            return false;
        }
    }
    return true;
}

function createQueryFunction({ defaultLimit } = {}) {
    return async function query(sql) {
        if (!isSelectOnly(sql)) {
            throw new Error('Only SELECT queries are allowed');
        }

        const normalizedSql = sql.trim();
        const hasLimit = normalizedSql.toUpperCase().includes('LIMIT');
        const safeSql = defaultLimit && !hasLimit
            ? `${normalizedSql} LIMIT ${defaultLimit}`
            : normalizedSql;

        const [rows] = await db.pool.query(safeSql);
        return rows;
    };
}

function createRunCode({ defaultLimit } = {}) {
    return async function runCode(code, explanation) {
        console.log('\n┌─────────────────────────────────────');
        console.log('│ 🤖 AI Generated Code:');
        if (explanation) {
            console.log(`│ 📝 ${explanation}`);
        }
        console.log('├─────────────────────────────────────');
        console.log('│ ' + code.replace(/\n/g, '\n│ '));
        console.log('└─────────────────────────────────────\n');

        try {
            const hasQuery = /query\s*\(/.test(code);
            const hasAwaitQuery = /await\s+query\s*\(/.test(code);
            const hasPromiseAll = /Promise\.all\s*\(/.test(code);

            if (hasQuery && !hasAwaitQuery && !hasPromiseAll) {
                throw new Error('Every query(...) must be awaited (or wrapped in await Promise.all([...])).');
            }

            const query = createQueryFunction({ defaultLimit });
            const asyncFunction = new Function('query', `
                return (async () => {
                    ${code}
                })();
            `);

            const result = await asyncFunction(query);

            console.log('[Code] Execution successful');

            return {
                success: true,
                result
            };
        } catch (error) {
            console.error(`[Code] Execution error: ${error.message}`);
            return {
                error: `Code execution failed: ${error.message}`
            };
        }
    };
}

module.exports = {
    createRunCode
};

const db = require('./db-connection');

async function startCycle() {
    try {
        console.log('Connecting to database...');
        await db.testConnection();

        console.log('Inserting active performance cycle...');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 15); // Started 15 days ago

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 15); // Ends in 15 days

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 10); // Deadline in 10 days

        const formatDate = (d) => d.toISOString().split('T')[0];

        await db.query(`
      INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Start_Date, End_Date, Submission_Deadline, Cycle_Type)
      VALUES (?, ?, ?, ?, ?)
    `, [
            'Q4 2025 Performance Review',
            formatDate(startDate),
            formatDate(endDate),
            formatDate(deadline),
            'Quarterly'
        ]);

        console.log('✅ Active cycle started successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to start cycle:', error);
        process.exit(1);
    }
}

startCycle();

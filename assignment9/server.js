const oracledb = require('oracledb');

const dbConfig = {
    user: 'hr',
    password: 'hr',
    connectString: 'localhost/XE'
};

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle HR schema');

        // Fetch employees
        const empResult = await connection.execute(`SELECT employee_id, first_name, last_name, job_id, salary FROM employees`);
        console.log('\nEmployees:');
        empResult.rows.forEach(row => {
            console.log(`ID: ${row[0]}, Name: ${row[1]} ${row[2]}, Job: ${row[3]}, Salary: ${row[4]}`);
        });

        // Fetch departments
        const deptResult = await connection.execute(`SELECT department_id, department_name, manager_id FROM departments`);
        console.log('\nDepartments:');
        deptResult.rows.forEach(row => {
            console.log(`Dept ID: ${row[0]}, Name: ${row[1]}, Manager ID: ${row[2]}`);
        });

    } catch (err) {
        console.error('Error: ', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('\nConnection closed');
            } catch (err) {
                console.error('Close error:', err);
            }
        }
    }
}

run();

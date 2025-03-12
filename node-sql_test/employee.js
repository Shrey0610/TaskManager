import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';
import "dotenv/config";

const app = express();

app.use(cors({
    origin: "*",  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));



const port = process.env.PORT || 5002;

app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded

app.use(bodyParser.json());  // parse application/json

// MySQL
const pool= mysql.createPool({
    connectionLimit : 10,
    // type: "mysql",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, // Replace with your MySQL password if set
    database: process.env.MYSQL_DATABASE,
    // synchronize: true,
    connectTimeout: 20000 
})

app.get('', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        //query(sqlString, callback)
        connection.query('SELECT * FROM assignees', (err, rows)=>{
            //connection release:
            connection.release()

            if(!err){
                res.send(rows);
            }
            else{
                console.log(err);
            }
        })
    })
})

//get by id:
app.get('/:id', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        //query(sqlString, callback)
        connection.query('SELECT * FROM assignees WHERE id= ?', [req.params.id], (err, rows)=>{
            //connection release:
            connection.release()

            if(!err){
                res.send(rows);
            }
            else{
                console.log(err);
            }
        })
    })
})

//delete a record:
app.delete('/:id', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        //query(sqlString, callback)
        connection.query('DELETE FROM assignees WHERE id= ? ', [req.params.id], (err, rows)=>{
            //connection release:
            connection.release()

            if(!err){
                res.send(`Task with the record ID: ${req.params.id} has been removed.`);
            }
            else{
                console.log(err);
            }
        })
    })
})

//add a record:
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const params = req.body;

        // First, get the maximum id from the table
        connection.query('SELECT MAX(id) AS maxId FROM assignees', (err, results) => {
            if (err) {
                connection.release();
                console.log(err);
                res.status(500).send('Error fetching max id');
                return;
            }

            const maxId = results[0].maxId || 0; // If no rows, maxId will be 0
            const newId = maxId + 1;

            // Set the new id in the params
            params.id = newId;

            // Insert the new task with the new id
            connection.query('INSERT INTO assignees SET ?', params, (err, rows) => {
                // Release the connection
                connection.release();

                if (!err) {
                    res.send(`Task with the record name: ${params.name} has been added with id ${newId}.`);
                } else {
                    console.log(err);
                    res.status(500).send('Error inserting task');
                }
            });

            console.log(params);
        });
    });
});



const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};



app.put('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`Connected as id ${connection.threadId}`);

        const { name, email, phoneNum, dob } = req.body;
        const { id } = req.params;

        // Convert date format
        const formatteddob = dob ? formatDateForMySQL(dob) : null;

        const sql = 'UPDATE assignees SET name=?, email=?, phoneNum=?, dob=? WHERE id=?';
        const values = [name, email, phoneNum,formatteddob, id];

        connection.query(sql, values, (err, result) => {
            connection.release();

            if (!err) {
                if (result.affectedRows === 0) {
                    return res.status(404).send(`No task found with ID: ${id}`);
                }
                res.send(`Task with ID ${id} has been updated.`);
            } else {
                console.error("Error updating task:", err);
                res.status(500).send("Error updating task.");
            }
        });
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// * HomePage
app.get('/', (req,res) => {
    return res.send({
        error: false, 
        message: 'Welcome to RESTful Crud Api NodeJS',
        written_by: 'LaserOnline',
        published_on: 'https://milerdev.dev'
    })
})

// * connection to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1988',
    database: 'node_api'
})
dbCon.connect();

// * Retrieve all books
app.get('/books', (req,res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if (error) throw error;
        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Books table is empty";
        } else {
            message = "Successfully retrieved all books";
        }
        return res.send({error: false, data: results, message: message});
    })
})

// * Add a New Books
app.post('/book', (req,res) => {
    let name = req.body.name;
    let author = req.body.author;
    // * Validation
    if (!name || !author) {
        return res.status(400).send({error: true, message: "Please Provide Book Name"})
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES (?, ?)', 
        [name ,author],
        (error,results,fields) => {
            if (error) throw error;
            return res.send({error: false, data: results, message: "Book Successfully Add"})
        })

    }
});

// * Retrieve Books by id
app.get('/book/:id', (req,res) => {
    let id = req.params.id;
        if (!id) {
            return res.status(400).send({error: true, message: "Please Provide Book id"});
        } else {
            dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) =>{
                if (error) throw error;
                let message = "";
                if (results === undefined || results.length == 0) {
                    message = "Book Not Found";
                } else {
                    message = "Success Retrieved Book Data";
                }
                return res.send({error: false, data: results[0], message: message})
            })
        }
})

// * Update Nook With ID
app.put('/book', (req,res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // * Validation
        if (!id || !name || !author) {
            return res.status(400).send({error: true, message: `Please Provide Book ID Name AND AUTHOR`});
        } else {
            dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', 
            [name,author,id],
            (error,results,fields) => {
                if (error) throw error;
                let message = "";
                if (results.changedRows === 0) {
                    message = "Book Not Found or Data Are Same";
                } else {
                    message = "Book Successfully Update"
                }
                return res.send({error: false, data: results, message: message});
            })
        }
})

// * Delete book By ID
app.delete('/book', (req,res) => {
    let id = req.body.id;
        if (!id) {
            return res.status(400).send({error: true, message: "Please Provide Book ID"});
        } else {
            dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
                if (error) throw error;
                let message = "";
                if (results.affectedRows === 0) {
                    message = "Books Not Found";
                } else {
                    message = "Books Success Deleted";
                }
                return res.send({error: false, data: results, message: message})
            })
        }
})


app.listen(3000,() => {
    console.log('Node JS is Running on Port 3000');
})

module.exports = app;
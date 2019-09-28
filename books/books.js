const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

require("./model/Books");
const Book = mongoose.model("Book")

mongoose.connect("mongodb://username:password@host:port/database?options...", { useUnifiedTopology: true,useNewUrlParser: true }, () => {
    console.log("Database connected - book service")
})

app.get('/', (req,res) => {
    res.send("This is main end point")
})

app.post("/book", (req,res)=> {
    var newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    }

    var book = new Book(newBook)

    book.save().then(() => {
        console.log("New book created!")
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
    res.send("New book added");
})

app.get("/books", (req,res) => {
    Book.find().then((books) => {
        res.json(books)
    }).catch( err => {
        if (err) {
            throw err;
        }
    })
})

app.get('/book/:id', (req,res) => {
    Book.findById(req.params.id).then((book) => {
        if (book) {
            res.json(book)
        }else{
            res.sendStatus(404);
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})

app.delete('/book/:id', (req,res) => {
    Book.findByIdAndRemove(req.params.id).then(() => {
        res.send("book removed")
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})

app.listen(4545, () => {
    console.log("Books running at 4545")
});
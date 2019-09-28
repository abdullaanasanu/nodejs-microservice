const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios")

app.use(bodyParser.json());

require("./model/Order");
const Order = mongoose.model("Order")

mongoose.connect("mongodb://username:password@host:port/database?options...", { useUnifiedTopology: true,useNewUrlParser: true }, () => {
    console.log("Database connected - order service")
})

app.post("/orders", (req,res) => {
    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order created")
    }).catch((err) => {
        if (err) {
            throw err
        }
    })
})

app.get("/orders", (req,res) => {
    Order.find().then((books) => {
        res.json(books)
    }).catch((err) => {
        if (err) {
            throw err
        }
    })
})

app.get('/order/:id', (req,res) => {
    Order.findById(req.params.id).then((order) => {
        if (order) {
            axios.get("http://localhost:5555/customer/"+order.CustomerID).then((response) => {
                console.log(response.data)
                var orderObject = {customerName: response.data.name, bookTitle: ""}
                axios.get("http://localhost:4545/book/"+order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title
                    res.json(orderObject)
                })
            })
        }else{
            res.send("Invalid order")
        }
    })
})

app.listen(6565, () => {
    console.log("Orders running at 6565")
})
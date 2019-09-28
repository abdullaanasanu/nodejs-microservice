const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

require("./model/Customer");
const Customer = mongoose.model("Customer")

mongoose.connect("mongodb://username:password@host:port/database?options...", { useUnifiedTopology: true,useNewUrlParser: true }, () => {
    console.log("Database connected")
})

app.get('/', (req,res) => {
    res.send("This is main end point")
})

app.post("/customer", (req,res)=> {
    var newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }

    var customer = new Customer(newCustomer)

    customer.save().then(() => {
        console.log("New customer created!")
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
    res.send("New customer added");
})

app.get("/customers", (req,res) => {
    Customer.find().then((customers) => {
        res.json(customers)
    }).catch( err => {
        if (err) {
            throw err;
        }
    })
})

app.get('/customer/:id', (req,res) => {
    Customer.findById(req.params.id).then((customer) => {
        if (customer) {
            res.json(customer)
        }else{
            res.sendStatus(404);
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})

app.delete('/customer/:id', (req,res) => {
    Customer.findByIdAndRemove(req.params.id).then(() => {
        res.send("customer removed")
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})

app.listen(5555, () => {
    console.log("customer running at 5555")
});
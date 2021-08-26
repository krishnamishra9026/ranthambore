var express = require("express");
const path = require('path');
//razor pay




var app = express();
var port = 3000;
 

 var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


//Connecting to the Database
 var mongoose = require("mongoose");
 // const uri = "mongodb+srv://krishnamishra:krishnamishra@cluster0-x012q.mongodb.net/ranthamboredb?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/ranthamboredb" ,  { useNewUrlParser: true });
// mongoose.Promise = global.Promise;mongoose.connect(uri ,  { useNewUrlParser: true });


let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


  /*var MongoClient = require('mongodb').MongoClient;  
  var url = "mongodb://localhost:27017/ranthamboredb";  
  MongoClient.connect(url, function(err, db) {  
  	if (err) throw err;  
  }); */ 

//Creating a Database Schema
var nameSchema = new mongoose.Schema({
 name: String,
 mobile: String,
 email: String,
 address: String,
 zone: String,
 date: String,
 vehicle: String,
 date_added: String,
 deleted: Boolean,
 transaction_id: String
});


var contactDetailSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    age: String,
    gender: String,
    id_proof: String,   
    idnumber: String,
  });


  var orderSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    address: String,
    zone: String,
    date: String,
    vehicle: String,
    timing: String,
    transaction_id: String,
    customer_id: String,
    date_added:Date,
  });

  var bookingPricesSchema = new mongoose.Schema({
    name: String,
    price: Number
  });

var Customer = mongoose.model("Customer", nameSchema);
var Order = mongoose.model("Order", orderSchema);
var ContactDetail = mongoose.model("ContactDetail", contactDetailSchema);
var BookingPrices = mongoose.model("booking_prices", bookingPricesSchema);

var eventSchema = new mongoose.Schema({
 date: String,
 zone: String,
 vehicle: String,
 timing: String,
 availability: Number
});

app.use('/' ,express.static(path.resolve(__dirname, '../')));

app.use('/booking', express.static(path.resolve(__dirname, '../dist')));

  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../index.html'));
    res.end();
  });

/*  app.use('/' , express.static(path.resolve(__dirname, '../dist')));
  app.use((req, res , next) => {
    res.sendFile(__dirname, '../dist' , 'index.html');
  });*/


var Event = mongoose.model("Event", eventSchema);

///Saving data to database

app.post("/checkAvilabilityByDate", (req, res, next) => {
	Event.findOne({"date": req.body.date}, function(err,obj) {  })
	.then(documents => {
    res.status(200).json({
      message: "Event fetched successfully!",
      events: documents
    });
  });
});

app.post('/saveCustomerDetails', (req, res , next) => {  
  var objectId = '';
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  var newContact =  { name: req.body.name, email: req.body.email , mobile: req.body.mobile ,  address: req.body.address , date_added: today , deleted: false };
  db.collection("Customer")
  .insertOne(newContact)
  .then(result => {
    objectId = result.insertedId;
    for (var i=0; i<req.body.booked_persons.length; i++) {
      req.body.booked_persons[i].customer_id = objectId;
    }

    var newOrder =  { customer_id: objectId, transaction_id: req.body.transaction_id, amount: req.body.amount ,  name: req.body.name, email: req.body.email , mobile: req.body.mobile ,  address: req.body.address , date: req.body.date , zone: req.body.zone ,timing: req.body.timing, vehicle: req.body.vehicle , date_added: today};
    db.collection("Order").insertOne(newOrder);

    var newContactDetail = req.body.booked_persons;
    var myData = new ContactDetail( newContactDetail);
    db.collection("ContactDetail").insertMany(newContactDetail, function(err, doc) {  
      if (err) throw err;  
      if (req.body.transaction_id != '') {

        Event.findOne({"date": req.body.date ,"timing": req.body.timing  , "vehicle": req.body.vehicle , "zone": req.body.zone}, function(err,obj) { })
        .then(documents => {
          var new_availability = documents.availability-1;

          var myquery = {"date": req.body.date ,"timing": req.body.timing  , "vehicle": req.body.vehicle , "zone": req.body.zone};
          var newvalues = { $set: {availability: new_availability} };
          Event.updateOne(myquery, newvalues, function(err, res) {
            if (err) return res.send(500, { error: err });
          });

        });

      }
      res.status(200).json({
        message: "Mail Sended successfully!",
      });
      // res.status(200).send('data saved successfully!');
    });    
  })
  .catch(err => {
    console.log(err);
    console.log('Error occurred while inserting');
    res.status(400).send("unable to save to database");
  });  
});


app.post("/sendEnquiryMail", (req, res, next) => {

  const nodemailer = require("nodemailer");  
  let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'n2rtech785612@gmail.com',
      pass: 'Temp#785612'
    }
  }); 

  const message = {
    from: 'ranthambore360@gmail.com',
    to: 'ranthambore360@gmail.com,er.krishna.mishra@gmail.com',
    subject: 'New Booking Processing!',
    html: '<p>Customer details: <br>Name: '+ req.body.name +'<br>Mobile: '+ req.body.mobile,
  };
  transport.sendMail(message, function(err, info) {
    if (info.messageId) {
      res.status(200).json({
        message: "Mail Sended successfully!",
      });
    }else{
       res.status(200).json({
        message: "Failed to Send Mail!",
      });
    } 
  });  

});



app.post("/sendEnquiryDetailMail", (req, res, next) => {

  const nodemailer = require("nodemailer");  
  let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'n2rtech785612@gmail.com',
      pass: 'Temp#785612'
    }
  }); 

  const message = {
    from: 'ranthambore360@gmail.com',
    to: 'er.krishna.mishra@gmail.com',
    subject: 'New Booking Processing!',
    html: '<p>Customer details: <br>Name: '+ req.body.name +'<br>Mobile Number: '+ req.body.mobile+'<br>Email Id: '+ req.body.email+'<br>Safari Date: '+ req.body.date+'<br>Safari Time: '+ req.body.time+'<br>Safari Zone: '+ req.body.zone+'<br>Safari Vehicle: '+ req.body.vehicle+'<br>Number of Person: '+ req.body.no_of_person,
  };
  transport.sendMail(message, function(err, info) {
    if (info.messageId) {
      res.status(200).json({
        message: "Mail Sended successfully!",
      });
    }else{
       res.status(200).json({
        message: "Failed to Send Mail!",
      });
    } 
  });  

});

app.post("/checkAvilability", (req, res, next) => {
    // console.log({"date": req.date , "vehicle": req.vehicle , "zone": req.zone , "timing": req.timing});

  // console.log({"date": req.body.date , "vehicle": req.body.vehicle , "zone": req.body.zone , "timing": req.body.timing});
	Event.findOne({"date": req.body.date ,"timing": req.body.timing  , "vehicle": req.body.vehicle , "zone": req.body.zone}, function(err,obj) { })
	.then(documents => {
    res.status(200).json({
      message: "Event fetched successfully!",
      events: documents
    });
  });
});



/* GET ALL BOOKS */
/*router.get('/', function(req, res, next) {
  Book.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});*/




app.post("/getBookingPrices", (req, res, next) => {
  //console.log({"date": req.body.date , "vehicle": req.body.vehicle , "zone": req.body.zone});
  BookingPrices.findOne({"name": req.body.name}, function(err,obj) { })
  .then(documents => {
    res.status(200).json({
      message: "Event fetched successfully!",
      events: documents
    });
  });
});




app.get("/getBookingPrices", (req, res, next) => {
  BookingPrices.find(function(err,obj) { })
  .then(documents => {
    res.status(200).json({
      message: "Data fetched successfully!",
      booking_prices: documents
    });
  });
});



app.listen(port, '172.26.11.151' , () => {
 console.log("Server listening on port " + port);
});
/*app.listen(port, () => {
 console.log("Server listening on port " + port);
});*/
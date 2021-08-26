const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/ranthamboredb';
/*const option = {
    "useNewUrlParser": true,
    "auth": { "authSource": "admin" },
    "user": "rootuser",
    "pass": "rootpass"
};
mongoose.connect(uri, option);*/

var db = mongoose.createConnection('mongodb://rootuser:rootpass@localhost/ranthamboredb', { useNewUrlParser: true });

// let db = mongoose.connection;

// db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


run().catch(error => console.log(error.stack));

async function run() {
  await mongoose.connect('mongodb://userroot:rootpass@localhost/ranthamboredb', { useNewUrlParser: true });

  // Clear the database every time. This is for the sake of example only,
  // don't do this in prod :)
  // await mongoose.connection.dropDatabase();

  const customerSchema = new mongoose.Schema({ name: String, age: Number, email: String });
  const Customer = mongoose.model('Customer', customerSchema);

  await Customer.create({ name: 'A', age: 30, email: 'a@foo.bar' });
  await Customer.create({ name: 'B', age: 28, email: 'b@foo.bar' });

  // Find all customers
  const docs = await Customer.find();
  console.log(docs);
}


var eventSchema = new mongoose.Schema({
 date: String,
 zone: String,
 vehicle: String,
 timing: String,
 availability: Number
});

  const Event = mongoose.model('Event', eventSchema);
  
Event.find({ date: '2020-01-19' }).
  then(events => {              
    console.log(events); // 'A'
    return Event.find({ name: 'B' });
  }).
  then(events => {
    console.log(events); // 'B'
  });
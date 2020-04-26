const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Password is a mandatory argument");
  return process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://danielchae:${password}@cluster0-qucek.mongodb.net/persons?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!name && !number) {
  Person.find({}).then((persons) => {
    console.log("phonbook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (!name || !number) {
  console.log("Both Name and Number must be provided");
  return process.exit(1);
} else {
  const newPerson = new Person({
    name,
    number,
  });
  newPerson.save().then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}

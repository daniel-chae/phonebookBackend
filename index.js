const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

// Create an web app
const app = express();

// Use bodyparser middleware for json parsing
app.use(express.json());

// Use static middleware to serve static files
app.use(express.static());

// Use cors middleware to prevent cors issue in frontend
app.use(cors());

// Use morgan to log reqeust status
morgan.token("request-body", (req, res) => JSON.stringify(req.body));
dotenv.config({ path: "./config.env" });
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :request-body"
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

// Handle get request to resources
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Handle get request for phonebook info
app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length}<p><p>${new Date()}</p>`
  );
});

// Handle get request to an individual resource
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Handle delete request to delete a resource
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

// Handle post request to create a resource
app.post("/api/persons/", (req, res) => {
  const newPerson = { ...req.body };
  if (!newPerson.name || !newPerson.number) {
    return res.json({ error: "Name and Number must be provided" });
  } else if (persons.find((person) => person.name === newPerson.name)) {
    return res.json({ error: "Name must be unique" });
  }
  newPerson.id = Math.floor(Math.random() * 1000000000);

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

// listen to a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

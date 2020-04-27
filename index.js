// Set environment variables
if (process.env !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './config.env' });
}

// Import external modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Import internal modules
const Person = require('./modules/person');

// Create an web app
const app = express();

// Use bodyparser middleware for json parsing
app.use(express.json());

// Use static middleware to serve static files
app.use(express.static('build'));

// Use cors middleware to prevent cors issue in frontend
app.use(cors());

// Use morgan to log reqeust status
morgan.token('request-body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body'
  )
);

// Handle get request for resources
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()));
    })
    .catch((err) => next(err));
});

// Handle get request for phonebook info
app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length}<p><p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));
});

// Handle get request for an individual resource
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// Handle delete request to delete a resource
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

// Handle post request to create a resource
app.post('/api/persons/', (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;

  const person = new Person({ name, number });
  person
    .save()
    .then((newPerson) => newPerson.toJSON())
    .then((formattedPerson) => res.json(formattedPerson))
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// Define Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.message });
  } else if (err.name === 'example') {
    res.status(400).send({ error: err.message });
  } else {
    next(err);
  }
};

// Use ErrorHandler middleware
app.use(errorHandler);

// listen to a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

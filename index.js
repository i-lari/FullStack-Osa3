const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
//app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('content', function getContent (req) {
  if(req.method === 'POST')
  return JSON.stringify(req.body)
  else return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const Person = require('./models/person')

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`<h3>Phonebook has info for ${Person.find({}).length} people </h3>
    <h3>${Date(req)}</h3>`)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT
app.listen((PORT), () => {
  console.log(`Server running on port ${PORT}`)
})

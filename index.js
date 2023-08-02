
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
//app.use(express.static('build'))

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})



app.get('/info', (req, res) => {
  res.send(`<h3>Phonebook has info for ${persons.length} people </h3>
    <h3>${Date(req)}</h3>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(a => a.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })

  } else if (body.number===undefined) {
    return response.status(400).json({ error: 'number missing'})

  } else if (persons.find(a => a.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
/*
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  } else if (persons.find(a => a.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 999999)
  }

  persons = persons.concat(person)
  response.json(person)
})
*/

const PORT = process.env.PORT
app.listen((PORT), () => {
  console.log(`Server running on port ${PORT}`)
})

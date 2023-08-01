const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())
morgan.token('content', function getContent (req) {
  if(req.method === 'POST')
  return JSON.stringify(req.body)
  else return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "apsi apina",
    "number": "666",
    "id": 5
  },
  {
    "name": "Otto Seppälä",
    "number": "41234915-15231235951",
    "id": 7
  },
  {
    "name": "foo bar ",
    "number": "123",
    "id": 8
  },
  {
    "name": "food bad ",
    "number": "321",
    "id": 9
  }
]
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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


const PORT = process.env.PORT || 3001
app.listen((PORT), () => {
  console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

// DB connection thru Mongo models
const Person = require('./models/Person')

const nrot = [{}] // delete

app.use(cors())
app.use(bodyParser.json())

app.use(morgan('tiny'))
app.use(express.static('build'))

let infoPageHtml = `<div><p>Puhelinluettelossa on ${nrot.length} henkilön tiedot.</p><p>${new Date()}</p></div>`
const updateInfoPage = () => {
  infoPageHtml = `<div><p>Puhelinluettelossa on ${nrot.length} henkilön tiedot.</p><p>${new Date()}</p></div>`
}

app.get('/info', (req, res) => {
  res.send(infoPageHtml);
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  }).catch(err => {
    next(err)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.post('/api/persons/', (req, res, next) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: 'Person name is missing!'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing!'
    })
  }
  duplicate = nrot.find(p => p.name == body.name)
  if (duplicate) {
    return res.status(400).json({
      error: `${body.name} is already in the database!`
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
    updateInfoPage()
  }).catch(err => next(err)
  )
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    }).catch(err => next(err))
})

const unknowndEndPoint = (req, res, next) => {
  res.status(404).send({ error: 'Unknown endpoint!' })
  next()
}
app.use(unknowndEndPoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'Malformed id' })
  }
  next(error) // to the default error handler of express, if not CastError
}
app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App now running on port ${PORT}`);
})



const genRandomId = () => {
  const num = Math.floor(Math.random() * 999999999)
  return num
}
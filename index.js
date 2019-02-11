const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

let nrot = [
  {
    id: 1,
    name: 'Essi Esimerkki',
    number: '0900-3525246'
  },
  {
    id: 2,
    name: 'Jane Doe',
    number: '0700-6786789'
  },
  {
    id: 3,
    name: 'John Doe',
    number: '045-3466234'
  },
  {
    id: 4,
    name: 'Pekka Elo',
    number: '040-1234567'
  }
]

let infoPageHtml = `<div><p>Puhelinluettelossa on ${nrot.length} henkilön tiedot.</p><p>${new Date()}</p></div>`
const updateInfoPage = () => {
  infoPageHtml = `<div><p>Puhelinluettelossa on ${nrot.length} henkilön tiedot.</p><p>${new Date()}</p></div>`
}

app.get('/info', (req, res) => {
  res.send(infoPageHtml);
})

app.get('/api/persons', (req, res) => {
  res.send(nrot)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = nrot.find(p => p.id === id)
  if (!person) {
    res.status(404).send('Henkilöä ei löytynyt!')
  } else {
    res.send(person)
  }
})

app.post('/api/persons/', (req, res) => {
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

  const person = {
    id: genRandomId(),
    name: body.name,
    number: body.number
  }
  nrot = nrot.concat(person)
  updateInfoPage()
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  nrot = nrot.filter(p => p.id !== id)
  updateInfoPage()
  res.status(204).end()
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App now running on port ${PORT}`);
})



const genRandomId = () => {
  const num = Math.floor(Math.random() * 999999999)
  console.log(num);
  return num
  
}
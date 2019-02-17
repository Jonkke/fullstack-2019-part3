// For testing and stuff, not used anywhere
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument!');
  process.exit(1)
}

const password = process.argv[2]

const url = '' // MongoDB url

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 3,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
  const person = new Person({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}`
  })
  person.save().then(res => {
    console.log('Person saved!');
    mongoose.connection.close()
  })
}

if (process.argv.length == 3) {
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(person);
    })
    mongoose.connection.close()
  })
}
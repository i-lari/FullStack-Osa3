const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://ilari:${password}@phonebook.mivldyu.mongodb.net/persons?retryWrites=true&w=majority`



const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})
const printPhonebook = () => {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}

person.save().then(result => {
    if (!process.argv[3]) {
        printPhonebook()
    } else {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    }
})
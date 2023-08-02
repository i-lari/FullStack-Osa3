import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Person = ({ name, number, remove }) => {
  return (
    <div>
      {name} {number}
      <button onClick={remove}>remove</button>
    </div>
  )
}

const Persons = ({ persons, filter, remove }) => {
  const filteredPersons = persons.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
  const list = filteredPersons.map(a => <Person key={a.name} name={a.name} number={a.number} remove={() => remove(a.id)} />)
  return (
    <div>{list}</div>
  )
}


const Filter = ({ filter, handler }) => {
  return (
    <div>filter shown with <input value={filter} onChange={handler} /> </div>
  )
}

const PersonForm = ({ submit, name, number, handleName, handleNumber }) => {
  return (
    <div>
      <form onSubmit={submit}>
        <div>name: <input value={name} onChange={handleName} /> </div>
        <div>number: <input value={number} onChange={handleNumber} /> </div>
        <div><button type="submit">add</button> </div>
      </form>
    </div>
  )
}

const Notification = ({ message,className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  //fetch data from server using effect hook
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log(persons)

  const addNumber = (event) => {
    if (persons.map(a => a.name).includes(newName)) {
      const person = persons.find(a => a.name == newName)
      if (window.confirm(person.name + ' is already added to phonebook, replace the old number with a new one?')) {
        event.preventDefault()
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(
            () => {
          setPersons(persons.map(a => a.id!==person.id ? a : changedPerson))
          setNewName('')
          setNewNumber('')
          setNotification('Changed '+ changedPerson.name+' phone number')
          setTimeout(()=> {
            setNotification(null)
          },5000)
          })         
          .catch(error => {
            setErrorMessage('Information of '+changedPerson.name+' was already deleted from the server')
            setTimeout(()=> {
            setErrorMessage(null)
          },5000)
            setPersons(persons.filter(n => n.id !== person.id))
          })
      }
    } else {
      event.preventDefault()
      const numberObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(numberObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
          setNewName('')
          setNewNumber('')
          setNotification('Added '+ returnedObject.name)
          setTimeout(()=> {
            setNotification(null)
          },5000)
        })
    }
  }
  const removeNumber = (id) => {
    if (window.confirm('Delete ' + persons.find(a => a.id == id).name + '?')) {
      personService
        .remove(id)
        .then(() => {
          const newPersons = persons.filter(a => a.id != id)
          const deletedPerson = persons.find(a => a.id == id)
          setPersons(newPersons)
          setNotification('Deleted '+ deletedPerson.name)
          setTimeout(()=> {
            setNotification(null)
          },5000)
        })
        .catch(error => {
          setErrorMessage('Information of '+ persons.find(a => a.id == id).name+' was already deleted from the server')
          setTimeout(()=> {
          setErrorMessage(null)
        },5000)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} className='successMessage'/>
      <Notification message={errorMessage} className='errorMessage'/>
      <Filter filter={newFilter} handler={handleFilter} />
      <h2>Add new contact</h2>
      <PersonForm
        submit={addNumber}
        name={newName}
        number={newNumber}
        handleName={handleNewName}
        handleNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} remove={removeNumber} />
    </div>
  )

}

export default App
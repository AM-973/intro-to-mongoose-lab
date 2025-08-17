const dotenv = require('dotenv')
dotenv.config()
const prompt = require('prompt-sync')({ sigint: true })
const mongoose = require('mongoose')
const customer = require('./models/customer')

const menu = `
Welcome to the CRM

What would you like to do?

  1. Create a customer
  2. View all customers
  3. Update a customer
  4. Delete a customer
  5. Quit
`
const createCustomer = async() => {
    console.log('You can create a customer here.')
    const name = prompt('Customer name:')
    const age = prompt('Customer age:')
    const newcustomer = await customer.create({ name, age })
    console.log(`
        --------------------------------------------------
        Created customer:

        Name: ${newcustomer.name}
        Age: ${newcustomer.age}

        --------------------------------------------------`)
}

const listCustomers = async() => {
    console.log(`
        Below is a list of customers:`)
    const customers = await customer.find({})
    customers.forEach(customer => {
        console.log(`
id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
    })
}

const updateCustomer = async () => {
  await listCustomers()
  const id = prompt(" Type the id of the user you'd like to update: ")
  if (!mongoose.isValidObjectId(id)) return console.log('Invalid id.')
  const updatedCustomer = await customer.findById(id)
  if (!updatedCustomer) return console.log('Customer not found.')

  const newName = prompt(`What is the new customer's new name? Name: `)
  const newAge = prompt(`What is the customer's new age? Age: `)

  if (newName !== '')  updatedCustomer.name = newName
  if (newAge !== '') updatedCustomer.age = Number(newAge)
  await updatedCustomer.save()
  console.log(`
    --------------------------------------------------
    Updated customer:

    Name: ${updatedCustomer.name}
    Age: ${updatedCustomer.age}

    --------------------------------------------------`)
}

const deleteCustomer = async() => {
    await listCustomers()
    const id = prompt("Type the id of the customer you'd like to delete:")
    if (!mongoose.isValidObjectId(id)) return console.log('Invalid id.')
    const del = prompt('Type DELETE to confirm: ')
    if (del !== 'DELETE') return console.log('request cancelled.')
    const res = await customer.findByIdAndDelete(id)
    console.log(res ? `${res} has been deleted` : 'Customer not found.')
    
}

const exit = async () => {
    console.log('exiting...')
}

const mainMenu = async() => {
    await mongoose.connect(process.env.MONGODB_URI)
    let choice = ''
    try{
        while (choice !== '5'){
            console.log(menu)
            choice = prompt('Number of action to run: ')
            if(choice === '1') await createCustomer()
                else if (choice === '2') await listCustomers()
            else if (choice === '3') await updateCustomer()
        else if (choice === '4') await deleteCustomer()
    else if (choice === '5') await exit()
else 
            console.log(
       `        |---------------------------------------------------|
        |vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv        |               
        |ERROR! You must CHOOSE a number between 1-5        |              
        |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        |              
        |---------------------------------------------------|`)
        }
    } catch(err){
        console.log(err)
    }
    finally{
        await mongoose.connection.close()
        process.exit(0)
    }
}

mainMenu()
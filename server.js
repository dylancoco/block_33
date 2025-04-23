const express = require('express')
const pg = require('pg')
const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'block_32'
})
const app = express()
app.use(express.json())
const port = 3000

app.get('/api/employees', async(req, res) => {
    const data = await client.query('SELECT * FROM employee')
    res.json(data.rows)
})

app.get('/api/departments', async(req, res) => {
    const data = await client.query('SELECT * FROM department')
    res.json(data.rows)
})

app.post('/api/employees', async(req,res) => {
    const {name, department_id} = req.body
    await client.query(`INSERT INTO employee (name, department_id) VALUES ($1, $2)`, [name, department_id])
    const data = await client.query(`SELECT * FROM employee WHERE name = $1 AND department_id = $2`, [name, department_id])
    res.json(data.rows)
})

app.delete('/api/employees/:id', async(req, res) => {
    const { id } = req.params
    await client.query(`DELETE FROM employee WHERE id = $1`, [id])
})

app.put('/api/employees/:id', async(req, res) => {
    const { id } = req.params
    const { department_id } = req.body
    await client.query(`UPDATE employee SET department_id = $1 WHERE id = $2`, [department_id, id])
    const data = await client.query(`SELECT * FROM employee WHERE id = $1 AND department_id = $2`, [id, department_id])
    res.json(data.rows)
})

app.listen(port, async() => {
    await client.connect()
    console.log(`This port is on ${port}`)
})
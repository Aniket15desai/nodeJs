const express = require('express')
const app = express()
const { users, ROLE } = require('./data')
const { authUser, authRole } = require('./auth')
const projectRouter = require('./routes/projects')
const User = require('./routes/userRoutes')

app.use(express.json())

app.use(setUser)

app.use('/projects', projectRouter)

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/dashboard', authUser, (req, res) => {
  const { email } = req.body
  if(email){
    res.send('Dashboard Page') 
  }
})

app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('Admin Page')
})

function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}

app.use('/', User)

app.listen(5000)
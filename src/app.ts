import { authorizeUser } from './authorizeUser'
import { getAdminToken } from './getAdminToken'
import express, { Router } from 'express'
import { checkUserExists } from './checkUserExists'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()
router.get('/', (req, res) => {
  res.send('Hello')
})
router.post('/login', getAdminToken, checkUserExists, authorizeUser)

const app = express()
// support parsing of application/json type post data
app.use(bodyParser.json())

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

app.listen(5000, () => {
  console.log('server listening on 5000')
})

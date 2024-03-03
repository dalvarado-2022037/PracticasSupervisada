import { Router } from 'express'
import { deleteUser, login, registrer, registrerAdmin, testUser, update } from './User.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/testUser', testUser)
api.post('/registrerAdmin', [validateJwt], registrerAdmin)
api.post('/registrer', registrer)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], update)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)

export default api
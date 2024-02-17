import { Router } from 'express'
import { addCurso, deleteCurso, lookForAllCursos, testCuso, unirseCurso, updateCurso } from './Curso.controller.js'
import { isStudent, isTeacher, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/testCurso', testCuso)
api.post('/addCurso', [validateJwt, isTeacher], addCurso)
api.get('/lookForAllCursos', [validateJwt], lookForAllCursos)
api.put('/updateCurso/:id', [validateJwt, isTeacher],updateCurso)
api.delete('/deleteCurso/:id', [validateJwt, isTeacher],deleteCurso)
api.put('/unirseCurso/:id', [validateJwt, isStudent], unirseCurso)

export default api
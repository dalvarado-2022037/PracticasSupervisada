
import Curso from './Curso.model.js'

export const testCuso = (req,res)=>{
    return res.send('Conecto con Cursos')
}

export const addCurso = async(req, res)=>{
    try{
        let { uid } = req.user
        let data = req.body
        let { role } = req.user
        
        if(role == 'STUDENT_ROLE') 
            return res.status(401).send({message: 'You do not have authorization'})
        if(data.teacher != uid) 
            return res.status(401).send({message: 'You do not have authorization'})

        let curso = new Curso(data)
        await curso.save()
        return res.send({message: 'Course successfully added'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error course could not be added',err})
    }
}

export const lookForAllCursos = async(req, res)=>{
    try{
        let { uid, role } = req.user
        let curs

        if(role == 'TEACHER_ROLE')
            curs = await Curso.find({teacher: uid})
        else if(role == 'STUDENT_ROLE')
            curs = await Curso.find({students: uid})

        return res.send({message: curs})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const updateCurso = async(req, res)=>{
    try{
       let { id } = req.params
       let cursoData = await Curso.findOne({_id:id})
       let { uid } = req.user
       if(cursoData.teacher != uid) return res.status(403).send({message: 'You do not have authorization to modify the course'})
       let data = req.body
       let updatedCurso = await Curso.findOneAndUpdate(
        {_id: id},
        data,
        {new: true})
        if(!updateCurso) return res.status(401).send({message: 'The course could not be updated'}) 
        return res.send({message: 'Updated course', updatedCurso})
    }catch(error){
        console.error(err)
        return res.status(404).send({message: 'Unexpected error while updating'})
    }
}

export const deleteCurso = async(req,res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params
        let cursoData = await Curso.findOne({_id:id})
        if(!cursoData) return res.status(404).send({message: 'Course not found'})
        if(cursoData.teacher != uid) return res.status(403).send({message: 'You do not have authorization to modify the course'})
        let deleteCur = await Curso.findOneAndDelete({_id: id})
        if(!deleteCur) return res.status(404).send({message: 'The course could not be deleted'})
        return res.send({message: `The course: ${deleteCur.name} has been successfully removed`})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Unexpected error while deleting'})
    }
}

export const unirseCurso = async (req, res) => {
    try {
        //Obtenemos los id para las busquedas
        let { id, role } = req.params
        let { uid } = req.user
        //Buscamos en cuales cursos esta el estudiante
        let cursoStudent = await Curso.find({ students: uid })
        //Buscamos el curso que quiere unirse
        let curso = await Curso.findOne({_id:id})
        //Validamos si el curso existe
        if(!curso) return res.status(404).send({ message: 'Course not found' })
        if(role == 'TEACHER_ROLE') return res.status(403).send({ message: 'You are a teacher you cannot join classes' })
        //Validamos si el curso ya tiene a este estudiante o todavia no (Si ya esta sera true, entonces lo denegamos con el !)
        if(curso.students && !(curso.students.includes(uid))) {
            //Validamos cuantos cursos tiene este estudiante
            if (cursoStudent.length < 3) {
                //Lo agregamos al arreglo
                curso.students.push(uid)
                //Lo guardamos
                await curso.save()
                //La respuesta
                return res.send({ message: 'You have successfully joined' })
            }
            return res.send({ message: 'It is not possible to join more courses' })
        }
        return res.status(400).send({ message: 'You are already enrolled in this course' })
    } catch (err) {
        console.error(err)
        return res.status(404).send({ message: 'Unexpected error when adding' })
    }
}
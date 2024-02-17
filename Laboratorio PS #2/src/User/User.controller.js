import User from './User.model.js'
import { checkPassword, encrypt, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const testUser = (req,res)=>{
    return res.send('Conecto con Usuarios')
}

export const teacher = async(req, res)=>{
    try{
        let existe = await User.findOne({username:'dalvarado'})
        if(!existe){
            let data = {
                name: 'Douglas',
                username: 'dalvarado',
                gmail: 'dalvarado@gmail.com',
                password: '12345678',
                role: 'TEACHER_ROLE',
            }
        data.password = await encrypt(data.password)
        let user = new User(data)
            await user.save()
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error course could not be added',err})
    }
}

export const registrerAdmin = async(req, res)=>{
    try{
        let data = req.body
        let { password, username} = req.user
        if(username == 'dalvarado' && await checkPassword('12345678', password)){
            let userName = await User.findOne({username:data.username})
            if(userName) return res.status(406).send({message: 'Username already used'})
            data.password = await encrypt(data.password)
            data.role = 'TEACHER_ROLE'
            let user = new User(data)
            user.save()
            return res.send({message: 'Course successfully added'})
        }
        return res.status(401).send({message: 'You do not have an authorization of this rank'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error course could not be added',err})
    }
}

export const registrer = async(req, res)=>{
    try{
        let data = req.body
        let userName = await User.findOne({username:data.username})
        if(userName) return res.status(406).send({message: 'Username already used'})
        data.password = await encrypt(data.password)
        data.role = 'STUDENT_ROLE'
        let user = new User(data)
        user.save()
        return res.send({message: 'Course successfully added'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error course could not be added',err})
    }
}

export const login = async(req,res)=>{
    try {
        let { username, password} = req.body
        let user = await User.findOne({username})
        if(user && await checkPassword(password, user.password)){
            let loggerdUser = {
                uid: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggerdUser)
            return res.send({message: `Welcome ${user.name}`,loggerdUser,token})
        }
        return res.status(401).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Failed to login'})   
    }
}

export const update = async(req, res)=>{
    try{
        let { id } = req.params
        let { uid, role } = req.user
        let data = req.body
        if(role == 'STUDENT_ROLE')
            if(id!=uid) 
                return res.status(403).send({message: 'You cannot alter this users information.'})
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteUser = async(req,res)=>{
    try{
        let { id } = req.params
        let { uid, role } = req.user
        if(role == 'STUDENT_ROLE')
            if(!(id==uid))
                return res.status(403).send({message: 'You cannot alter this users information.'})
        let deletedUser = await User.findOneAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'Account not foud and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

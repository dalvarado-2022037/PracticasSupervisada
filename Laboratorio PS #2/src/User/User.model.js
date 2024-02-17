import { Schema, model} from 'mongoose'

export const userSchema = Schema({
    name:{
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        requerid: true
    },
    gmail: {
        type: String,
        requerid: true
    },
    password: {
        type: String,
        requerid: true,
        miniLength: [8, 'Password must be 8 characters']
    },
    role: {
        type: String,
        requerid: true,
        uppercase: true,
        enum: ['TEACHER_ROLE','STUDENT_ROLE']
    }
})

export default model('user',userSchema)
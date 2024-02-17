import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { teacher } from './src/User/User.controller.js'

initServer()
connect()
teacher()
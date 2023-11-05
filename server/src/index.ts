import express, { Express } from 'express'
import { createServer, Server as HttpServer } from 'http'
import cors from 'cors'
import loadEnv from './security/env.security'
import { appWs } from './ws/app.ws'
import { messageNotification } from './utils/messageNotification.utils'

const appResult = () => {
  const app: Express = express()
  const server: HttpServer = createServer(app)
  app.use(express.json())
  app.use(cors())
  appWs(server)
  server.listen(loadEnv.output.PORT, () => {
    console.log(messageNotification(`Server is listening on port ${loadEnv.output.PORT}`))
  })
}

Promise.all([appResult()])

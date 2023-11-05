import { WebSocket } from 'ws'
import testerDatabase from '~/services/database/tester.database'

class HandleQuizConnection {
  public result = (ws: WebSocket) => {
    console.log('Quiz Client connected')

    const userData = async () => {
      ws.send(JSON.stringify(await testerDatabase.getCollection('quizs').find().toArray()))
    }
    userData()

    ws.on('message', (message) => {
      //
    })

    ws.on('open', () => {
      ws.send('something')
    })

    ws.on('error', () => {
      console.error
    })

    ws.on('close', () => {
      console.log('Quiz Client disconnected')
    })
  }
}
const handleQuizConnection = new HandleQuizConnection()
export default handleQuizConnection

import { WebSocketServer } from 'ws'
import { Server } from 'http'
import { parse } from 'url'
import handleQuizConnection from './handle_quiz.ws'

export const appWs = (server: Server) => {
  const wssQuiz = new WebSocketServer({ noServer: true }).on('connection', handleQuizConnection.result)
  server.on('upgrade', (request, socket, head) => {
    parse(request.url as string).pathname === '/quiz'
      ? wssQuiz.handleUpgrade(request, socket, head, (ws) => {
          wssQuiz.emit('connection', ws, request)
        })
      : socket.destroy()
  })
}

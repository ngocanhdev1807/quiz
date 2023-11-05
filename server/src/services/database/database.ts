import { Collection, Db, MongoClient } from 'mongodb'
import now from 'performance-now'
import Quiz from '~/models/schemas/Quiz.schema'
import loadEnv from '~/security/env.security'
import uriConnectDatabase from '~/security/uri_connect_database.security'
import logger from '~/utils/logger.utils'
import { messageNotification } from '~/utils/messageNotification.utils'

interface Collections_Quiz_Input_Type {
  quizs: string
}

interface Collections_Quiz_Output_Type {
  quizs: string
}

export interface Collections_Quiz_Type {
  quizs: Quiz
}

/////////////////////////// quizData
class QuizDatabase {
  private client: MongoClient
  private db: Db
  private collections: Collections_Quiz_Output_Type
  private log: boolean
  constructor({
    uri,
    dbName,
    collections,
    log = false
  }: {
    uri: string
    dbName: string
    collections: Collections_Quiz_Input_Type
    log: boolean
  }) {
    this.client = new MongoClient(uri)
    this.db = this.client.db(dbName)
    this.collections = collections
    this.log = log
    this.connect()
  }

  private connect = async () => {
    try {
      const start = now() // Bắt đầu đo thời gian
      await this.db.command({ ping: 1 })
      const end = now() // Kết thúc đo thời gian
      const executionTime = end - start // Tính thời gian thực hiện
      if (this.log) {
        logger.logAsync(
          `Pinged your deployment. You successfully connected to MongoDB! Thời gian thực hiện: ${executionTime} milliseconds`
        )
      } else {
        console.log(
          messageNotification(`Successfully connected to the database. Execution time: ${executionTime} milliseconds`)
        )
      }
    } catch (error) {
      if (this.log) {
        logger.logAsync('Error')
      } else {
        console.log(messageNotification('Error'))
      }
      throw error
    }
  }

  public getCollection = <T extends keyof Collections_Quiz_Type>(name: T): Collection<Collections_Quiz_Type[T]> => {
    if (!this.collections[name]) {
      throw new Error(`Collection name ${name} is not defined in collections object.`)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.db.collection<Collections_Quiz_Type[T]>(this.collections[name]!)
  }
}

const quizDatabase = new QuizDatabase({
  uri: uriConnectDatabase.uri,
  dbName: loadEnv.output.DB_NAME,
  collections: {
    quizs: loadEnv.output.DB_QUIZS_COLLECTION
  },
  log: false
})
export default quizDatabase

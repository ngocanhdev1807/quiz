import dotenv from 'dotenv'
import minimist from 'minimist'

interface Output {
  PORT: string
  HOST: string
  DB_NAME: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_QUIZS_COLLECTION: string
}

class LoadEnv {
  public output: Output
  constructor() {
    const getEnvFile = () => {
      switch (minimist(process.argv.slice(2)).env) {
        case 'production':
          return '.env.production'
        case 'staging':
          return '.env.staging'
        case 'development':
          return '.env.development'
        default:
          return '.env'
      }
    }
    const _output = dotenv.config({ path: getEnvFile() })
    if (_output.error) {
      throw _output.error
    }
    this.output = _output.parsed as {
      PORT: string
      HOST: string
      DB_NAME: string
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_QUIZS_COLLECTION: string
    }
  }

  // check: Nếu --env= production thì là true
  public isProduction = minimist(process.argv.slice(2)).env === 'production'
}
const loadEnv = new LoadEnv()
export default loadEnv

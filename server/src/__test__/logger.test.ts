import logger from '~/utils/logger.utils'

describe('Logger', () => {
  test('logAsync should log asynchronously', async () => {
    const message = 'Test log message'
    await logger.logAsync(message)
  })

  test('logSync should log synchronously', () => {
    const message = 'Test log message'
    logger.logSync(message)
  })

  test('addFile should create and write to a log file', () => {
    jest.mock('./file.utils', () => ({
      createAndWriteFileUpdate: jest.fn()
    }))

    logger.addFile()
  })
})

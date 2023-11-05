import encoded_decoded_jwt from '~/utils/jwt.utils'
import jwt from 'jsonwebtoken'

///////////////////
describe('Encoded_decoded_jwt', () => {
  const secretKey = 'yourSecretKey'

  describe('encoded method', () => {
    test('it should encode a payload into a JWT token', async () => {
      const payload = { name: 'admin', iat: 1234567890, exp: 1234567899 }
      const options = { algorithm: 'HS256' } as jwt.SignOptions

      const result = await encoded_decoded_jwt.encoded({ payload, secretKey, options })

      // You might want to validate the structure or decode the token to verify it
      expect(typeof result).toBe('string')
    })
  })

  describe('decoded method', () => {
    test('it should decode a JWT token and provide additional information', async () => {
      const token = 'yourEncodedToken'

      const result = await encoded_decoded_jwt.decoded({ token, secretKey })

      // Validate the structure of the result or specific properties
      expect(result).toHaveProperty('iat_convert')
      expect(result).toHaveProperty('exp_convert')
      expect(result).toHaveProperty('calculateDate')
    })
  })
})

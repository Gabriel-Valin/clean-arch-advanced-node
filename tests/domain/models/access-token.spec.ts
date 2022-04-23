import { AccessToken } from "@/domain/models"

describe('AccessToken', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value' })
  })

  it('should returns expiresIn equal 1800000 m/s', () => {
    const sut = AccessToken.expiresIn
    expect(sut).toBe(1800000)
  })
})

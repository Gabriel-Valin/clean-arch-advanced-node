import { LoadFacebookUser, LoadFacebookUserByTokenApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"

class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string
  result = undefined

  async loadUser (params: LoadFacebookUserByTokenApi.Params): Promise<LoadFacebookUserByTokenApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
 it("should call facebook api called with correct param", async () => {
   const loadFacebookUserByTokenApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.token).toBe('any_token')
 })

 it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
  const loadFacebookUserApi = new LoadFacebookUserApiSpy()
  loadFacebookUserApi.result = undefined
  const sut = new FacebookAuthenticationService(loadFacebookUserApi)
  const authResult = await sut.perform({ token: 'any_token' })
  expect(authResult).toEqual(new AuthenticationError())
  })
})

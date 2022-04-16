import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser
   ) {}
  async perform (params: FacebookAuthentication.Params): Promise< AuthenticationError> {
    await this.loadFacebookUser.loadUser(params)
    return new AuthenticationError()
  }
}

interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<void>
}

namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

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

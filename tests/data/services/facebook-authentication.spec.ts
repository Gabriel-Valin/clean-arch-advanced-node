import { FacebookAuthentication } from "@/domain/features"

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser
   ) {}
  async perform (params: FacebookAuthentication.Params): Promise< void> {
    await this.loadFacebookUser.loadUser(params)
  }
}

interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<void>
}

namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string
  async loadUser (params: LoadFacebookUserByTokenApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationService', () => {
 it("should call facebook api called with correct param", async () => {
   const loadFacebookUserByTokenApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserByTokenApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserByTokenApi.token).toBe('any_token')
 })
})

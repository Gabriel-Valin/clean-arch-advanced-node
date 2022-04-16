import { LoadFacebookUser } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { AuthenticationError } from "@/domain/errors"
import { mock } from "jest-mock-extended"

describe('FacebookAuthenticationService', () => {
  it("should call facebook api called with correct param", async () => {
    const loadFacebookUserApi = mock<LoadFacebookUser>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUser>()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})

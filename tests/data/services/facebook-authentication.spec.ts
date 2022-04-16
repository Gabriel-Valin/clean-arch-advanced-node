import { LoadFacebookUser } from "@/data/contracts/apis"
import { LoadUserAccountRepository } from "@/data/contracts/repositories"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { AuthenticationError } from "@/domain/errors"
import { mock, MockProxy } from "jest-mock-extended"

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: MockProxy<LoadFacebookUser>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>

  const mockToken = { token: 'any_token' }
  const mockFacebookEmail = { email: 'fb@email.com' }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepo = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'fb@email.com',
      facebookId: 'any_facebook_name'
    })
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo)
  })

  it("should call facebook api called with correct param", async () => {
    await sut.perform(mockToken)

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(mockToken)
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform(mockToken)

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform(mockToken)

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith(mockFacebookEmail)
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})

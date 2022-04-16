import { LoadFacebookUser } from "@/data/contracts/apis"
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repositories"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { AuthenticationError } from "@/domain/errors"
import { mock, MockProxy } from "jest-mock-extended"

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: MockProxy<LoadFacebookUser>
  let userAccountRepo: MockProxy<CreateFacebookAccountRepository & LoadUserAccountRepository>

  const mockToken = { token: 'any_token' }
  const mockFacebookEmail = { email: 'fb@email.com' }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    userAccountRepo = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'fb@email.com',
      facebookId: 'any_facebook_name'
    })
    sut = new FacebookAuthenticationService(loadFacebookUserApi, userAccountRepo)
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

    expect(userAccountRepo.load).toHaveBeenCalledWith(mockFacebookEmail)
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountlRepo when LoadUserByEmailRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform(mockToken)

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'fb@email.com',
      facebookId: 'any_facebook_name'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})

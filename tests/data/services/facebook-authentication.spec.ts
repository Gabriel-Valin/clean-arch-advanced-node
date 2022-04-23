process.env.DISABLE_MOCKED_WARNING="true"

import { LoadFacebookUser } from "@/data/contracts/apis"
import { TokenGenerator } from "@/data/contracts/cryptography"
import { SaveFacebookAccountRepository, LoadUserAccountRepository} from "@/data/contracts/repositories"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { AuthenticationError } from "@/domain/errors"
import { AccessToken, FacebookAccount } from "@/domain/models"
import { mock, MockProxy } from "jest-mock-extended"
import { mocked } from 'ts-jest/utils'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: MockProxy<LoadFacebookUser>
  let cryptography: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<SaveFacebookAccountRepository & LoadUserAccountRepository>

  const mockToken = { token: 'any_token' }
  const mockFacebookEmail = { email: 'fb@email.com' }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    userAccountRepo = mock()
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'fb@email.com',
      facebookId: 'any_facebook_id'
    })
    cryptography = mock()
    cryptography.generateToken.mockResolvedValue('any_generate_token')
    sut = new FacebookAuthenticationService(loadFacebookUserApi, userAccountRepo, cryptography)
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({empty: "object"}))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.perform(mockToken)

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({empty: "object"})
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct param', async () => {
    await sut.perform(mockToken)

    expect(cryptography.generateToken).toHaveBeenCalledWith({
      key: "any_account_id",
      expirationInMs: AccessToken.expiresIn
    })
    expect(cryptography.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should returns an AccessToken on a success', async () => {
    const authResult = await sut.perform(mockToken)

    expect(authResult).toEqual(new AccessToken('any_generate_token'))
  })
})

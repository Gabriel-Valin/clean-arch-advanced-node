import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories"
import { AccessToken, FacebookAccount } from "@/domain/models"
import { TokenGenerator } from "../contracts/cryptography"

export class FacebookAuthenticationService implements FacebookAuthentication{
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly cryptography: TokenGenerator,
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.loadFacebookUser.loadUser(params)
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookUserData.email })
      const facebookAccount = new FacebookAccount(facebookUserData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
      const token = await this.cryptography.generateToken({ key: id, expirationInMs: AccessToken.expiresIn })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}

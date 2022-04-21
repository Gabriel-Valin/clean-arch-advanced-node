import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories"
import { FacebookAccount } from "@/domain/models"

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUser.loadUser(params)
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookUserData.email })
      const facebookAccount = new FacebookAccount(facebookUserData, accountData)
      await this.userAccountRepo.saveWithFacebook(facebookAccount)
    }
    return new AuthenticationError()
  }
}

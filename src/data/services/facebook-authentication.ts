import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories"

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUser.loadUser(params)
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookUserData.email })
      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? facebookUserData.name,
        email: facebookUserData.email,
        facebookId: facebookUserData.facebookId
      })
    }
    return new AuthenticationError()
  }
}

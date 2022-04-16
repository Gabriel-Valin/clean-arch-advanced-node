import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repositories"

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository,
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUser.loadUser(params)
    if (facebookUserData !== undefined) {
      await this.userAccountRepo.load({ email: facebookUserData.email })
      await this.userAccountRepo.createFromFacebook(facebookUserData)
    }
    return new AuthenticationError()
  }
}

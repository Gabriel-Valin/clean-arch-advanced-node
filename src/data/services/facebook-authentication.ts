import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"
import { LoadUserAccountRepository } from "../contracts/repositories"

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser,
    private readonly loadFacebookUserApi: LoadUserAccountRepository
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUser.loadUser(params)
    if (facebookUserData !== undefined) {
      await this.loadFacebookUserApi.load({ email: facebookUserData.email })
    }
    return new AuthenticationError()
  }
}

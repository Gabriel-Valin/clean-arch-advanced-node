import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUser } from "@/data/contracts/apis"

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUser: LoadFacebookUser
  ) {}
  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUser.loadUser(params)
    return new AuthenticationError()
  }
}

import { TokenGenerator } from "@/data/contracts/cryptography"
import jwt from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor(private readonly secret: string) {}
  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }
}

export class AccessToken  {
  constructor (private readonly value: string) {}

  static get expiresIn(): number {
    return 30 * 60 * 1000
  }
}

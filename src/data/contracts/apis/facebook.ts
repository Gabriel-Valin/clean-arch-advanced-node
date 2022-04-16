export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<LoadFacebookUserByTokenApi.Result>
}

export namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    facebookId: string
    name: string
    email: string
  }
}

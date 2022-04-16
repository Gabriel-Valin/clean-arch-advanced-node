export interface LoadFacebookUser {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<void>
}

export namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

import { FacebookApi } from '@/data/infra/apis'
import { HttpGetClient } from '@/data/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let client_id: string
  let client_secret: string
  let httpClient: MockProxy<HttpGetClient>
  let sut: FacebookApi

  beforeAll(() => {
    client_id = 'any_client_id',
    client_secret = 'any_client_secret',
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, client_id, client_secret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect (httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id,
        client_secret,
        grant_type: 'client_credentials'
      }
    })
  })
})

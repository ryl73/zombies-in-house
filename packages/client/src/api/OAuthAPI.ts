import apiYandex from './APIYandex'

export type OAuthServiceIdResponse = {
  service_id: string
}

export const getYandexServiceId = (
  redirectUri: string
): Promise<OAuthServiceIdResponse> => {
  return apiYandex
    .get<OAuthServiceIdResponse>(
      `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
    )
    .then(response => response.data)
}

export const signInWithYandex = (
  code: string,
  redirectUri: string
): Promise<void> => {
  return apiYandex.post('/oauth/yandex', { code, redirect_uri: redirectUri })
}

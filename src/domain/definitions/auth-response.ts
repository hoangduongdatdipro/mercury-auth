import { IJwtTokenResponse } from '../services'
import { IAuthUserEntityForResponse } from './auth-user'

export interface IAuthResponse {
  user: IAuthUserEntityForResponse
  token: IJwtTokenResponse
}

export interface IRefreshTokenAuthResponse {
  user: IAuthUserEntityForResponse
  token: Omit<IJwtTokenResponse, 'refreshToken'>
}

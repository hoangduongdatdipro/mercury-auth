import { UnauthorizedException } from '@nestjs/common'
import { catchError, lastValueFrom, of, tap } from 'rxjs'
import {
  createTestingModule,
  defaultAuthDefinitionsFixture,
} from '../../../__tests__/helpers'
import { AuthDto } from '../../dtos'
import { LocalLoginAction } from '../local-login.action'

describe('LocalLoginAction', () => {
  let action: LocalLoginAction

  const correctUserInfo: AuthDto = {
    username: 'sample-user@gmail.com',
    password: 'testLogin@12345',
  }

  const correctUserInfoImpersonate: AuthDto = {
    username: 'AUTH_IMPERSONATE_CIPHERsample-user@gmail.com',
    password: 'AUTH_IMPERSONATE_PASSWORD',
  }

  const invalidUserInfo: AuthDto = {
    username: 'sample-user@gmail.com',
    password: 'testLogin@12345-invalid',
  }

  beforeAll(async () => {
    const app = await createTestingModule(defaultAuthDefinitionsFixture())

    action = app.get(LocalLoginAction)
  })

  it('LocalLoginAction should be defined', () => {
    expect(action).toBeDefined()
  })

  it('should able to login using username/password', async function () {
    await lastValueFrom(
      action.handle(correctUserInfo).pipe(
        tap((res) => {
          expect(res.username).toEqual(correctUserInfo.username)
        })
      )
    )
  })

  it('should able to login using impersonate', async function () {
    await lastValueFrom(
      action.handle(correctUserInfoImpersonate).pipe(
        tap((res) => {
          expect(res.username).toEqual(correctUserInfo.username)
        })
      )
    )
  })

  it('should throw error if invalid credentials', async function () {
    await lastValueFrom(
      action.handle(invalidUserInfo).pipe(
        catchError((error) => {
          expect(error).toBeInstanceOf(UnauthorizedException)
          return of(undefined)
        })
      )
    )
  })
})
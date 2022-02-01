import { Request, Response } from 'express'
import axios, { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'

export interface AuthDetails {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  id_token: string
  'not-before-policy': number
  session_state: string
  scope: string
}

export const authorizeUser = async (req: Request, res: Response) => {
  try {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      grant_type: 'password',
      client_secret: process.env.CLIENT_SECRET,
      scope: 'openid',
      username: req.body.username,
      password: req.body.password,
    })
    const config = {
      method: 'post',
      url: `http://localhost:8080/auth/realms/${process.env.REALM_NAME}/protocol/openid-connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    } as AxiosRequestConfig

    const tokenResponse = await axios(config)

    return res.status(200).json({
      success: true,
      authDetails: tokenResponse.data,
      userDetails: req.userDetails,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
      message: ' authorization failed',
      error: e,
    })
  }
}

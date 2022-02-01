import { AuthDetails } from './authorizeUser'
import { Request, Response, NextFunction } from 'express'
import axios, { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'
import { User } from './checkUserExists'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      userDetails: User
      adminToken: string
    }
  }
}

export const getAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      grant_type: 'password',
      client_secret: process.env.CLIENT_SECRET,
      scope: 'openid',
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
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

    req.adminToken = tokenResponse.data.access_token as string
    next()

    // return res.status(200).json({success: true})
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
      message: 'verification failed',
      error: e,
    })
  }
}

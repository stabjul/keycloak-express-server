import { Request, Response } from 'express'
import axios, { AxiosRequestConfig } from 'axios'
import * as qs from 'qs'

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const data = qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: req.body.refresh_token,
    })
    const config = {
      method: 'post',
      url: `http://localhost:8080/auth/realms/${process.env.REALM_NAME}/protocol/openid-connect/logout`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Bearer ${req.headers.authorization}`,
      },
      data: data,
    } as AxiosRequestConfig

    await axios(config)
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
      message: 'logout failed',
      error: e,
    })
  }
}

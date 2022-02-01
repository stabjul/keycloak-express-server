import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

export interface User {
  id: string
  createdTimestamp: number
  username: string
  enabled: boolean
  totp: boolean
  emailVerified: boolean
  firstName: string
  lastName: string
  email: string
  disableableCredentialTypes: string[]
  requiredActions: string[]
  notBefore: number
  access: {
    manageGroupMembership: boolean
    view: boolean
    mapRoles: boolean
    impersonate: boolean
    manage: boolean
  }
}

export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkUserResponse = await axios.get(
      `http://localhost:8080/auth/admin/realms/${process.env.REALM_NAME}/users?username=${req.body.username}`,
      {
        headers: {
          authorization: `Bearer ${req.adminToken}`,
        },
      }
    )
    if (checkUserResponse.data.length === 0) {
      return res.status(404).json({ success: false, message: 'user not found' })
    }
    req.userDetails = checkUserResponse.data[0]

    next()
    // return res.status(200).json({ success: true, message: "user found" });
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
      message: 'user verification failed',
      error: e,
    })
  }
}

import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

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

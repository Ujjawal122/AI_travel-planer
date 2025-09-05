import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_KEY || "supersecretkey" 

type JwtPayload = {
  id: string
  email?: string
}

export function verifyToken(payload: JwtPayload, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    ...options,
  })
}

export function verifyJwt(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

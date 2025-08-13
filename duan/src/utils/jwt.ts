import { sign, verify, Secret, SignOptions, JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'



export const signToken = ({
  payload,
  privateKey  
  ,
  options = { algorithm: 'HS256',expiresIn: '1h' }
}: {
  payload: string | object | Buffer
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    sign(payload, privateKey, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey
}: {
  token: string
  secretOrPublicKey: string
})=> {
  return new Promise<JwtPayload>((resolve, reject) => {
    verify(token,  secretOrPublicKey, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

export const verifyTokens = (tokens: string[]) => {
  return Promise.all(tokens.map((token) => verifyToken({
    token,
    secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN!,
  })))
}

export enum UserVerifyStatus {
  // chưa xác thực email
  Unverified,
  // đã xác thực email
  Verified,
  // đã bị khóa
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
  }
export enum TweetAudience {
    Everyone, // 0
    TwitterCircle // 1
}
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

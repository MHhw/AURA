export type SocialType = 'LOCAL' | 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE' | 'UNKNOWN'

export type AuthUser = {
  id: number
  email: string
  name: string
  profileImageUrl: string | null
  socialType: SocialType
}

export type AuthResponse = {
  user: AuthUser
  tokens?: {
    tokenType: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
  }
}

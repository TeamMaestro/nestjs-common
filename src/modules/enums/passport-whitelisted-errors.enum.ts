export enum PassportWhitelistedErrors {
    NoAuthToken = 'No auth token',
    JwtExpired = 'jwt expired',
    JwtNotActive = 'jwt not active',
    InvalidSignature = 'invalid signature',
    MaxAgeExceeded = 'maxAge exceeded',
    JwtMalformed = 'jwt malformed',
    UnexpectedToken = 'Unexpected token',
    InvalidToken = 'invalid token'
}

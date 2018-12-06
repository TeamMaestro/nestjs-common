# nestjs-common
In this repo you will find a lot of the base shared code that we will user throughout all of our NestJS projects. Some of these common modules that we have bundled are:
 - TryCatch Decorators
 - HTTP Filters
 - Authentication Gaurds
 - Common Exceptions
 - Error Handling Service
 - Pagination Classes
 - Validation Pipes
 - Redis Service

### Installation
```
npm i @teamhive/nestjs-common
```

From there just add whatever you want to import into your Core/Common Modules

### Peer Dependencies
There are several peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```
npm i @nestjs/common@^5.0 @nestjs/core@^5.0 @nestjs/testing@^5.0 class-validator@~0.9.0 config@^3.0 js-yaml@^3.0 log4js@^3.0 raven@^2.0 reflect-metadata@^0.1 rxjs@^6.0
```

### Dev Dependencies
There are also a few dev dependencies that you may want to add in order for typescript to compile correctly:

```
npm i --save-dev @types/config @types/raven
```

### Configurations
There are several configurations that we use throughout our projects. Some of them are required by this package. Here is what you should add into the default config file (https://www.npmjs.com/package/config)

```
port: 8080

apiPrefix: '/api'

raven:
    dsn: 'htttps://logger.sentry.io/31'

session:
    accessExpiration: 86400000 # ms - 24 hour
    accessCookie:
        name: 'access_token'
        options:
            httpOnly: true
            maxAge: 86400000 # ms - 24 hour
            secure: true

passport:
    verifyUser: 'verify-user'
    verifySso: 'verify-sso'

logger:
    level: 'debug'

redis:
    host: 'localhost'
    keyPrefix: 'app_name_'
    expiration: 86400000 # ms - 24 hours
```

### Available Modules


### Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_
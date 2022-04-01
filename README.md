# nestjs-common

In this repo you will find a lot of the base shared code that we will user throughout all of our NestJS projects. Some of these common modules that we have bundled are:

-   TryCatch Decorators
-   HTTP Filters
-   Authentication Guards
-   Common Exceptions
-   Error Handling Service
-   Pagination Classes
-   Validation Pipes
-   Redis Service

## Breaking change for v20.0.0

We are flipping the `Pagination` constructor so that you can utilize this class directly with NestJs `@Query()` instead of requiring you create a class every time.

## Installation

```sh
npm i @teammaestro/nestjs-common
```

From there just add whatever you want to import into your Core/Common Modules

## Peer Dependencies

There are several peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```sh
npm i @nestjs/common@^7.0 @nestjs/core@^7.0 @nestjs/passport@^7.0 @nestjs/testing@^7.0 @nestjs/microservices@^7.0 @nestjs/swagger class-validator@^0.12.2 config@^3.2 js-yaml@^3.0 log4js@^6.2 passport@^0.4 reflect-metadata@^0.1 rxjs@^6.5
```

## Dev Dependencies

There are also a few dev dependencies that you may want to add in order for typescript to compile correctly:

```sh
npm i --save-dev @types/config @types/raven
```

## Configurations

There are several configurations that we use throughout our projects. Some of them are required by this package. Here is what you should add into the default config file (https://www.npmjs.com/package/config)

```yml
application:
    name: AppName
    port: 8080
    apiPrefix: '/api'

raven:
    dsn: 'https://logger.sentry.io/31'

authentication:
   jwt:
        accessExpiration: 28800 # 8 hours
        refreshExpiration: 2592000 # 1 month
    session:
        accessCookie:
            name: 'access_token'
            options:
                httpOnly: true
                expires: false
                secure: true
                maxAge: 28800000 # 8 hours
        refreshCookie:
            name: 'refresh_token'
            options:
                httpOnly: true
                expires: false
                secure: true
logger:
    appenders:
        out:
            type: stdout
    categories:
        default:
            appenders:
                -   out
            level: error
        sql:
            appenders:
                -   out
            level: error

redis:
    host: 'localhost'
    keyPrefix: 'app_name_'
    expiration: 86400000 # ms - 24 hours
```

## Available Modules

### Decorators

There are a few different decorators that we have made available:

#### @TryCatch(error: Error, options?: { customResponseMessage: string } )

This decorator will wrap your whole function into a try/catch and you can pass an optional custom error class for it to throw! Errors that are thrown
that extend this package's BaseException are not re-wrapped.

```ts
    @TryCatch(SqlException)
    async fetchAll() {
        return await this.usersRepository.fetchAll()
    }
```

#### @QueryUser()

This decorator will pull out the query parameters and the req.user object and inject them into the DTO

```ts
    async fetchAll(@QueryUser() query: FetchAllPgDto) {
        return await this.usersRepository.fetchAll(query)
    }
```

#### @User()

This decorator will pull out the req.user object and make them available in the method

```ts
    async fetchAll(@User() user: AuthorizedUser) {
        return await this.usersRepository.fetchAll(user)
    }
```

#### @Permissions()

This decorator will typically be used in tandem with the PermissionsGuard so that you can ensure the route is protected based on certain permissions

```ts
    @Permissions('CONTENT_VIEW')
    @UseGuards(IsLoggedInGuard, PermissionsGuard)
    @Get()
    async fetchAll(@Query() query: ContentFetchAllPgDto) {
        const content = await this.contentService.fetchAll(query);

        return new ContentFetchAllAndCount(content);
    }
```

#### @InjectMetadata()

This decorator will inject metadata into an object on the the request.

```ts
@Get()
async fetchAll(
    @InjectMetadata('query', injectUser) assignmentPgDto: AdminDto
) {
    const assignments = await this.adminAssignmentService.fetchAll(assignmentPgDto);
    return findAndCountAllResponse(assignments, AdminAssignmentFetchAllResponse);
}
```

In the example above, the user can be injected into the request's query so the Dto has access to all of that data while being built automatically by Nest.

The decorator accepts the following arguments:

```ts
    (reqProperty?: string, ...injectFunctions: (req, paramTarget, paramProperty, paramIndex) => object)[]
```

where `reqProperty` is the name of the property on the request to inject data into and the `injectFunctions` are functions that given the request and the decorator data for the decorated method return an object to be merged into the metadata for the request property's value.

##### Recommend Usage

In your project, it is recommend that you create an `InjectableMetadata` interface that defines all of the possible metadata that could be injected into request property.
These should match up with the keys that the inject functions return their data on. Below is an example of what that might look like.

```ts
export const injectUser = (req) => ({ user: req.user });

export const injectIsAdmin = (_req, target) => ({ isAdmin: Reflect.getMetadata('isAdmin', target.constructor) });

export interface InjectableMetadata {
    user: AuthenticatedUser;
    isAdmin: boolean;
}
```

To access this data in your DTO, you should redefine the InjectedDto type provided by this library and use your InjectableMetadata interface.

```ts
import { InjectedDto as CommonInjectedDto } from '@teammaestro/nestjs-common';
import { InjectableMetadata } from './injectable-metadata';

export type InjectedDto<DtoType, PickedFields extends keyof InjectableMetadata> = CommonInjectedDto<
    DtoType,
    InjectableMetadata,
    PickedFields
>;
```

Then in the DTO, use this as the type of the argument that is passed into the constructor. All of the injected metadata can then be found and
appropriately typed on the `INJECTED_METADATA_KEY`.

```ts
import { INJECTED_METADATA_KEY } from '@teammaestro/nestjs-common';
import { InjectedDto } from '../../common';

export class AdminDto {
    constructor(options: InjectedDto<PaginationOptions, 'user' | 'isAdmin'>) {
        const { user, isAdmin: adminMode } = options[INJECTED_METADATA_KEY];
    }
}
```

### Data Transfer Objects (Dtos)

#### Pagination

This class is our standard that we use for pagination requests. You will want to extend this class for your custom pagination classes

_Note: If your application tends to sort by 'ASC', in your main.ts set the static property `defaultSortDir = 'ASC'`_

```ts
export class UserFetchAllPgDto extends Pagination {
    @IsOptional()
    @IsString()
    @IsIn(['firstName', 'lastName'])
    sortBy: string;

    @ValidateNested()
    filter: UserFetchAllFilter;

    constructor(pagination: PaginationOptions = {}) {
        super(pagination, 'firstName');

        try {
            this.filter = new UserFetchAllFilter(JSON.parse(decodeURI(pagination.filter)));
        } catch (e) {
            this.filter = new UserFetchAllFilter();
        }

        this.search = new Search(UserSearch, pagination.search).include || null;
    }
}
```

### Guards

#### PassportAuthGuard

This guard extends the @nestjs/passport AuthGuard and provides a better error handling pattern. You will want to extend this class for any custom guards in your application and override the handleErrors method to report any non-whitelisted errors. You can also customize the whitelisted errors with the addToWhitelist and removeFromWhitelist methods. By default, this will throw an UnauthorizedException, but you can change that functionality by overriding the throwException method.

```ts
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../exceptions';
import { PassportWhitelistedErrors } from '../enums';

export function PassportAuthGuard(strategyToken: string) {
    return class Guard extends AuthGuard(strategyToken) {
        whitelistedErrors: Set<string>;

        constructor() {
            super();

            this.whitelistedErrors = new Set(Object.values(PassportWhitelistedErrors));
        }

        handleRequest(error, user, passportError) {
            if (error || !user) {
                // if the error is not an instance of our UnauthorizedException, then capture
                if (!(error instanceof UnauthorizedException)) {
                    const actualError =
                        error || passportError instanceof Error ? passportError : false || new Error('Passport Error');

                    // only handle (report to sentry) if not a whitelisted error
                    if (!this.isWhitelisted(actualError)) {
                        this.handleErrors(actualError);
                    }
                }

                this.throwException();
            }

            return user;
        }

        isWhitelisted(error = {} as Error) {
            return Array.from(this.whitelistedErrors).some((whitelistedError) => {
                if (typeof error.message === 'string') {
                    return error.message.includes(whitelistedError);
                }
                return false;
            });
        }

        handleErrors(error: Error) {
            console.warn('Override the handleErrors method in the child class of PassportAuthGuard to report errors!');
            console.error(error);
        }

        throwException() {
            throw new UnauthorizedException();
        }

        addToWhitelist(messages: string[]) {
            messages.forEach((message) => this.whitelistedErrors.add(message));
        }

        removeFromWhitelist(messages: PassportWhitelistedErrors[]) {
            messages.forEach((message) => this.whitelistedErrors.delete(String(message)));
        }
    };
}
```

## Distribution

```sh
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_

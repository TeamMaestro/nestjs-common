# nestjs-common
Our common decorators, services, etc for NestJS projects

### Installation
```
npm i @teamhive/nestjs-common
```

### Peer Dependencies
There are several peer dependencies of this project. Once you install this pack you will need to follow up and ensure the follow dependencies are installed:

```
npm i @nestjs/common@^5.0 @nestjs/core@^5.0 @nestjs/testing@^5.0 class-validator@~0.9.0 config@^3.0 js-yaml@^3.0 log4js@^3.0 raven@^2.0 reflect-metadata@^0.1 rxjs@^6.0
```

### Dev Dependencies
There are also a few dev dependencies that you may want to add to ensure you have them for typescript purposes:

```
npm i --save-dev @types/config @types/raven
```

### Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_
# Typescript Framework

### Commands to Start Server

`npm start` will start the development server

### Commands to Start in Local

`npm run startLocal` will start the development server

##### Note: See `package.json` for more commands

### Don't use `new CLASSNAME()` for controller, service, base utility classes to create objects

Use the DI Utility (Dependency Injection) to create objects for the controller, service and other utility classes

Ex1: `const userService = DI.get<UserService>(UserService); `

Ex2: `const logger = DI.get<Logger>(Logger);`

##### Note: Don't use DI for Response and Request Classes

### Don't use `console.log()`

Use below Logger utility functions to write any information in console or log files

Ex1: `logger.log();`

Ex2: `logger.info();`

Ex3: `logger.warn();`

Ex4: `logger.error();`

### Use .env file for environment variables or constants

Use .env file to set the project wide constants or environment variable

### Deployment Steps

1. Set Environment Variables in the target platform which are used in .env file
2. Remove the dotenv package configuration in `main.ts`
3. Run `npm build` to generate `dist` files
4. Deploy the `dist` files to server and run `node main.js` or `pm2 main.js` inside the `dist` directory

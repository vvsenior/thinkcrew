# Think Crew API 2

This is a RESTful API using [Node.js](https://nodejs.org), [Express](https://github.com/expressjs/express) and [MongoDB](https://www.mongodb.com/). All original code is the property of Think Crew, LLC. 

*readme last updated 2023-09-06*

---

## Install

This API was written using Node.js v16.18.1. 

1. Clone repo with `git clone git@github.com:thinkcrew/thinkcrew-api2.git`
2. Create a `server/config/config.json` file. Request information about this file from Think Crew as it is insecure to host its contents online. This file is already gitignored.
3. Run `npm install` to install all node-modules
4. Start with `npm start`

Nodemon routes are also included: `npm run start-watch` and `npm run test-watch`.

## Git Branches

 - `main` - this is the live version of the api, currently v2.0.0

For working branches, please create separate unique branches from `main` that can be merged via pull requests.

Any other branches are old and may be disregarded. 

## Documentation
- [Full Documentation](docs/index.md)

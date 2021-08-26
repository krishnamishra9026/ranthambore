# Node Standard Boilerplate

Node Standard Boilerplate with Express js.

# Table of Contents

- [File Structure](#file-structure)
- [Getting Started](#getting-started)
  - [Dependencies](#dependencies)
  - [Installing](#installing)
- [Configuration](#configuration)
- [Environment Configuration](#environment-configuration)

## File Structure

Here's how our folder strcture looks for api:

```
node-standard-boilerplate/
 ├──app/                           * source files
 |   ├──admin/                     * source files for admin api
 │       ├──controllers/           * controllers source files for admin api
 |       ├──services/              * service files for admin api
 |       ├──_apidoc.js             * common api doc variable used in admin api documentation
 |       ├──apidoc.json            * api doc configuration for admin api documentation
 |       ├──header.md              * api doc header file for admin api documentation
 |       ├──routes.js              * routes configuration for admin api
 |   ├──models/                    * contains the mongoose model files
 |   ├──public/                    * static assets are served from here
 |   ├──seed/                      * scripts to prefilled some of module data
 |   ├──services/                  * source files for common functionality
 |   ├──utils/                     * source files for common functionality
 |   ├──web/                       * source files for website api
 │       ├──controllers/           * controllers source files for website api
 |       ├──services/              * service files for web api
 |       ├──_apidoc.js             * common api doc variable used in website api documentation
 |       ├──apidoc.json            * api doc configuration for website api documentation
 |       ├──header.md              * api doc header file for website api documentation
 |       ├──routes.js              * routes configuration for website api
 |   ├──routes.js                  * application routes configuration
 ├──config/                        * application configuration files
 │   ├──default.js                 * default config for common configuration
 │   ├──development.js             * config for devevlopment environment
 |   ├──production.js              * config for production environment
 ├──tasks/                         * gulp tasks source files
 ├──.eslintrc.json                 * javascript lint config
 ├──.gitignore                     * gitignore configuration
 ├──gulpfile.js                    * gulp task configuration file
 ├──index.js                       * Index.html: where we start express server
 ├──nodemon.json                   * nodemon configuration file
 ├──package.json                   * what npm uses to manage it's dependencies
```

# Getting Started

## Dependencies

What you need to run this app:

- `node` and `npm` (`brew install node`)
- Ensure you're running the latest versions Node `v8.x.x`+ (or `v9.x.x`) and NPM `5.x.x`+

Once you have those, you should install these globals with `npm install --global`:

- `gulp` (`npm install --global gulp`)
- `eslint` (`npm install --global eslint`)
- `prettier` (`npm install --global prettier`)
- `prettier-eslint` (`npm install --global prettier-eslint`)

## Installing

- `npm install` to install all dependencies or `yarn`
- `npm start` to start the server

# Configuration

Configuration files live in `/config` for different environments of your application

## Other commands

### build api documentation

```bash
# create api documentation for mobile api
gulp apidoc --type mobile

# create api documentation for admin api
gulp apidoc --type api

# create api documentation for website api
gulp apidoc --type web
```

# Environment Configuration

Environment Configuration variable needs to be set as per file [.env.example](./.env.example)

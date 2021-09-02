/* eslint class-methods-use-this: "off" */

import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';

import seed from './seed/index';
//import MongooseMorgan from './logger';

import Roles from './models/roles.model';
import Setting from './models/setting.model';
import routes from './routes';
import config from './config';
import { log, status } from './utils';

const settings = require('./seed/settings');
const systemEmail = require('./seed/systemEmail');
const page = require('./seed/page');

const app = express();
const connUri = process.env.MONGO_CONN_URL;
// const connUri = 'mongodb+srv://krishnamishra:krishnamishra@cluster0-x012q.mongodb.net/ranthamborejs?retryWrites=true&w=majority';
const jwtSecret = process.env.JWT_SECRET;

class ExpressApp {
	constructor() {
		mongoose.connect(
			connUri,
			{
				useCreateIndex: true,
				useNewUrlParser: true,
			},
			err => {
				if (err) {
					err.status = status.INTERNAL_SERVER_ERROR;
					throw err;
				}
				log('Database connection successfull!');
				app.emit('ready');
			},
		);

		this.setMiddleware();
		this.helmetSecurity();
		this.setAppSetting();
		//this.setLogger();		
		this.setMongostore();
		this.setErrorHandler();
		return app;
	}

	setMiddleware() {
		app.disable('x-powered-by');
		app.use(bodyParser.json({ limit: '50mb' }));
		app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
		app.use(compression());
		app.use(cors());
		app.use(expressValidator());
		app.use('/', routes);

		if (process.env.NODE_ENV === 'production') {
			app.use('/admin', _express2.default.static('./public'));
			app.use('/admin/uploads/', _express2.default.static(_path2.default.resolve(__dirname, '../../../uploads')));
		}
    

		// This will serve the Angular 7 dist code from client folder
		/*if (process.env.NODE_ENV === 'production') {
			app.use(express.static('./client'));
			app.get('*', (req, res) => {
				res.sendFile('index.html', { root: path.join(__dirname, '../client') });
			});
		}*/
	}

	helmetSecurity = () => {
		const SIX_MONTHS = 15778476000;
		app.use(helmet.hidePoweredBy());
		app.use(helmet.frameguard());
		app.use(helmet.xssFilter());
		app.use(helmet.noSniff());
		app.use(helmet.ieNoOpen());
		app.use(
			helmet.hsts({
				maxAge: SIX_MONTHS,
				includeSubdomains: true,
				force: true,
			}),
		);
	};

	setLogger() {
		app.use(new MongooseMorgan());
	}

	setMongostore() {
		const Mongostore = connectMongo(session);
		app.use(
			session({
				secret: jwtSecret,
				resave: true,
				saveUninitialized: true,
				store: new Mongostore({
					mongooseConnection: mongoose.connection,
				}),
			}),
		);
	}

	setErrorHandler() {
		app.use((err, req, res, next) => {
			let errMsg = '';
			if (err.errors) {
				const keys = Object.keys(err.errors);
				if (keys && keys.length && err.errors[keys[0]] && err.errors[keys[0]].message) {
					errMsg = err.errors[keys[0]].message;
				}
			}
			let response = {};
			response = {
				status: err.code || 500,
				message: errMsg || err.message || httpStatus[err.code],
				success: false,
				errors: err.errors,
			};

			if (process.env.NODE_ENV === 'development') {
				response.stack = err.stack;
			}

			res.status(response.status)
				.json(response)
				.end();
		});
	}

	setAppSetting() {
		if (config && config.seed.default === true) {
			seed();
		}
		if (config && config.seed.settings === true) {
			settings();
		}
		if (config && config.seed.systemEmail === true) {
			systemEmail();
		}
		if (config && config.seed.page === true) {
			page();
		}

		Setting.find()
			.lean(true)
			.then(results => {
				if (results.length > 0) {
					results.forEach(setting => {
						let val = setting.value;
						switch (setting.name) {
							case 'PAGE_SIZE_MOBILE':
							case 'PAGE_SIZE_FRONT':
							case 'PAGE_SIZE_ADMIN':
								val = parseInt(val, 10);
								break;
							default:
								break;
						}
						app.set(setting.name, val);
					});
				}
			});

		Roles.find({ active: true })
			.lean(true)
			.then(result => {
				if (result.length > 0) {
					result.forEach(role => {
						app.locals[`${role.slug.toUpperCase()}_ROLE_ID`] = role._id.toString();
					});
				}
			});
	}
}
export default new ExpressApp();

/* eslint no-unused-vars: ["error", { "caughtErrors": "none" }] */

const path = require('path');

module.exports = {
	getConfig() {
		let config;
		let cred;

		try {
			config = require(path.resolve(process.cwd(), 'apexnitro.config.json'));
		} catch (error) {
			throw new Error(`${path.resolve(process.cwd(), 'apexnitro.config.json')} does not exist. Type "apex-nitro init" to initialize your project.`);
		}

		if (config.upload.credentialsPath) {
			try {
				cred = require(path.resolve(config.upload.credentialsPath));
			} catch (error) {
				throw new Error(`${path.resolve(config.upload.credentialsPath)} does not exist.`);
			}
		}

		if (cred.path) {
			config.upload.path = cred.path;
		}

		if (cred.username) {
			config.upload.username = cred.username;
		}

		if (cred.password) {
			config.upload.password = cred.password;
		}

		if (cred.connectionString) {
			config.upload.connectionString = cred.connectionString;
		}

		return config;
	},

	// Ensures that the directory structure exists for a given file
	padStr(str, padStr) {
		if (str) {
			if (str.endsWith(padStr)) {
				return str;
			}

			return str.concat(padStr);
		}

		return '.';
	}
};

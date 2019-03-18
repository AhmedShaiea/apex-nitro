const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const isRequired = function (input) {
	if (input !== '') {
		return true;
	}

	return 'Required.';
};

const questions = [{
	type: 'list',
	name: 'mode',
	message: 'Which mode?',
	choices: ['basic', 'advanced', 'pro']
}, {
	type: 'input',
	name: 'appURL',
	message: 'The URL of your APEX application?',
	validate: isRequired
}, {
	type: 'input',
	name: 'srcFolder',
	message: 'Location of the source folder?',
	default: './src',
	validate: isRequired
}, {
	type: 'input',
	name: 'distFolder',
	message: 'Location of the distribution folder?',
	default: './dist',
	validate: isRequired,
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'list',
	name: 'js.defaults',
	message: 'Configure JavaScript settings',
	choices: [{
		name: 'Use APEX Nitro default JavaScript settings',
		value: 'default'
	},
	{
		name: 'Customize',
		value: 'custom'
	}],
	default: 'default',
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'list',
	name: 'js.processor',
	message: 'Choose how your JavaScript will be processed',
	choices: [{
		name: 'JavaScript (default)',
		value: 'javascript'
	},
	{
		name: 'TypeScript',
		value: 'typescript'
	}],
	default: 'javascript',
	when(answers) {
		return answers.mode === 'advanced' && answers.js.defaults === 'custom';
	}
}, {
	type: 'confirm',
	name: 'js.jsConcat',
	message: 'Concatenate all final JavaScript files into one?',
	default: true,
	when(answers) {
		return answers.mode === 'advanced' && answers.js.defaults === 'custom' && answers.js.processor === 'default';
	}
}, {
	type: 'input',
	name: 'js.jsConcatFilename',
	message: 'Name of the final concatenated JavaScript file?',
	default: 'app',
	when(answers) {
		return answers.mode === 'advanced' && answers.js.defaults === 'custom' && answers.js.processor === 'default' && answers.js.jsConcat;
	},
	validate: isRequired
}, {
	type: 'confirm',
	name: 'js.tsConcat',
	message: 'Concatenate all final JavaScript files into one?',
	default: true,
	when(answers) {
		return answers.mode === 'advanced' && answers.js.defaults === 'custom' && answers.js.processor === 'typescript';
	}
}, {
	type: 'input',
	name: 'js.tsConcatFilename',
	message: 'Name of the final concatenated JavaScript file?',
	default: 'app',
	when(answers) {
		return answers.mode === 'advanced' && answers.js.defaults === 'custom' && answers.js.processor === 'typescript' && answers.js.tsConcat;
	},
	validate: isRequired
}, {
	type: 'list',
	name: 'css.defaults',
	message: 'Configure CSS settings',
	choices: [{
		name: 'Use APEX Nitro default CSS settings',
		value: 'default'
	},
	{
		name: 'Customize',
		value: 'custom'
	}],
	default: 'default',
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'list',
	name: 'css.language',
	message: 'Choose how your CSS will be processed',
	choices: [{
		name: 'CSS (default)',
		value: 'css'
	},
	{
		name: 'Sass',
		value: 'sass'
	},
	{
		name: 'Less',
		value: 'less'
	}],
	default: 'css',
	when(answers) {
		return answers.mode === 'advanced' && answers.css.defaults === 'custom';
	}
}, {
	type: 'confirm',
	name: 'css.cssConcat',
	message: 'Concatenate all final CSS files into one?',
	default: false,
	when(answers) {
		return answers.mode === 'advanced' && answers.css.defaults === 'custom';
	}
}, {
	type: 'input',
	name: 'css.cssConcatFilename',
	message: 'Name of the final concatenated CSS file?',
	default: 'app',
	when(answers) {
		return answers.mode === 'advanced' && answers.css.defaults === 'custom' && answers.css.cssConcat;
	},
	validate: isRequired
}, {
	type: 'input',
	name: 'css.sassIncludePath',
	message: 'Path to import an external Sass folder (optional)',
	when(answers) {
		return answers.mode === 'advanced' && answers.css.defaults === 'custom' && answers.css.language === 'sass';
	}
}, {
	type: 'input',
	name: 'css.lessIncludePath',
	message: 'Path to import an external Less folder (optional)',
	when(answers) {
		return answers.mode === 'advanced' && answers.css.defaults === 'custom' && answers.css.language === 'less';
	}
}, {
	type: 'list',
	name: 'browsersync.defaults',
	message: 'Configure browser settings',
	choices: [{
		name: 'Use APEX Nitro default browser settings',
		value: 'default'
	},
	{
		name: 'Customize',
		value: 'custom'
	}],
	default: 'default',
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'confirm',
	name: 'browsersync.realTime',
	message: 'Enable real-time synchronization?',
	default: true,
	when(answers) {
		return answers.mode === 'advanced' && answers.browsersync.defaults === 'custom';
	}
}, {
	type: 'confirm',
	name: 'browsersync.ghostMode',
	message: 'Enable external devices synchronization?',
	default: false,
	when(answers) {
		return answers.mode === 'advanced' && answers.browsersync.defaults === 'custom';
	}
}, {
	type: 'confirm',
	name: 'browsersync.notify',
	message: 'Enable push notifications on success and errors?',
	default: false,
	when(answers) {
		return answers.mode === 'advanced' && answers.browsersync.defaults === 'custom';
	}
}, {
	type: 'confirm',
	name: 'apex.openBuilder',
	message: 'Open APEX builder when launching APEX Nitro?',
	when(answers) {
		return answers.mode === 'advanced' && answers.browsersync.defaults === 'custom';
	}
}, {
	type: 'list',
	name: 'header.defaults',
	message: 'Configure header settings',
	choices: [{
		name: 'Use APEX Nitro default header settings',
		value: 'default'
	},
	{
		name: 'Customize',
		value: 'custom'
	}],
	default: 'default',
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'confirm',
	name: 'header.enabled',
	message: 'Enable automatic header comment blocks on distribution files?',
	default: false,
	when(answers) {
		return answers.mode === 'advanced' && answers.header.defaults === 'custom';
	}
}, {
	type: 'input',
	name: 'header.packageJsonPath',
	message: 'Path to the project \'package.json\' file',
	when(answers) {
		return answers.mode === 'advanced' && answers.header.defaults === 'custom' && answers.header.enabled;
	},
	validate: isRequired
}, {
	type: 'list',
	name: 'publish.defaults',
	message: 'Configure publish settings',
	choices: [{
		name: 'Use APEX Nitro default publish settings',
		value: 'default'
	},
	{
		name: 'Customize',
		value: 'custom'
	}],
	default: 'default',
	when(answers) {
		return answers.mode === 'advanced';
	}
}, {
	type: 'list',
	name: 'publish.destination',
	message: 'Choose where to upload your files in APEX',
	choices: [{
		name: 'Application static files (default)',
		value: 'application'
	}, {
		name: 'Workspace static files',
		value: 'workspace'
	}, {
		name: 'Theme files',
		value: 'theme'
	}, {
		name: 'Plugin files',
		value: 'plugin'
	}],
	default: 'application',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom';
	}
}, {
	type: 'input',
	name: 'publish.pluginName',
	message: 'Plugin internal name?',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom' && answers.publish.destination === 'plugin';
	},
	validate: isRequired
}, {
	type: 'input',
	name: 'publish.path',
	message: 'Path to SQLcl?',
	default: 'sqlcl',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom';
	},
	validate: isRequired
}, {
	type: 'input',
	name: 'publish.username',
	message: 'Enter database user:',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom';
	},
	validate: isRequired
}, {
	type: 'password',
	name: 'publish.password',
	message: 'Enter database password (optional):',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom';
	}
}, {
	type: 'input',
	name: 'publish.connectionString',
	message: 'Enter database connection string:',
	when(answers) {
		return answers.mode === 'advanced' && answers.publish.defaults === 'custom';
	},
	validate: isRequired
}];

function initFiles(config) {
	const files = [];

	if (config.js.processor === 'javascript') {
		const content =
`(function (apex, $) {
	console.log('Your JavaScript here');
})(apex, apex.jQuery);`;

		if (config.js.jsConcat) {
			files.push({
				path: path.resolve(config.srcFolder, 'js', `${config.js.jsConcatFilename}.js`),
				content
			});
		} else {
			files.push({
				path: path.resolve(config.srcFolder, 'js', 'app.js'),
				content
			});
		}
	}

	if (config.css.language === 'css') {
		if (config.css.cssConcat) {
			files.push({
				path: path.resolve(config.srcFolder, 'css', `${config.css.cssConcatFilename}.css`),
				content: ''
			});
		} else {
			files.push({
				path: path.resolve(config.srcFolder, 'css', 'app.css'),
				content: ''
			});
		}
	}

	files.forEach(file => {
		fs.outputFileSync(file.path, file.content);
		console.log(`${file.path} ${chalk.green('created')}.`);
	});
}

const initConfig = function () {
	// Generate the config file
	inquirer.prompt(questions).then(config => {
		// Set js defaults
		if (config.js.defaults === 'default') {
			config.js.processor = 'javascript';
			config.js.jsConcat = true;
			config.js.jsConcatFilename = 'app';
			delete config.js.defaults;
		}

		// Set css defaults
		if (config.css.defaults === 'default') {
			config.css.language = 'css';
			config.css.cssConcat = true;
			config.css.cssConcatFilename = 'app';
			delete config.css.defaults;
		}

		// Set browser defaults
		if (config.browsersync.defaults === 'default') {
			config.browsersync.realTime = true;
			config.browsersync.ghostMode = false;
			config.browsersync.notify = true;
			config.apex = {};
			config.apex.openBuilder = false;
			delete config.browsersync.defaults;
		}

		// Set header defaults
		if (config.header.defaults === 'default') {
			config.header.enabled = false;
			delete config.header.defaults;
		}

		// Set publish defaults
		if (config.publish.defaults === 'default') {
			config.publish.destination = 'application';
			config.publish.path = 'sqlcl';
			config.publish.username = '';
			config.publish.password = '';
			config.publish.connectionString = '';
			delete config.publish.defaults;
		} else if (display.publish.password !== '') {
			display.publish.password = '***************';
		}

		// Display the config for confirmation
		const display = JSON.parse(JSON.stringify(config));
		console.log(`About to write to ${process.cwd()}/apexnitro.config.json:`);
		console.log(JSON.stringify(display, null, 2));

		const questions = [{
			type: 'confirm',
			name: 'initConfirm',
			message: 'Is this OK'
		}];

		// Confirm the config file
		inquirer.prompt(questions).then(answers => {
			if (answers.initConfirm) {
				fs.writeFile(path.resolve(process.cwd(), 'apexnitro.config.json'), JSON.stringify(config, null, 2), 'utf8', () => {
					console.log(`${process.cwd()}/apexnitro.config.json ${chalk.green('saved')}.`);
					initFiles(config);
					console.log(`Now type ${chalk.bold.cyan('apex-nitro launch')}`);
				});
			}
		});
	});
};

module.exports = function () {
	try {
		require(path.resolve(process.cwd(), 'apexnitro.config.json'));

		const questions = [{
			type: 'confirm',
			name: 'initConfig',
			message: 'A configuration file already exists here. Do you want to reset it?',
			default: false
		}];

		// Ask the password
		inquirer.prompt(questions).then(answers => {
			if (answers.initConfig) {
				initConfig();
			}
		});
	} catch (error) {
		initConfig();
	}
};
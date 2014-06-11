module.exports = {
	bundle: {
		src: 'src/ractive-decorators-helpers.js',
		dest: 'tmp/ractive-decorators-helpers.js'
	},
	options: {
		process: {
			data: {
				VERSION: '<%= pkg.version %>'
			}
		}
	}
};

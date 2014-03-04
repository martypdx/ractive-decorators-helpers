module.exports = {
	bundle: {
		src: 'src/Ractive-decorators-helpers.js',
		dest: 'tmp/Ractive-decorators-helpers.js'
	},
	options: {
		process: {
			data: {
				VERSION: '<%= pkg.version %>'
			}
		}
	}
};

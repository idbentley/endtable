require.paths.unshift(__dirname);
require('./lib/jspec');

EndtableCore = require('endtable').EndtableCore;
connector = require('../lib/endtable/couch-connector');

/**
 * Run tests after a setTimeout which allows asynchronous
 * tests time to complete.
 */
function runTestsAsync() {
	specs = {
		independant: [
	    	'endtable-core',
			'couch-connector'
		]
	}
	
	// Capture command-line input.
	if (process.ARGV.length <= 2) {
	    run(specs.independant);
	} else {
	    run([process.ARGV[2]]);
	}

	function run(specs) {
		var tests = [];
		specs.forEach(function(spec){
			JSpec.exec('spec/spec.' + spec + '.js');
		})
		
		// We should wait for all asynchronous calls to finish before running the report.
		setTimeout(function() {
			JSpec.report()
		}, 1000);
		
		JSpec.run()
	}
}

function resetDBAndRunTests() {
	var endtableCore = new EndtableCore({
		port: 5984,
		host: 'localhost',
		user: '',
		password: '',
		database: 'test'
	});

	endtableCore.connector.deleteDatabase(function() {
		endtableCore.connector.createDatabase(function() {
			runTestsAsync();
		});
	});
}
resetDBAndRunTests();
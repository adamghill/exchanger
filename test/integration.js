var assert = require('assert')
	, exchanger = require('../index')
	;

var settings = {
};

function setup(callback) {
	assert.ok(settings.username, 'Username must be set.');
	assert.ok(settings.password, 'Password must be set.');
	assert.ok(settings.url, 'Url must be set.');

	exchanger.initialize(settings, function(err) {
		assert.ok(!err);

    callback(exchanger);
  });
}

exports.getEmails_allArgs = function() {
	setup(function(exchanger) {
		exchanger.getEmails('inbox', 10, function(err, emails) {
			assert.ok(emails);
			assert.equal(10, emails.length);

  		// console.log(emails);
  	});
	});
}

exports.getEmails_folderName = function() {
	setup(function(exchanger) {
		exchanger.getEmails('inbox', function(err, emails) {
			assert.ok(emails);
			assert.equal(10, emails.length);

  		// console.log(emails);
  	});
	});
}

exports.getEmails_callback = function() {
	setup(function(exchanger) {
		exchanger.getEmails(function(err, emails) {
			assert.ok(emails);
			assert.equal(10, emails.length);

  		// console.log(emails);
  	});
	});
}

this.getEmails_allArgs();
this.getEmails_folderName();
this.getEmails_callback();
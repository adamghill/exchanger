var assert = require('assert')
	, _ = require('underscore')
	, exchanger = require('../../index')
	, settings = require('../settings')
	;

module.exports = {
	setUp: function(callback) {
		exchanger.initialize(settings, function(err) {
			if (err) throw err;

	    callback();
	  });
	},

	validateSettings: function(test) {
		test.ok(settings.username, 'settings.username must be set.');
		test.ok(settings.password, 'settings.password must be set.');
		test.ok(settings.url, 'settings.url must be set.');
		test.ok(settings.itemId, 'settings.itemId must be set.');
		test.done();
	},

	getEmailsWithAllArgs: function(test) {
		exchanger.getEmails('inbox', 10, function(err, emails) {
			test.ifError(err);
			test.ok(emails);
			test.ok(emails.length > 0);
			test.done();
  	});
	},

};
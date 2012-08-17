var assert = require('assert')
	, exchanger = require('../index')
	;

var settings = {};
try {
  require('./settings.js');
} catch(err) { }

if (!settings || Object.keys(settings).length === 0) {
  throw new Error('Define an Exchange server in settings.js.');
}

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
			assert.ok(emails.length > 0);
  	});
	});
}

exports.getEmails_folderName = function() {
	setup(function(exchanger) {
		exchanger.getEmails('inbox', function(err, emails) {
			assert.ok(emails);
			assert.ok(emails.length > 0);
  	});
	});
}

exports.getEmails_callback = function() {
	setup(function(exchanger) {
		exchanger.getEmails(function(err, emails) {
			assert.ok(emails);
			assert.ok(emails.length > 0);
  	});
	});
}

exports.getEmails_id_set = function() {
	setup(function(exchanger) {
		exchanger.getEmails(function(err, emails) {
			assert.ok(emails.length > 0);

			emails.forEach(function(item, idx) {
				// console.log(item.id);
				assert.ok(item.id);
			});
  	});
	});
}

exports.getEmail_id = function() {
	setup(function(exchanger) {
		var id = {
			itemId: settings.itemId,
			changeKey: settings.changeKey
		};

		exchanger.getEmail(id, function(err, email) {
			assert.ok(!err);
			assert.ok(email);

			//console.log(email);
  	});
	});
}

this.getEmails_allArgs();
this.getEmails_folderName();
this.getEmails_callback();
this.getEmails_id_set();
this.getEmail_id();
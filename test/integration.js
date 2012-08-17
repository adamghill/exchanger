var assert = require('assert')
	, _ = require('underscore')
	, exchanger = require('../index')
	;

var settings = {};
try {
  settings = require('./settings.js');
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
				assert.ok(item.id);

				assert.ok(item.id.split('|').length === 2)
				var itemId = item.id.split('|')[0];
				var changeKey = item.id.split('|')[1];

				assert.ok(itemId);
				assert.ok(changeKey);
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
  	});
	});
}

exports.getEmail_mailboxes_set = function() {
	setup(function(exchanger) {
		var id = {
			itemId: settings.itemId,
			changeKey: settings.changeKey
		};

		exchanger.getEmail(id, function(err, email) {
			var mailboxTypes = [email.toRecipients, email.ccRecipients, email.from];
			
			_.forEach(mailboxTypes, function(m) {
				assert.ok(m.length > 0);

				_.forEach(m, function(i) {
					assert.ok(i.name);
					assert.ok(i.emailAddress);
				})
			})
  	});
	});
}

this.getEmails_allArgs();
this.getEmails_folderName();
this.getEmails_callback();
this.getEmails_id_set();
this.getEmail_id();
this.getEmail_mailboxes_set();
var assert = require('assert')
	, _ = require('underscore')
	, exchanger = require('../index')
	, settings = require('./settings.js')
	;

module.exports = {
	setUp: function(callback) {
		exchanger.initialize(settings, function(err) {
			if (err) throw err;

	    callback();
	  });
	},

	validateSettings: function(test) {
		test.ok(settings.username, 'Username must be set.');
		test.ok(settings.password, 'Password must be set.');
		test.ok(settings.url, 'Url must be set.');
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

	getEmailsWithFolderName: function(test) {
		exchanger.getEmails('inbox', function(err, emails) {
			test.ifError(err);
			test.ok(emails);
			test.ok(emails.length > 0);
			test.done();
  	});
	},

	getEmailsWithCallback: function(test) {
		exchanger.getEmails(function(err, emails) {
			test.ifError(err);
			test.ok(emails);
			test.ok(emails.length > 0);
			test.done();
		});
	},

	getEmailsIdSet: function(test) {
		exchanger.getEmails(function(err, emails) {
			test.ok(emails.length > 0);

			emails.forEach(function(item, idx) {
				test.ok(item.id);

				test.ok(item.id.split('|').length === 2)
				var itemId = item.id.split('|')[0];
				var changeKey = item.id.split('|')[1];

				test.ok(itemId);
				test.ok(changeKey);

				if (idx === (emails.length - 1)) {
					test.done();
				}
			});
  	});
	},

	getEmailWithItemId: function(test) {
		exchanger.getEmail(settings.itemId, function(err, email) {
			test.ifError(err);
			test.ok(email);
			test.done();
  	});
	},

	getEmailWithId: function(test) {
		var id = settings.itemId.id + "|" + settings.itemId.changeKey;
		exchanger.getEmail(id, function(err, email) {
			test.ifError(err);
			test.ok(email);
			test.done();
  	});
	},

	getEmailWithInvalidId: function(test) {
		var id = "blob";
		exchanger.getEmail(id, function(err, email) {
			test.ok(err);
			test.ifError(email);
			test.done();
  	});
	},

	getEmailMailboxesSet: function(test) {
		exchanger.getEmail(settings.itemId, function(err, email) {
			var mailboxTypes = [email.toRecipients, email.ccRecipients, email.from];
			
			_.forEach(mailboxTypes, function(m, idx) {
				test.ok(m instanceof Array);
				test.ok(m.length > 0);

				_.forEach(m, function(i, idx2) {
					test.ok(i.name);
					test.ok(i.emailAddress);

					if (idx === (mailboxTypes.length - 1) && idx2 === (m.length - 1)) {
						test.done();
					}
				})
			})
  	});
	},

};
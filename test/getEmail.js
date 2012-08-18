var assert = require('assert')
	, fs = require('fs')
	, path = require('path')
	, _ = require('underscore')
	, settings = require('./settings')
	, exchanger = require('../index')
	;

module.exports = {
	setUp: function(callback) {
		exchanger.client = { 
			GetItem: function(soapRequest, callback) {
				fs.readFile(path.join(__dirname, 'getEmailSoapResponse.xml'), 'utf8', function(err, body) {
					var result = '';
					callback(null, result, body);
				});
			}
		};

		callback();
	},

	getEmailWithNoClient: function(test) {
		exchanger.client = null;

		exchanger.getEmail(settings.itemId, function(err, email) {
			test.ok(err);
			test.done();
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
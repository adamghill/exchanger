var assert = require('assert')
	, fs = require('fs')
	, path = require('path')
	, _ = require('underscore')
	, exchanger = require('../index')
	;

module.exports = {
	setUp: function(callback) {
		exchanger.client = { 
			FindItem: function(soapRequest, callback) {
				fs.readFile(path.join(__dirname, 'getEmailsSoapResponse.xml'), 'utf8', function(err, body) {
					var result = '';
					callback(null, result, body);
				});
			}
		};

		callback();
	},

	getEmailsWithNoClient: function(test) {
		exchanger.client = null;

		exchanger.getEmails(function(err, emails) {
			test.ok(err);
			test.done();
		});
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

};
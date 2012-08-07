var path = require('path')
  , moment = require('moment')
  ;
client = null;

var urlHelper = {
  join: function(parts) {
    var normalizedParts = [];

    for (var arg in arguments) {
      var normalizedPart = arguments[arg];

      if (/\/$/.test(normalizedPart)) {
        normalizedPart = normalizedPart.substr(0, -1);
      }

      normalizedParts.push(normalizedPart);

      if (parseInt(arg) === (arguments.length - 1)) {
        return normalizedParts.join('/');
      }
    }
  }
}

exports.initialize = function(settings, callback) {
  var soap = require('soap');
  // TODO: Handle different locations of where the asmx lives.
  var endpoint = 'https://' + urlHelper.join(settings.url, 'EWS/Exchange.asmx');
  var url = path.join(__dirname, 'Services.wsdl');

  soap.createClient(url, {}, function(err, client) {
    if (err) {
      return callback(err);
    }
    if (!client) {
      return callback(new Error('Could not create client'));
    }

    this.client = client;
    // client.setEndpoint(url);
    client.setSecurity(new soap.BasicAuthSecurity(settings.username, settings.password));

    return callback(null);
  }, endpoint);
}

exports.getEmails = function(folderName, limit, callback) {
  if (typeof(folderName) === "function") {
    callback = folderName;
    folderName = 'inbox';
    limit = 10;
  }
  if (typeof(limit) === "function") {
    callback = limit;
    limit = 10;
  }

  var soapRequest = 
    '<tns:FindItem Traversal="Shallow" xmlns:tns="http://schemas.microsoft.com/exchange/services/2006/messages">' +
      '<tns:ItemShape>' +
        '<t:BaseShape>IdOnly</t:BaseShape>' +
        '<t:AdditionalProperties>' +
          // '<t:FieldURI FieldURI="item:ItemId"></t:FieldURI>' +
          // '<t:FieldURI FieldURI="item:ConversationId"></t:FieldURI>' +
          // '<t:FieldURI FieldURI="message:ReplyTo"></t:FieldURI>' +
          // '<t:FieldURI FieldURI="message:ToRecipients"></t:FieldURI>' +
          // '<t:FieldURI FieldURI="message:CcRecipients"></t:FieldURI>' +
          // '<t:FieldURI FieldURI="message:BccRecipients"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:DateTimeCreated"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:DateTimeSent"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:HasAttachments"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:Size"></t:FieldURI>' +
          '<t:FieldURI FieldURI="message:From"></t:FieldURI>' +
          '<t:FieldURI FieldURI="message:IsRead"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:Importance"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:Subject"></t:FieldURI>' +
          '<t:FieldURI FieldURI="item:DateTimeReceived"></t:FieldURI>' +
        '</t:AdditionalProperties>' + 
      '</tns:ItemShape>' +
      '<tns:IndexedPageItemView BasePoint="Beginning" Offset="0" MaxEntriesReturned="10"></tns:IndexedPageItemView>' +
      '<tns:ParentFolderIds>' + 
        '<t:DistinguishedFolderId Id="inbox"></t:DistinguishedFolderId>' + 
      '</tns:ParentFolderIds>' + 
    '</tns:FindItem>';

  client.FindItem(soapRequest, function(err, result) {
    if (err) {
      return callback(err);
    }

    if (result.ResponseMessages.FindItemResponseMessage.ResponseCode == 'NoError') {
      var rootFolder = result.ResponseMessages.FindItemResponseMessage.RootFolder;
      
      var emails = [];
      rootFolder.Items.Message.forEach(function(item, idx) {
        emails.push({
          // id: item.ItemId,
          id: item.Subject + '-' + item.DateTimeSent,
          subject: item.Subject,
          dateTimeReceived: moment(item.DateTimeReceived).format("MM/DD/YYYY, h:mm:ss A"),
          niceDateTimeReceived: moment(item.DateTimeReceived).fromNow(),
          size: item.Size,
          importance: item.Importance,
          hasAttachments: (item.HasAttachments === 'true'),
          from: item.From.Mailbox.Name,
          isRead: (item.IsRead === 'true')
        });
      });

      callback(null, emails);
    } else {
      callback(new Error(result.ResponseMessages.FindItemResponseMessage.ResponseCode));
    }
  });
}

exports.getFolders = function(id, callback) {
  if (typeof(id) == 'function') {
    callback = id;
    id = 'inbox';
  }

  client.FindFolder({
    'tns:FolderShape': { 
      't:BaseShape': 'Default' 
    }, 
    'tns:ParentFolderIds': {
      't:DistinguishedFolderId': { 
        _attrs: {
          'Id': 'inbox'
        }
      }
    }
  }, {
    'Traversal': 'Shallow'
  }, function(err, result) {
    if (err) {
      return console.log('ERROR', err);
    }

    // console.log('RESULT', result);
    
    if (result.ResponseMessages.FindFolderResponseMessage.ResponseCode == 'NoError') {
      var rootFolder = result.ResponseMessages.FindFolderResponseMessage.RootFolder;
      
      rootFolder.Folders.Folder.forEach(function(folder) {
        console.log(folder);
      });

      callback(err, {});
    }
  });
}

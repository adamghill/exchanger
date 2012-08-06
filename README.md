Query Microsoft's Exchange Web Services. Only tested on Microsoft Exchange 2010.

##Install

Install with npm:

```
npm install exchanger
```

##Module

###exchanger.initialize(settings, callback)

``` javascript
  var exchanger = require('exchanger');
  retriever.initialize({ url: 'webmail.example.com', username: 'username', password: 'password' }, function(err) {
    console.log('Initialized!');
  });
```

###exchanger.getEmails(folderName, limit, callback)

``` javascript
  var exchanger = require('exchanger');
  retriever.initialize({ url: 'webmail.example.com', username: 'username', password: 'password' }, function(err) {
    exchanger.getEmails('inbox', 50, function(err, emails) {
      console.log(emails);
    });
  });
```
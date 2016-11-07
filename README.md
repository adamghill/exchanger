This code is *completely unsupported* because I have lost an Exchange server to test any changes against. As mentioned in some of the issues, https://github.com/chuckpearce/exchanger might be a possible solution. I'm completely open to moving this repo (and NPM rights) to someone who can keep it up to date.

---

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
  exchanger.initialize({ url: 'webmail.example.com', username: 'username', password: 'password' }, function(err) {
    console.log('Initialized!');
  });
```

###exchanger.getEmails(folderName, limit, callback)

``` javascript
  var exchanger = require('exchanger');
  exchanger.initialize({ url: 'webmail.example.com', username: 'username', password: 'password' }, function(err) {
    exchanger.getEmails('inbox', 50, function(err, emails) {
      console.log(emails);
    });
  });
```

console.log('Clearing preferences in 10 seconds...');
console.log('^C to cancel!');

setTimeout(function() {
  console.log('Clearing preferences in 5 seconds...');
}, 5000);

setTimeout(function() {
  console.log('Clearing preferences!');

  var fs = require('fs');
  fs.writeFileSync(__dirname + '/save/window_size.json', '{}');
}, 10000);

//

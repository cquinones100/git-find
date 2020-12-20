const clear = require('clear');

clear();

var argv = require('minimist')(process.argv.slice(2), { string: 'query' });

console.log(argv['_'][0]);
# ssdeep

[![Build Status](https://travis-ci.org/pchaigno/node-ssdeep.svg?branch=master)](https://travis-ci.org/pchaigno/node-ssdeep)
[![Coverage Status](https://coveralls.io/repos/github/pchaigno/node-ssdeep/badge.svg?branch=master)](https://coveralls.io/github/pchaigno/node-ssdeep?branch=master)

Node.js wrapper for the ssdeep fuzzy hashing library.

## Installation

You will need `libfuzzy` installed. All major Linux distributions have it available as a package:
```
sudo apt-get install libfuzzy-dev
```
You can also install it from [sources](http://ssdeep.sourceforge.net/#download).

Then, install the Node.js wrapper:
```
npm install ssdeep
```


## Examples

To compute a fuzzy hash:
```node
var hash = ssdeep.hash('text to hash');
```

To compute the fuzzy hash of a file:
```node
var hash = ssdeep.hash_from_file('file_to_hash.txt');
```

To compare two fuzzy hashes:
```node
var score = ssdeep.compare(hash1, hash2);
```


## License

This package is under [MIT license](LICENSE).

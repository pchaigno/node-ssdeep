var ref = require('ref');
var ffi = require('ffi');
var path = require('path');
var settings = require('./settings.js');

const SPAMSUM_LENGTH = 64;
const FUZZY_MAX_RESULT = (2 * SPAMSUM_LENGTH + 20);


//update your ssdeepLibraryPath in settings.js to match your specific operating systems libfuzzy path
//for example in redhat path on 64-bit might be /usr/lib64/libfuzzy.so.2
//ubuntu path is /usr/lib/libfuzzy.so


var ssdeep = ffi.Library(settings.ssdeepLibraryPath, {
  'fuzzy_hash_buf': ['int', ['string', 'uint32', 'pointer']],
  'fuzzy_hash_filename': ['int', ['string', 'pointer']],
  'fuzzy_compare': ['int', ['string', 'string']]
});

var ssdeepalt =ffi.Library(settings.ssdeepLibraryPath, {
  'fuzzy_hash_buf': ['int', ['pointer', 'uint32', 'pointer']],
  'fuzzy_hash_filename': ['int', ['string', 'pointer']],
  'fuzzy_compare': ['int', ['string', 'string']]
});

module.exports = {
  hash: function(plaintext) {

    var hashPtr = ref.allocCString(Array(FUZZY_MAX_RESULT).join(' '),'utf8');

    var res = ssdeep.fuzzy_hash_buf(plaintext, plaintext.length, hashPtr);
    if(res != 0) {
      return null;
    }

    var hash = hashPtr.readCString();


    return hash;
  },

  hash_from_buffer: function(buff){

    var hashPtr = ref.allocCString(Array(FUZZY_MAX_RESULT).join(' '),'utf8');

    var res = ssdeepalt.fuzzy_hash_buf(buff, buff.length, hashPtr);
    if(res != 0) {
      return null;
    }

    var hash = hashPtr.readCString();


    return hash;
  },
  hash_from_file: function(filepath) {

    var hashPtr = ref.allocCString(Array(FUZZY_MAX_RESULT).join(' '));

    var res = ssdeep.fuzzy_hash_filename(filepath, hashPtr);
    if(res != 0) {
      return null;
    }
    var hash = hashPtr.readCString();
    return hash;
  },

  compare: function(digest1, digest2) {
    return ssdeep.fuzzy_compare(digest1, digest2);
  }
};

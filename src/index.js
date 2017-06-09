var ref = require('ref');
var ffi = require('ffi');

const SPAMSUM_LENGTH = 64;
const FUZZY_MAX_RESULT = (2 * SPAMSUM_LENGTH + 20);

var ssdeep = ffi.Library('libfuzzy', {
  'fuzzy_hash_buf': ['int', ['string', 'uint32', 'pointer']],
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

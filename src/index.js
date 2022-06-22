var ref = require('ref-napi');
var ffi = require('ffi-napi');

const SPAMSUM_LENGTH = 64;
const FUZZY_MAX_RESULT = (2 * SPAMSUM_LENGTH + 20);

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Based on https://github.com/hiddentao/fast-levenshtein
function levenshtein(str1, str2) {
  // base cases
  if (str1 === str2) return 0;
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  // two rows
  var prevRow = new Array(str2.length + 1),
    curCol, nextCol, i, j, tmp;

  // initialise previous row
  for (i = 0; i < prevRow.length; ++i) {
    prevRow[i] = i;
  }

  // calculate current row distance from previous row
  for (i = 0; i < str1.length; ++i) {
    nextCol = i + 1;

    for (j = 0; j < str2.length; ++j) {
      curCol = nextCol;

      // substution
      nextCol = prevRow[j] + ((str1.charAt(i) === str2.charAt(j)) ? 0 : 1);
      // insertion
      tmp = curCol + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }
      // deletion
      tmp = prevRow[j + 1] + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }

      // copy current col value into previous (in preparation for next iteration)
      prevRow[j] = curCol;
    }

    // copy last col value into previous (in preparation for next iteration)
    prevRow[j] = nextCol;
  }
  return nextCol;
}

var ssdeep = ffi.Library('libfuzzy', {
  'fuzzy_hash_buf': ['int', ['string', 'uint32', 'string']],
  'fuzzy_hash_filename': ['int', ['string', 'string']],
  'fuzzy_compare': ['int', ['string', 'string']]
});

function matchScore(s1, s2) {
  var e = levenshtein(s1, s2);
  var r = 1 - e / Math.max(s1.length, s2.length);
  return r * 100;
}

module.exports = {
  hash: function (plaintext) {
    var hashPtr = ref.allocCString(Array(FUZZY_MAX_RESULT).join(' '));
    res = ssdeep.fuzzy_hash_buf(plaintext, plaintext.length, hashPtr);
    if (res != 0) {
      return null;
    }
    var hash = hashPtr.readCString();
    return hash;
  },

  hash_from_file: function (filepath) {
    var hashPtr = ref.allocCString(Array(FUZZY_MAX_RESULT).join(' '));
    var res = ssdeep.fuzzy_hash_filename(filepath, hashPtr);
    if (res != 0) {
      return null;
    }
    var hash = hashPtr.readCString();
    return hash;
  },

  compare: function (digest1, digest2) {
    return ssdeep.fuzzy_compare(digest1, digest2);
  },

  similarity: function (d1, d2) {
    var b1 = B64.indexOf(d1.charAt(0));
    var b2 = B64.indexOf(d2.charAt(0));
    if (b1 > b2) return arguments.callee(d2, d1);

    if (Math.abs(b1 - b2) > 1) {
      return 0;
    } else if (b1 === b2) {
      return matchScore(d1.split(':')[1], d2.split(':')[1]);
    } else {
      return matchScore(d1.split(':')[2], d2.split(':')[1]);
    }
  },
};

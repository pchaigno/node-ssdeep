var ssdeep = require('../src/index.js');
var expect = require('chai').expect
var fs = require('fs');

describe('ssdeep', function() {
  var hash_lorem1 = '192:NAE6bcwSSZcKiBwrOdGrecEFBJSE+51vasvxc2CaB1pqU80oEhwNeLivjlSbLbZv:aEXciJarmD0701o7pACWiV1ut87tD';

  context('compute hash for string', function() {
    var content; 
    beforeEach(function() {
      content = fs.readFileSync('test/lorem1.txt', 'utf8');
    });
    it('returns the expected hash', function() {
      var hash = ssdeep.hash(content);
      expect(hash).to.eql(hash_lorem1);
    });
  });

  context('compute hash for file', function() {
    it('returns the expected hash', function() {
      var hash = ssdeep.hash_from_file('test/lorem1.txt');
      expect(hash).to.eql(hash_lorem1);
    });
  });

  context('compute hash for inexistant file', function() {
    it('returns the expected hash', function() {
      var hash = ssdeep.hash_from_file('lorem1.txt');
      expect(hash).to.eql(null);
    });
  });

  context('compare hashes of two files', function() {
    it('returns a 99% match', function() {
      var hash1 = ssdeep.hash_from_file('test/lorem1.txt');
      var hash2 = ssdeep.hash_from_file('test/lorem2.txt');
      var score = ssdeep.compare(hash1, hash2);
      expect(score).to.eql(99);
    });
  });
});
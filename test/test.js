var ssdeep = require('../src/index.js');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var should = chai.should();
var assert = require('assert');





describe('ssdeep', function() {

  //mocha sanity check
  describe('#equal', function () {

    var three = '3';
    it('should return true that 3 equals "3"', function (done) {
      assert.equal(three, '3', '3 equals "3"');
      done();
    });
    it('"3" only strictly equals 3.toString()', function (done) {
      assert.strictEqual(three, '3', '3 equals "3"');
      done();
    });
  });


  var hash_lorem1 = '192:NAE6bcwSSZcKiBwrOdGrecEFBJSE+51vasvxc2CaB1pqU80oEhwNeLivjlSbLbZv:aEXciJarmD0701o7pACWiV1ut87tD';


  context('test for string', function() {
    var content;
    beforeEach(function() {
      content = fs.readFileSync('test/lorem1.txt', 'utf8');
    });
    it('returns the expected string', function() {

      var textTxt='hello';
      expect(textTxt).to.eql('hello');


    });
  });

  context('compute hash for string', function() {
    var content;
    beforeEach(function() {
      //fs.readFileSync returns buffer if no options specified
      //if option like utf8 specified returns string
      content = fs.readFileSync('test/lorem1.txt', 'utf8');


    });

    it('returns the expected hash', function() {
     var ssdeep = require('../src/index.js');
      var hash = ssdeep.hash(content,'utf8');
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
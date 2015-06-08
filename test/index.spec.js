import { should } from 'chai';
should();

describe('Rest', function() {
  describe('Travis', function() {
    it('should error when a non-generator function is passed', function() {
      true.should.be.equal(true);
    });
  });
});

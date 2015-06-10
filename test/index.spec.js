import { should } from 'chai';
import { Restch } from '../src/index';
should();

describe('restch.use(fn)', function() {
  it('should compose middleware', function(done){
    var restch = new Restch();
    var calls = [];

    restch.use(function *(next){
      calls.push(1);
      yield next;
      calls.push(4);
    });

    restch.use(function *(next){
      calls.push(2);
      yield next;
    });

    restch.use(function *(next){
      yield next;
      calls.push(3);
    });

    restch.cb().then(function() {
      let error;
      try {
        calls.should.deep.equal([ 1, 2, 3, 4 ]);
      } catch(err) {
        error = err;
      }
      done(error);
    });
  })
})

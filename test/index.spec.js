import { should } from 'chai';
import { Restch } from '../src/index';
should();

describe('restch.use(fn)', function() {
  it('should work with async function', function(done){
    var restch = new Restch();
    var calls = [];

    restch.use(function *(next){
      calls.push(1);
      yield next;
      calls.push(3);
    });

    restch.use(async function(next){
      calls.push(2);
      await Promise.resolve(true);
    });

    restch.cb().then(function() {
      let error;
      try {
        calls.should.deep.equal([ 1, 2, 3 ]);
      } catch(err) {
        error = err;
      }
      done(error);
    });
  })

  it('should work return promise', function(done){
    var restch = new Restch();
    var calls = [];

    restch.use(function *(next){
      calls.push(1);
      yield next;
      calls.push(3);
    });

    restch.use(function(next){
      calls.push(2);
      return Promise.resolve(true);
    });

    restch.cb().then(function() {
      let error;
      try {
        calls.should.deep.equal([ 1, 2, 3 ]);
      } catch(err) {
        error = err;
      }
      done(error);
    });
  })
})

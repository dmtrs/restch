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
      calls.push(6);
    });

    restch.use(function (next){
      calls.push(2);
      return Promise.resolve(true);
    });

    restch.use(async function(next){
      calls.push(3);
      return await Promise.resolve(true);
    });

    restch.use(function *(next){
      calls.push(4);
      yield next;
      calls.push(5);
    });

    restch.cb().then(function() {
      let error;
      try {
        calls.should.deep.equal([ 1, 2, 3, 4, 5, 6 ]);
      } catch(err) {
        error = err;
      }
      done(error);
    });
  })
})

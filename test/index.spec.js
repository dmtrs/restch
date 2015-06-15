import { should } from 'chai';
import { Restch } from '../src/index';
should();

describe('restch.use(fn)', function() {
  it('should compose middleware', function(done){
    var http = function() {
      return Promise.resolve(true);
    };
    var restch = new Restch(http);
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
  });
});

describe('rest.cb(ctx)', function() {

  it('should have access to context on resolve', function(done) {
    var fullUrl = 'http://localhost/foo/1';
    var req = { method: 'GET' };
    var data = { type: 'foo', id: 1 };

    let http = function(url, request) {
      url.should.be.equal(fullUrl);
      request.should.be.deep.equal(req);
      return Promise.resolve({ data: data });
    };

    var restch = new Restch(http);
    restch.use(function *(next){
      this.url = fullUrl;
      this.request = req;
      yield next;
      this.response = this.response.data;
    });

    restch.cb().then(function(res) {
      res.should.be.deep.equal(data);
      done();
    });
  });

  it('should have access to context on reject', function(done) {
    var response = { error: { something: 'went wrong' } };
    let http = function() {
      return Promise.reject(response);
    };

    var restch = new Restch(http);
    restch.use(function *(next){
      yield next;
      this.response = this.response.error;
    });

    restch.cb().catch(function(err) {
      err.should.be.deep.equal(response.error);
      done();
    });

  });

});

import { default as d } from 'debug';
import { default as compose } from 'koa-compose';
import { default as co } from 'co';
let debug = d('restch');

export class Restch {
  /**
   * @param {function} http
   * @api public
   **/
  constructor(http) {
    this.http = http;
    this.middleware = [];
  }

  /**
   * @param {function} fn
   * @return {Restch} self
   **/
  use(fn) {
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }

  cb(ctx) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var begin = function* (next) {
        yield next;
        if (this.error) {
          return reject(this.response);
        }
        return resolve(this.response);
      };

      var req = function* () {
        yield (async () => {
          try {
            this.response = await self.http(this.url, this.request);
          } catch(err) {
            this.response = err;
            this.error = true;
          }
        })();
      };

      var mw = [begin].concat(self.middleware).concat([req]);

      ctx = ctx || {
        url: '',
        request: {},
        response: null,
        error: false
      };
      co.wrap(compose(mw)).call(ctx);
    });
  }
}

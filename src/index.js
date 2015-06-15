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
        return resolve(this.response);
      };

      var req = function* () {
        yield (async () => {
          try {
            this.response = await self.http(this.url, this.request);
          } catch(err) {
            reject(err);
          }
        })();
      };

      var mw = [begin].concat(self.middleware).concat([req]);

      ctx = ctx || {
        url: '',
        request: {},
        response: null
      };
      co.wrap(compose(mw)).call(ctx);
    });
  }
}

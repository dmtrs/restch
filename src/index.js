import { default as d } from 'debug';
import { default as compose } from 'composition';
let debug = d('restch');

function *respond(next) {
  yield next;
}

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

  cb() {
    let mw = [respond].concat(this.middleware);
    let fn = compose(mw);
    return fn.call(this);
  }
}

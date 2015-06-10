import { default as d } from 'debug';
import { default as compose } from 'composition';
let debug = d('restch');

async function respond(next) {
  try {
    return await Promise.resolve(next);
  } catch(err) {
    //do something
  }
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
    let mw = this.middleware.concat([respond]);
    let fn = compose(mw);
    return fn.call(this);
  }
}

'use strict';
try {
  require('babel/register')({
      optional: ['asyncToGenerator'],
      sourceMaps: true
  });
} catch (e) {
  console.log(e);
}

'use strict';

const parse = (val) => {
  val = val.toString().toLowerCase();

  if (val === "0" || val === "false") {
    return false;
  }

  if (val === "1" || val === "true") {
    return true;
  }

  return null;
}

const isBoolean = (val) => {
  return parse(val) !== null;
}

module.exports = {
  parse,
  isBoolean
}

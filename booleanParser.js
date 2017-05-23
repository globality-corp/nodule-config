const parse = (val) => {
  const stringVal = val.toString().toLowerCase();

  if (stringVal === "0" || stringVal === "false") {
    return false;
  }

  if (stringVal === "1" || stringVal === "true") {
    return true;
  }

  return null;
};

const isBoolean = (val) => {
  const parsedValue = parse(val);
  return parsedValue !== null;
};

const parseIfShould = (val, shouldParse) => {
  if (shouldParse && isBoolean(val)) {
    return parse(val);
  }
  return val;
}

module.exports = {
  parse,
  isBoolean,
  parseIfShould,
};

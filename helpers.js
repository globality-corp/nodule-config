const camelCase = (str) => {
  return str.toLowerCase().replace(/([-_][a-z])/g, function($1){return $1.toUpperCase().replace(/[-_]/,'');});
}

module.exports = {
  camelCase,
}


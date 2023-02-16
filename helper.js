const handlebars = require('handlebars');


handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});

module.exports = handlebars;

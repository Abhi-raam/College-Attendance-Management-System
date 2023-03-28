const handlebars = require('handlebars');
const moment = require('moment');


handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});

handlebars.registerHelper('dateFormat', function(date) {
  return moment(date).format('DD MMM YYYY');
});

handlebars.registerHelper('getDate', function(date) {
  return new Date(date).getDate();
});

handlebars.registerHelper('eq', function(arg1, arg2) {
  return arg1 == arg2;
});

handlebars.registerHelper('gt', function(a, b, options) {
  if (a > b) {
    return options.fn(this);
  }
  return options.inverse(this);
});


module.exports = handlebars;

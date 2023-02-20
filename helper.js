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






module.exports = handlebars;

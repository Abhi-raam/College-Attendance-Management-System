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
handlebars.registerHelper('getMonth',function(date){
  return new Date(date).getMonth()+1
})
// handlebars.registerHelper('getMonth', function(dateString) {
//   const date = new Date(dateString);
//   return date.getMonth()+1  // add 1 to the month to get the correct month number (January is 0)
// });
handlebars.registerHelper('eq', function(arg1, arg2) {
  return arg1 == arg2;
});

handlebars.registerHelper('gt', function(a, b, options) {
  if (a > b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper('for', function(from, to, incr, block) {
  let accum = '';
  for(let i = from; i <= to; i += incr) {
    accum += block.fn(i);
  }
  return accum;
});




module.exports = handlebars;

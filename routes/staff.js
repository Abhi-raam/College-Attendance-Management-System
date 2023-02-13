var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('staff/staff-login',{})
});

router.get('/',(req,res)=>{
  res.render('staff/staff-index',{staff:true})
})

module.exports = router;

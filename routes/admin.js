var express = require('express');
var router = express.Router();
var db = require("../config/connection");
var adminHelper = require('../helpers/admin-helpers')


/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('admin/admin-login', { });
});

router.get('/',(req,res)=>{
  res.render('admin/index',{admin:true})
})

router.get('/teacher',(req,res)=>{
  adminHelper.viewStaff().then((staff)=>{
    res.render('admin/teachers',{admin:true,staff})
  })
})

router.get('/add-teachers',(req,res)=>{
  res.render('admin/add-teachers',{admin:true})
})
router.post('/add-teachers',(req,res)=>{
  // console.log(req.body);
  // console.log(req.files.Image);
  adminHelper.addStaff(req.body,(callback)=>{
    res.render('admin/add-teachers',{admin:true})
  })
})

router.get('/reg-17-student',(req,res)=>{
  res.render('admin/student-17',{admin:true})
})
router.get('/reg-17/cse-01',(req,res)=>{
  res.render('admin/cse/reg-17/cse-01',{admin:true})
})


router.get('/reg-21-student',(req,res)=>{
  res.render('admin/student-21',{admin:true})
})

router.get('/cse-staff-details',(req,res)=>{
  //after setting database data will be added dynamically
  adminHelper.viewStaff().then((staff)=>{
    res.render('admin/cse-staff-details',{admin:true,staff})
  })
})
router.get('/civil-staff-details',(req,res)=>{
  //after setting database data will be added dynamically
  adminHelper.viewStaff().then((staff)=>{
    res.render('admin/civil-staff-details',{admin:true,staff})
  })
})
router.get('/ece-staff-details',(req,res)=>{
  //after setting database data will be added dynamically
  adminHelper.viewStaff().then((staff)=>{
    res.render('admin/ece-staff-details',{admin:true,staff})
  })
})
router.get('/mech-staff-details',(req,res)=>{
  //after setting database data will be added dynamically
  adminHelper.viewStaff().then((staff)=>{
    res.render('admin/mech-staff-details',{admin:true,staff})
  })
})



module.exports = router;

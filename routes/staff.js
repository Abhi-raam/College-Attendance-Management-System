var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const { response } = require('../app');
var db = require("../config/connection");
const { students } = require('../helpers/staff-helpers');
var staffHelper = require('../helpers/staff-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/staff/login')
  }
}


/* GET users listing. */
router.get('/login',function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/staff')
  }else{
    res.render('staff/staff-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
});
router.post('/login',(req,res)=>{
  staffHelper.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.loggedIn = true
      req.session.staff = response.staff
      res.redirect('/staff')
    } else {
      req.session.loginErr="Invalid username or password"
      res.redirect('/staff/login')
    }
  })
})


router.get('/staff-logout',(req,res)=>{
  // req.session.staff = null
  // res.session.userLoggedIn=false
  // res.redirect('/staff/login')
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("Session have been destroyed");
      res.redirect('/staff/login')
    }
  })
})

router.get('/',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  // console.log(staff);
  if (req.session.loggedIn) {
    res.render('staff/staff-index', { staff })
  }
  else {
    res.redirect('/staff/login')
  }
  // res.render('staff/staff-index',{staff})
})
router.get('/students',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.students(staff).then((students)=>{
    // console.log(students); 
    res.render('staff/students',{staff,students})
  })
})
// this is the route to add attendance
router.get('/add-attendance',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  // console.log(req.body);
  staffHelper.students(staff).then((students)=>{
    staffHelper.viewAttendance(staff).then((std)=>{
      res.render('staff/add-attendance',{staff,students,std})
    })
  })
})
router.post('/add-attendance',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.students(staff).then((students)=>{
    let registerNumber = req.body.RegisterNo
    staffHelper.addAttendance(registerNumber,req.body,staff).then(()=>{
      res.redirect('/staff/add-attendance')
    })
  })
})

router.get('/view-attendance',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.students(staff).then((students)=>{
    // console.log(students[0]._id);
    // students.forEach((student) => {
    //   console.log(student._id.toString());
    // });
    staffHelper.viewAttendance(staff).then((std)=>{
      // let attendance = std.Attendance
      // console.log(attendance);
      // std.forEach((std)=>{
      //   console.log(std.Attendance);
      // })
      res.render('staff/view-attendance',{staff,std})
    })
  })
})

module.exports = router;

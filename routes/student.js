var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const { response } = require('../app');
var db = require("../config/connection");
const studentHelper = require('../helpers/student-helper')
const { students } = require('../helpers/staff-helpers');
var staffHelper = require('../helpers/staff-helpers');
const { logger } = require('../helper');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/student/login')
  }
}

router.get('/student-logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log((err));
    }else{
      console.log("Session have been destroyed");
      res.redirect('/')
    }
  })
})

router.get('/login',(req,res)=>{
  if (req.session.loggedIn) {
    res.redirect('/student')
  } else {
    res.render('student/student-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})
router.post('/login',(req,res)=>{
    console.log(req.body);
    studentHelper.doLogin(req.body).then((response)=>{
      if (response.status) {
        req.session.loggedIn = true
        req.session.student = response.student
        res.redirect('/student')
      } else {
        req.session.loginErr = "Invalid username or password"
        res.redirect('/student/login')
      }
    })
})
router.get('/',verifyLogin,(req,res)=>{
  let student = req.session.student
  console.log(student);
    res.render('student/student-index',{student})
})

router.get('/view-attendance',verifyLogin,(req,res)=>{
  let student = req.session.student
  let department = req.session.student.Department
  let stdyear = req.session.student.Year
  res.render('student/view-attendance',{student,department,stdyear})
})

 router.post('/viewAttendanceMonth',verifyLogin,(req,res)=>{
  let student = req.session.student
  let department = req.query.dpt
  let stdyear = req.query.year
  let dte = new Date(req.body.month)
  let month = dte.getMonth()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let year = dte.getFullYear()
  let Month = monthNames[month]
  studentHelper.getAttendanceDatesForStudent(req.body.month,student).then((studentList)=>{
    console.log(studentList);
    if(studentList.length === 0){
      res.render('student/view-attendance',{student,submittedMonth:true,noDataFound:true,Month,year,department,stdyear })
    }else{
      res.render('student/view-attendance',{student,submittedMonth:true,studentList,Month,year,department,stdyear })
    }
  }).catch(error=>{
    res.redirect('/student/viewAttendanceMonth')
  })
 })

 router.post('/viewFullAttendance',verifyLogin,(req,res)=>{
  let student = req.session.student
  studentHelper.getAttendanceStd(student).then((studentList)=>{
    console.log(studentList);
    studentList.sort(function(a, b) {
      return new Date(a.DateTaken) - new Date(b.DateTaken);
    });
    console.log(studentList);
    res.render('student/view-attendance',{student,studentList})
  })
 })


module.exports = router
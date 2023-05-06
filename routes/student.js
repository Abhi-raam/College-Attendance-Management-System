var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const { response } = require('../app');
var db = require("../config/connection");
var studentHelper = require('../helpers/student-helper')
// const { students } = require('../helpers/staff-helpers');
// var staffHelper = require('../helpers/staff-helpers');
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

 router.post('/viewFullAttendance',verifyLogin,(req,res)=>{
  let student = req.session.student
  studentHelper.getAttendanceStd(student).then((studentList)=>{
    console.log(studentList);
    studentList.sort(function(a, b) {
      return new Date(a.DateTaken) - new Date(b.DateTaken);
    });
    console.log(studentList);
    if(studentList.length === 0){
      res.render('student/view-attendance',{student,submittedMonth:true})
    }else{
      res.render('student/view-attendance',{student,submittedMonth:true,studentList })
    }
    // res.render('student/view-attendance',{student,studentList})
  })
 })

 router.get('/viewAttendancePersent',verifyLogin,(req,res)=>{
  let student = req.session.student
  console.log(student);
  res.render('student/view-attendance-persentage',{student})
 })
 router.post('/viewAttendancePersent',verifyLogin,(req,res)=>{
  let student = req.session.student
  studentHelper.viewAttendancePersent(student).then((result)=>{
    let Name = result.stdName
    let workingDay = result.workingDay
    let presentDay = result.presentCount
    let absent = workingDay - presentDay
    let present = (presentDay / workingDay) * 100
    let round = Math.round(present)
    res.render('student/view-attendance-persentage',{submitted: true, student, workingDay, presentDay, round, absent, Name })
  })
  .catch(error => {
    // handle the error here
    res.redirect('/student/viewAttendancePersent')
  });
 })


module.exports = router
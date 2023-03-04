var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const { response } = require('../app');
var db = require("../config/connection");
const { students } = require('../helpers/staff-helpers');
var staffHelper = require('../helpers/staff-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/staff/login')
  }
}


/* GET users listing. */
router.get('/login', function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/staff')
  } else {
    res.render('staff/staff-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
});
router.post('/login', (req, res) => {
  staffHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.staff = response.staff
      res.redirect('/staff')
    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/staff/login')
    }
  })
})


router.get('/staff-logout', (req, res) => {
  // req.session.staff = null
  // res.session.userLoggedIn=false
  // res.redirect('/staff/login')
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Session have been destroyed");
      res.redirect('/staff/login')
    }
  })
})

router.get('/', verifyLogin, (req, res) => {
  let staff = req.session.staff
  if (req.session.loggedIn) {
    res.render('staff/staff-index', { staff })
  }
  else {
    res.redirect('/staff/login')
  }
})
router.get('/students', verifyLogin, (req, res) => {
  let staff = req.session.staff
  staffHelper.students(staff).then((students) => { 
    res.render('staff/students', { staff, students })
  })
})
// this is the route to add attendance
router.get('/add-attendance', verifyLogin, (req, res) => {
  let staff = req.session.staff
  // Today's date
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0'); // padStart ensures that there are always 2 digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-indexed month, so add 1
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  // Today's date end here
  staffHelper.students(staff).then((students) => {
    staffHelper.addInitialAttendance(staff,students).then((response)=>{
      res.render('staff/add-attendance', { staff, students, formattedDate })
    })
  })
})
router.post('/add-attendance', verifyLogin, (req, res) => {
  let staff = req.session.staff
  let stdId = req.body.check
  let dateTaken = req.body.Date
  let allStd = req.body.admissionNo
  console.log(stdId);
  console.log(dateTaken);
  console.log(allStd);
  staffHelper.addAttendance(stdId,dateTaken,staff,allStd).then((response)=>{
    res.redirect('/staff/add-attendance')
  })

})

router.get('/view-attendance', verifyLogin, (req, res) => {
  let staff = req.session.staff
  staffHelper.students(staff).then((students) => {
      res.render('staff/view-attendance', { staff })
  })
})

module.exports = router;

var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const { response } = require('../app');
var db = require("../config/connection");
const { students } = require('../helpers/staff-helpers');
var staffHelper = require('../helpers/staff-helpers');
const { logger } = require('../helper');
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

router.get('/viewprofile/:id',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.viewStaff(req.params.id).then((staffDetails)=>{
    console.log(staffDetails);
    res.render('staff/view-profile',{staff,staffDetails})
  })
})

router.get('/editprofile/:id',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.viewStaff(req.params.id).then((staffDetails)=>{
    res.render('staff/edit-profile',{staff,staffDetails})
  })
})
router.post('/editprofile/:id',verifyLogin,(req,res)=>{
  // console.log(res.body);
  let staffId = req.params.id
  let staffDetails = req.body
  let image = req.files.Image
  staffHelper.editStaff(staffId,staffDetails).then(()=>{
    image.mv('./public/images/staff/'+staffId+'.jpg',(err,data)=>{
      if(!err){
        res.redirect('/staff')
      }else{
        res.redirect('/staff/editprofile')
      }
    })
  })
})

router.get('/staff-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Session have been destroyed");
      res.redirect('/')
    }
  })
})

router.get('/', verifyLogin, (req, res) => {
  let staff = req.session.staff
  if (req.session.loggedIn) {
    staffHelper.stdCount(staff).then((students)=>{
      let count = students.length
      res.render('staff/staff-index', { staff,count,students })
    })
  }
  else {
    res.redirect('/staff/login')
  }
})
router.post('/',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  let stdId = req.body.RegNo
  staffHelper.viewPresent(staff,stdId).then((result)=>{
    console.log(result.name);
    let Name = result.stdName
    let totalDays = result.attendanceLength
    let presentDay = result.presentCount
    let absent = totalDays-presentDay
    let present = (presentDay/totalDays)*100
    let round = Math.round(present)
    staffHelper.students(staff).then((students) => { 
      res.render('staff/staff-index', { staff, students,totalDays,presentDay,round,absent,Name })
    })
  }).catch(error => {
    // handle the error here
    res.redirect('/staff')
  });
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
  // console.log(dateTaken);
  console.log(allStd);
  staffHelper.addAttendance(stdId,dateTaken,staff,allStd).then((response)=>{
    res.redirect('/staff/add-attendance')
  })
})


router.get('/view-attendance', verifyLogin, (req, res) => {
  let staff = req.session.staff
  let department = req.session.staff.Department
  let stdyear = req.session.staff.Year
  staffHelper.students(staff).then((studentList) => {
      res.render('staff/view-attendance', { staff,studentList,department,stdyear })
  })
})
router.post('/view-attendance', verifyLogin, (req, res) => {
  let dte = new Date(req.body.dateTaken)
  let day = dte.getDate().toString().padStart(2, '0');
  let month = (dte.getMonth() + 1).toString().padStart(2, '0');
  let year = dte.getFullYear()
  let date = (`${day}/${month}/${year}`)
  let staff = req.session.staff;
  let department = req.session.staff.Department
  let stdyear = req.session.staff.Year
  staffHelper.viewAttendance(staff, req.body.dateTaken).then((studentList) => {
    if (studentList.length === 0) {
      res.render('staff/view-attendance', {noDataFound: true,staff,submitted: true ,date,department,stdyear});
    } else {
      res.render('staff/view-attendance', { studentList, staff,submitted: true,date,department,stdyear });
    }
  });
});
router.post('/viewAttendanceMonth', verifyLogin, (req, res) => {
  let staff = req.session.staff
  let department = req.query.dpt
  let stdyear = req.query.year
  let dte = new Date(req.body.month)
  let month = dte.getMonth()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let year = dte.getFullYear()
  let Month = monthNames[month]
  staffHelper.viewAttendanceMonth(req.body,req.body.month,department,stdyear).then((studentList)=>{
    console.log(studentList);
    if(studentList.length === 0){
      res.render('staff/view-attendance', { staff,submittedMonth:true,noDataFound:true,Month,year,department,stdyear })
    }else{
      res.render("staff/view-attendance", { staff,submittedMonth:true,studentList,Month,year,department,stdyear })
    }
  })
})

router.get('/viewAttendancePrecent',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  staffHelper.students(staff).then((students) => { 
    res.render('staff/view-attendance-persentage', { staff, students })
  })
})

router.post('/viewAttendancePrecent',verifyLogin,(req,res)=>{
  let staff = req.session.staff
  let stdId = req.body.RegNo
  staffHelper.viewPresent(staff,stdId).then((result)=>{
    console.log(result.name);
    let Name = result.stdName
    let totalDays = result.attendanceLength
    let presentDay = result.presentCount
    let absent = totalDays-presentDay
    let present = (presentDay/totalDays)*100
    let round = Math.round(present)
    staffHelper.students(staff).then((students) => { 
      res.render('staff/view-attendance-persentage', {submitted: true, staff, students,totalDays,presentDay,round,absent,Name })
    })
  }).catch(error => {
    // handle the error here
    res.redirect('/staff/viewAttendancePrecent')
  });
})

module.exports = router;

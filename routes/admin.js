var express = require('express');
var router = express.Router();
var fs = require('fs');
const { ObjectId } = require('mongodb');
var db = require("../config/connection");
var adminHelper = require('../helpers/admin-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/admin/admin-login')
  }
}

/* GET home page. */
router.get('/admin-login', function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false
  }
});
router.post('/admin-login', (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin')
    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/admin/admin-login')
    }
  })
})
router.get('/admin-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Session destroyed");
      res.redirect('/')
    }
  })
})

router.get('/', verifyLogin, (req, res) => {
  let admin = req.session.admin
  Promise.all([adminHelper.viewCseStudent(),adminHelper.viewCivilStudents(),adminHelper.viewEceStudents(),adminHelper.viewMechStudents()]).then((students)=>{
    let cseStd = students[0]
    let civilStd = students[1]
    let eceStd = students[2]
    let mechStd = students[3]
    res.render('admin/index', {admin,cseStd,civilStd,eceStd,mechStd})
  })
})

router.get('/view-profile/:id',verifyLogin,(req,res)=>{
  let admin = req.session.admin
  adminHelper.viewAdmin(req.params.id).then((adminDetails)=>{
    res.render('admin/admin_pg/view-profile',{admin,adminDetails})
  })
})
router.get('/edit-profile/:id',verifyLogin,(req,res)=>{
  let admin = req.session.admin
  adminHelper.viewAdmin(req.params.id).then((adminDetails)=>{
    console.log(adminDetails);
    res.render('admin/admin_pg/edit-admin',{admin,adminDetails})
  })
})
router.post('/edit-profile/:id',verifyLogin,((req,res)=>{
  let admin = req.session.admin
  let adminId = req.params.id
  let adminDetails = req.body
  let image = req.files.Image
  adminHelper.editAdmin(adminId,adminDetails).then(()=>{
    image.mv('./public/images/admin/'+ adminId +'.jpg',(err,data)=>{
      if(!err){
        res.redirect('/admin')
      }else{
        res.redirect('/admin/edit-profile');
      }
    })
  })
}))

router.get('/teacher', verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/teachers', { admin })
})

// -------->add teacher route<--------
router.get('/add-teachers',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/add-teachers', { admin })
})
router.post('/add-teachers',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.addStaff(req.body, (id) => {
    let image = req.files.Image
    console.log("this is the inserted id ::" + id);
    image.mv('./public/images/staff/' + id + '.jpg', (err, data) => {
      if (!err) {
        res.render('admin/add-teachers', { admin})
      } else {
        console.log(err);
      }
    })

  })
})
// --------->add teacher end here<--------

// --------->edit teacher<--------
router.get('/edit-staff/:id',verifyLogin, async (req, res) => {
  let admin = req.session.admin
  let staff = await adminHelper.viewOneStaff(req.params.id)
  res.render('admin/edit-staff', { admin, staff })
})
router.post('/edit-staff/:id',verifyLogin, (req, res) => {
  let department = req.body.Department
  adminHelper.editStaff(req.params.id, req.body).then(() => {
    if (department == "CSE") {
      res.redirect('/admin/cse-staff')
    }
    else if (department == "ECE") {
      res.redirect('/admin/ece-staff')
    } else if (department == "CIVIL") {
      res.redirect('/admin/civil-staff')
    } else if (department == "MECH") {
      res.redirect('/admin/mech-staff')
    }
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/images/staff/' + req.params.id + '.jpg')
    }
  })
})
// -------->edit teacher end here<--------


router.get('/delete-staff/:id/:department',verifyLogin, (req, res) => {
  let staffId = req.params.id
  let department = req.params.department
  if (department == "CSE") {
    adminHelper.deleteCseStaff(staffId).then((response) => {
      fs.unlink('./public/images/staff/' + staffId + '.jpg', () => {
        console.log("Deleted => " + staffId);
      })
      res.redirect('/admin/cse-staff')
    })
  }
  else if (department == "ECE") {
    adminHelper.deleteCseStaff(staffId).then((response) => {
      fs.unlink('./public/images/staff/' + staffId + '.jpg', () => {
        console.log("Deleted => " + staffId);
      })
      res.redirect('/admin/ece-staff')
    })
  }
  else if (department == "MECH") {
    adminHelper.deleteCseStaff(staffId).then((response) => {
      fs.unlink('./public/images/staff/' + staffId + '.jpg', () => {
        console.log("Deleted => " + staffId);
      })
      res.redirect('/admin/mech-staff')
    })
  }
  else if (department == "CIVIL") {
    adminHelper.deleteCseStaff(staffId).then((response) => {
      fs.unlink('./public/images/staff/' + staffId + '.jpg', () => {
        console.log("Deleted => " + staffId);
      })
      res.redirect('/admin/civil-staff')
    })
  }
})

// -------->viewing all teachers based on their respective department<--------
router.get('/cse-staff',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCseStaff().then((staff) => {
    // console.log(staff);
    res.render('admin/staffs/cse-staff', { admin, staff })
  })
})
router.get('/ece-staff',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewEceStaff().then((staff) => {
    res.render('admin/staffs/ece-staff', { admin, staff })
  })
})
router.get('/mech-staff',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewMechStaff().then((staff) => {
    res.render('admin/staffs/mech-staff', { admin, staff })
  })
})
router.get('/civil-staff',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCivilStaff().then((staff) => {
    res.render('admin/staffs/civil-staff', { admin, staff })
  })
})
// -------->viewing teachers end here<--------

// // -------->viewing teachers only for printing their datails to pdf<--------
// router.get('/cse-staff-details',verifyLogin, (req, res) => {
//   let admin = req.session.admin
//   adminHelper.viewCseStaff().then((staff) => {
//     res.render('admin/cse-staff-details', { admin, staff })
//   })
// })
// router.get('/civil-staff-details', (req, res) => {
//   let admin = req.session.admin
//   adminHelper.viewCivilStaff().then((staff) => {
//     res.render('admin/civil-staff-details', { admin, staff })
//   })
// })
// router.get('/ece-staff-details', (req, res) => {
//   let admin = req.session.admin
//   adminHelper.viewEceStaff().then((staff) => {
//     res.render('admin/ece-staff-details', { admin, staff })
//   })
// })
// router.get('/mech-staff-details', (req, res) => {
//   let admin = req.session.admin
//   adminHelper.viewMechStaff().then((staff) => {
//     res.render('admin/mech-staff-details', { admin, staff })
//   })
// })
// // -------->viewing for pdf end here<--------

router.get('/students-department',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/students/students-dpt', { admin })
})

// -------->cse students route for adding students<--------
router.get('/add-cse-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/students/cse/add-cse-students', { admin })
})
router.post('/add-cse-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.addCseStudents(req.body).then((response) => {
    res.render('admin/students/cse/add-cse-students', { admin })
  })
})
router.get('/cse-FirstYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCseFirstStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-first-year', { admin, cseStudents })
  })
})
router.get('/cse-SecondYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCseSecondStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-second-year', { admin, cseStudents })
  })
})
router.get('/cse-ThirdYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCseThirdStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-third-year', { admin, cseStudents })
  })
})

router.get('/cse-FourthYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCseFourthStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-fourth-year', { admin, cseStudents })
  })
})
// -------->adding cse student end here<--------

// -------->delete cse student<--------
router.get('/delete-cse-student/:id/:year',verifyLogin, (req, res) => {
  let stdId = req.params.id
  let year = req.params.year
  adminHelper.deleteCseStudent(stdId).then((response) => {
    if (year == "First") {
      res.redirect('/admin/cse-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/cse-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/cse-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/cse-FourthYear')
    }
  })
})
// -------->delete cse students end here<--------

// -------->edit cse students<---------
router.get('/edit-cse-student/:id',verifyLogin, async (req, res) => {
  let admin = req.session.admin
  let cseStudent = await adminHelper.viewOneCseStudent(req.params.id)
  res.render('admin/students/cse/edit-cse-student', { admin, cseStudent })
})
router.post('/edit-cse-student/:id',verifyLogin, (req, res) => {
  let year = req.body.Year
  console.log(year);
  adminHelper.editCseStudent(req.params.id, req.body).then(() => {
    if (year == "First") {
      res.redirect('/admin/cse-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/cse-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/cse-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/cse-FourthYear')
    }
  })
})
// -------->edit cse student end here<--------

// -------->ece students route for adding students<--------
router.get('/add-ece-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/students/ece/add-ece-students', { admin })
})
router.post('/add-ece-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.addEceStudents(req.body).then((response) => {
    res.render('admin/students/ece/add-ece-students', { admin })
  })
})
// -------->adding ece student end here<--------


router.get('/ece-FirstYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewEceFirstStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-first-year', { admin, eceStudents, startSNo: 1 })
  })
})
router.get('/ece-SecondYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewEceSecondStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-second-year', { admin, eceStudents })
  })
})
router.get('/ece-ThirdYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewEceThirdStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-third-year', { admin, eceStudents })
  })
})

router.get('/ece-FourthYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewEceFourthStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-fourth-year', { admin, eceStudents })
  })
})


// -------->delete ece student<--------
router.get('/delete-ece-student/:id/:year',verifyLogin, (req, res) => {
  let stdId = req.params.id
  let year = req.params.year
  adminHelper.deleteEceStudent(stdId).then((response) => {
    if (year == "First") {
      res.redirect('/admin/ece-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/ece-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/ece-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/ece-FourthYear')
    }
  })
})
// -------->delete ece students end here<--------

// -------->edit ece students<---------
router.get('/edit-ece-student/:id',verifyLogin, async (req, res) => {
  let eceStudent = await adminHelper.viewOneEceStudent(req.params.id)
  res.render('admin/students/ece/edit-ece-student', { admin: true, eceStudent })
})
router.post('/edit-ece-student/:id',verifyLogin, (req, res) => {
  let year = req.body.Year
  adminHelper.editEceStudent(req.params.id, req.body).then(() => {
    if (year == "First") {
      res.redirect('/admin/ece-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/ece-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/ece-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/ece-FourthYear')
    }
  })
})
// -------->edit ece student end here<--------

// =============================================================MECH functions============================================

router.get('/add-mech-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/students/mech/add-mech-students', { admin})
})
router.post('/add-mech-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.addMechStudents(req.body).then((response) => {
    res.render('admin/students/mech/add-mech-students', { admin })
  })
})
// -------->adding mech student end here<--------


router.get('/mech-FirstYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewMechFirstStudents().then((mechStudents) => {
    res.render('admin/students/mech/mech-first-year', { admin, mechStudents, startSNo: 1 })
  })
})
router.get('/mech-SecondYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewMechSecondStudents().then((mechStudents) => {
    res.render('admin/students/mech/mech-second-year', { admin, mechStudents })
  })
})
router.get('/mech-ThirdYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewMechThirdStudents().then((mechStudents) => {
    res.render('admin/students/mech/mech-third-year', { admin, mechStudents })
  })
})

router.get('/mech-FourthYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewMechFourthStudents().then((mechStudents) => {
    res.render('admin/students/mech/mech-fourth-year', { admin, mechStudents })
  })
})


// -------->delete mech student<--------
router.get('/delete-mech-student/:id/:year',verifyLogin, (req, res) => {
  let stdId = req.params.id
  let year = req.params.year
  adminHelper.deleteMechStudent(stdId).then((response) => {
    if (year == "First") {
      res.redirect('/admin/mech-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/mech-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/mech-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/mech-FourthYear')
    }
  })
})
// -------->delete mech students end here<--------

// -------->edit mech students<---------
router.get('/edit-mech-student/:id',verifyLogin, async (req, res) => {
  let admin = req.session.admin
  let mechStudent = await adminHelper.viewOneMechStudent(req.params.id)
  res.render('admin/students/mech/edit-mech-student', { admin, mechStudent })
})
router.post('/edit-mech-student/:id',verifyLogin, (req, res) => {
  let year = req.body.Year
  console.log(year);
  adminHelper.editMechStudent(req.params.id, req.body).then(() => {
    if (year == "First") {
      res.redirect('/admin/mech-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/mech-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/mech-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/mech-FourthYear')
    }
  })
})

// ======================================CIVIL functions================================

router.get('/add-civil-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/students/civil/add-civil-students', { admin})
})
router.post('/add-civil-student',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.addCivilStudents(req.body).then((response) => {
    res.render('admin/students/civil/add-civil-students', { admin })
  })
})
// -------->adding civil student end here<--------


router.get('/civil-FirstYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCivilFirstStudents().then((civilStudents) => {
    res.render('admin/students/civil/civil-first-year', { admin, civilStudents })
  })
})
router.get('/civil-SecondYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCivilSecondStudents().then((civilStudents) => {
    res.render('admin/students/civil/civil-second-year', { admin, civilStudents })
  })
})
router.get('/civil-ThirdYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCivilThirdStudents().then((civilStudents) => {
    res.render('admin/students/civil/civil-third-year', { admin, civilStudents })
  })
})

router.get('/civil-FourthYear',verifyLogin, (req, res) => {
  let admin = req.session.admin
  adminHelper.viewCivilFourthStudents().then((civilStudents) => {
    res.render('admin/students/civil/civil-fourth-year', { admin, civilStudents })
  })
})


// -------->delete civil student<--------
router.get('/delete-civil-student/:id/:year',verifyLogin, (req, res) => {
  let stdId = req.params.id
  let year = req.params.year
  adminHelper.deleteCivilStudent(stdId).then((response) => {
    if (year == "First") {
      res.redirect('/admin/civil-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/civil-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/civil-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/civil-FourthYear')
    }
  })
})
// -------->delete civil students end here<--------

// -------->edit civil students<---------
router.get('/edit-civil-student/:id',verifyLogin, async (req, res) => {
  let admin = req.session.admin
  let civilStudent = await adminHelper.viewOneCivilStudent(req.params.id)
  res.render('admin/students/civil/edit-civil-student', { admin, civilStudent })
})
router.post('/edit-civil-student/:id',verifyLogin, (req, res) => {
  let year = req.body.Year
  console.log(year);
  adminHelper.editCivilStudent(req.params.id, req.body).then(() => {
    if (year == "First") {
      res.redirect('/admin/civil-FirstYear')
    }
    else if (year == "Second") {
      res.redirect('/admin/civil-SecondYear')
    }
    else if (year == "Third") {
      res.redirect('/admin/civil-ThirdYear')
    }
    else if (year == "Fourth") {
      res.redirect('/admin/civil-FourthYear')
    }
  })
})

router.get('/attendance', verifyLogin, (req, res) => {
  let admin = req.session.admin
  if (admin) {
    res.render("admin/attendance/attendance", { admin })
  } else {
    res.redirect('/admin/admin-login')
  }
})

router.get('/viewAttendance', verifyLogin, (req, res) => {
  let admin = req.session.admin
  if (admin) {
  let department = req.query.dpt
  let stdyear = req.query.year
    res.render("admin/attendance/cseFirst", { admin,department,stdyear })
  } else {
    res.redirect('/admin/admin-login')
  }
})
router.post('/viewAttendance', verifyLogin, (req, res) => {
  let admin = req.session.admin
  if (admin) {
  let department = req.query.dpt
  let stdyear = req.query.year
  let dte = new Date(req.body.dateTaken)
  let day = dte.getDate().toString().padStart(2, '0');
  let month = (dte.getMonth() + 1).toString().padStart(2, '0');
  let year = dte.getFullYear()
  let date = (`${day}/${month}/${year}`)
  adminHelper.viewAttendance(req.body,department,stdyear).then((studentList)=>{
    if(studentList.length === 0){
      res.render("admin/attendance/cseFirst", { admin,submittedDate:true,noDataFound:true,date,department,stdyear })
    }else{
      res.render("admin/attendance/cseFirst", { admin,submittedDate:true,studentList,date,department,stdyear })
    }
  })
  } else {
    res.redirect('/admin/admin-login')
  }
})

router.post('/viewAttendanceMonth', verifyLogin, (req, res) => {
  let admin = req.session.admin
  let department = req.query.dpt
  let stdyear = req.query.year
  let dte = new Date(req.body.month)
  let month = dte.getMonth()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let year = dte.getFullYear()
  let Month = monthNames[month]
  adminHelper.viewAttendanceMonth(req.body,req.body.month,department,stdyear).then((studentList)=>{
    if(studentList.length === 0){
      res.render("admin/attendance/cseFirst", { admin,submittedMonth:true,noDataFound:true,Month,year,department,stdyear })
    }else{
      res.render("admin/attendance/cseFirst", { admin,submittedMonth:true,studentList,Month,year,department,stdyear })
    }
  })
})



module.exports = router;

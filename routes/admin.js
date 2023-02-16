var express = require('express');
var router = express.Router();
var fs = require('fs');
const { ObjectId } = require('mongodb');
var db = require("../config/connection");
var adminHelper = require('../helpers/admin-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/admin/admin-login')
  }
}

/* GET home page. */
router.get('/admin-login', function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', {"loginErr":req.session.loginErr});
    req.session.loginErr=false
  }
});
router.post('/admin-login', (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin')
    } else {
      req.session.loginErr="Invalid username or password"
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

router.get('/', (req, res) => {
  let admin = req.session.admin
  console.log(admin);
  if (req.session.loggedIn) {
    res.render('admin/index', { admin })
  }
  else {
    res.redirect('/admin/admin-login')
  }
})

router.get('/teacher', verifyLogin,(req, res) => {
  res.render('admin/teachers', { admin: true })
})

// -------->add teacher route<--------
router.get('/add-teachers', (req, res) => {
  res.render('admin/add-teachers', { admin: true })
})
router.post('/add-teachers', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image);
  adminHelper.addStaff(req.body, (id) => {
    let image = req.files.Image
    console.log("this is the inserted id ::" + id);
    image.mv('./public/images/staff/' + id + '.jpg', (err, data) => {
      if (!err) {
        res.render('admin/add-teachers', { admin: true })
      } else {
        console.log(err);
      }
    })

  })
})
// --------->add teacher end here<--------

// --------->edit teacher<--------
router.get('/edit-staff/:id', async (req, res) => {
  let staff = await adminHelper.viewOneStaff(req.params.id)
  res.render('admin/edit-staff', { admin: true, staff })
})
router.post('/edit-staff/:id', (req, res) => {
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


router.get('/delete-staff/:id/:department', (req, res) => {
  let staffId = req.params.id
  let department = req.params.department
  // console.log("Selected department ::"+department);
  if (department == "CSE") {
    adminHelper.deleteCseStaff(staffId).then((response) => {
      // console.log("This is deleted id =>"+staffId);
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
router.get('/cse-staff', (req, res) => {
  adminHelper.viewCseStaff().then((staff) => {
    // console.log("This is the staff =>");
    res.render('admin/staffs/cse-staff', { admin: true, staff })
  })
})
router.get('/ece-staff', (req, res) => {
  adminHelper.viewEceStaff().then((staff) => {
    res.render('admin/staffs/ece-staff', { admin: true, staff })
  })
})
router.get('/mech-staff', (req, res) => {
  adminHelper.viewMechStaff().then((staff) => {
    res.render('admin/staffs/mech-staff', { admin: true, staff })
  })
})
router.get('/civil-staff', (req, res) => {
  adminHelper.viewCivilStaff().then((staff) => {
    res.render('admin/staffs/civil-staff', { admin: true, staff })
  })
})
// -------->viewing teachers end here<--------

// -------->viewing teachers only for printing their datails to pdf<--------
router.get('/cse-staff-details', (req, res) => {
  adminHelper.viewCseStaff().then((staff) => {
    res.render('admin/cse-staff-details', { admin: true, staff })
  })
})
router.get('/civil-staff-details', (req, res) => {
  adminHelper.viewCivilStaff().then((staff) => {
    res.render('admin/civil-staff-details', { admin: true, staff })
  })
})
router.get('/ece-staff-details', (req, res) => {
  adminHelper.viewEceStaff().then((staff) => {
    res.render('admin/ece-staff-details', { admin: true, staff })
  })
})
router.get('/mech-staff-details', (req, res) => {
  adminHelper.viewMechStaff().then((staff) => {
    res.render('admin/mech-staff-details', { admin: true, staff })
  })
})
// -------->viewing for pdf end here<--------

router.get('/students-department', (req, res) => {
  res.render('admin/students/students-dpt', { admin: true })
})

// -------->cse students route for adding students<--------
router.get('/add-cse-student', (req, res) => {
  res.render('admin/students/cse/add-cse-students', { admin: true })
})
router.post('/add-cse-student', (req, res) => {
  adminHelper.addCseStudents(req.body).then((response) => {
    res.render('admin/students/cse/add-cse-students', { admin: true })
  })
})
router.get('/cse-FirstYear', (req, res) => {
  adminHelper.viewCseFirstStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-first-year', { admin: true, cseStudents })
  })
})
router.get('/cse-SecondYear', (req, res) => {
  adminHelper.viewCseSecondStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-second-year', { admin: true, cseStudents })
  })
})
router.get('/cse-ThirdYear', (req, res) => {
  adminHelper.viewCseThirdStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-third-year', { admin: true, cseStudents })
  })
})

router.get('/cse-FourthYear', (req, res) => {
  adminHelper.viewCseFourthStudents().then((cseStudents) => {
    res.render('admin/students/cse/cse-fourth-year', { admin: true, cseStudents })
  })
})
// -------->adding cse student end here<--------

// -------->delete cse student<--------
router.get('/delete-cse-student/:id/:year', (req, res) => {
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
router.get('/edit-cse-student/:id',async(req,res)=>{
  let cseStudent = await adminHelper.viewOneCseStudent(req.params.id)
  res.render('admin/students/cse/edit-cse-student',{admin:true,cseStudent}) 
})
router.post('/edit-cse-student/:id',(req,res)=>{
  let year = req.body.Year
  console.log(year);
  adminHelper.editCseStudent(req.params.id,req.body).then(()=>{
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
router.get('/add-ece-student', (req, res) => {
  res.render('admin/students/ece/add-ece-students', { admin: true })
})
router.post('/add-ece-student', (req, res) => {
  adminHelper.addEceStudents(req.body).then((response) => {
    res.render('admin/students/ece/add-ece-students', { admin: true })
  })
})
// -------->adding ece student end here<--------


router.get('/ece-FirstYear', (req, res) => {
  adminHelper.viewEceFirstStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-first-year', { admin: true, eceStudents,startSNo: 1 })
  })
})
router.get('/ece-SecondYear', (req, res) => {
  adminHelper.viewEceSecondStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-second-year', { admin: true, eceStudents })
  })
})
router.get('/ece-ThirdYear', (req, res) => {
  adminHelper.viewEceThirdStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-third-year', { admin: true, eceStudents })
  })
})

router.get('/ece-FourthYear', (req, res) => {
  adminHelper.viewEceFourthStudents().then((eceStudents) => {
    res.render('admin/students/ece/ece-fourth-year', { admin: true, eceStudents })
  })
})


// -------->delete ece student<--------
router.get('/delete-ece-student/:id/:year', (req, res) => {
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
router.get('/edit-ece-student/:id',async(req,res)=>{
  let eceStudent = await adminHelper.viewOneEceStudent(req.params.id)
  res.render('admin/students/ece/edit-ece-student',{admin:true,eceStudent}) 
})
router.post('/edit-ece-student/:id',(req,res)=>{
  let year = req.body.Year
  console.log(year);
  adminHelper.editEceStudent(req.params.id,req.body).then(()=>{
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

    router.get('/add-mech-student', (req, res) => {
      res.render('admin/students/mech/add-mech-students', { admin: true })
    })
    router.post('/add-mech-student', (req, res) => {
      adminHelper.addMechStudents(req.body).then((response) => {
        res.render('admin/students/mech/add-mech-students', { admin: true })
      })
    })
    // -------->adding mech student end here<--------
    
    
    router.get('/mech-FirstYear', (req, res) => {
      adminHelper.viewMechFirstStudents().then((mechStudents) => {
        res.render('admin/students/mech/mech-first-year', { admin: true, mechStudents,startSNo: 1 })
      })
    })
    router.get('/mech-SecondYear', (req, res) => {
      adminHelper.viewMechSecondStudents().then((mechStudents) => {
        res.render('admin/students/mech/mech-second-year', { admin: true, mechStudents })
      })
    })
    router.get('/mech-ThirdYear', (req, res) => {
      adminHelper.viewMechThirdStudents().then((mechStudents) => {
        res.render('admin/students/mech/mech-third-year', { admin: true, mechStudents })
      })
    })
    
    router.get('/mech-FourthYear', (req, res) => {
      adminHelper.viewMechFourthStudents().then((mechStudents) => {
        res.render('admin/students/mech/mech-fourth-year', { admin: true, mechStudents })
      })
    })
    
    
    // -------->delete mech student<--------
    router.get('/delete-mech-student/:id/:year', (req, res) => {
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
    router.get('/edit-mech-student/:id',async(req,res)=>{
      let mechStudent = await adminHelper.viewOneMechStudent(req.params.id)
      res.render('admin/students/mech/edit-mech-student',{admin:true,mechStudent}) 
    })
    router.post('/edit-mech-student/:id',(req,res)=>{
      let year = req.body.Year
      console.log(year);
      adminHelper.editMechStudent(req.params.id,req.body).then(()=>{
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
    
    router.get('/add-civil-student', (req, res) => {
      res.render('admin/students/civil/add-civil-students', { admin: true })
    })
    router.post('/add-civil-student', (req, res) => {
      adminHelper.addCivilStudents(req.body).then((response) => {
        res.render('admin/students/civil/add-civil-students', { admin: true })
      })
    })
    // -------->adding civil student end here<--------
    
    
    router.get('/civil-FirstYear', (req, res) => {
      adminHelper.viewCivilFirstStudents().then((civilStudents) => {
        res.render('admin/students/civil/civil-first-year', { admin: true, civilStudents })
      })
    })
    router.get('/civil-SecondYear', (req, res) => {
      adminHelper.viewCivilSecondStudents().then((civilStudents) => {
        res.render('admin/students/civil/civil-second-year', { admin: true, civilStudents })
      })
    })
    router.get('/civil-ThirdYear', (req, res) => {
      adminHelper.viewCivilThirdStudents().then((civilStudents) => {
        res.render('admin/students/civil/civil-third-year', { admin: true, civilStudents })
      })
    })
    
    router.get('/civil-FourthYear', (req, res) => {
      adminHelper.viewCivilFourthStudents().then((civilStudents) => {
        res.render('admin/students/civil/civil-fourth-year', { admin: true, civilStudents })
      })
    })
    
    
    // -------->delete civil student<--------
    router.get('/delete-civil-student/:id/:year', (req, res) => {
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
    router.get('/edit-civil-student/:id',async(req,res)=>{
      let civilStudent = await adminHelper.viewOneCivilStudent(req.params.id)
      res.render('admin/students/civil/edit-civil-student',{admin:true,civilStudent}) 
    })
    router.post('/edit-civil-student/:id',(req,res)=>{
      let year = req.body.Year
      console.log(year);
      adminHelper.editCivilStudent(req.params.id,req.body).then(()=>{
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


module.exports = router;

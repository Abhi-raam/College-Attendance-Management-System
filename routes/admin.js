var express = require('express');
var router = express.Router();
var fs = require('fs');
const { ObjectId } = require('mongodb');
var db = require("../config/connection");
var adminHelper = require('../helpers/admin-helpers')


/* GET home page. */
router.get('/login', function (req, res, next) {
  res.render('admin/admin-login', {});
});

router.get('/', (req, res) => {
  res.render('admin/index', { admin: true })
})

router.get('/teacher', (req, res) => {
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
    else if(department == "ECE"){
      res.redirect('/admin/ece-staff')
    }else if(department == "CIVIL"){
      res.redirect('/admin/civil-staff')
    }else if(department == "MECH"){
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
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/staffs/cse-staff', { admin: true, staff })
  })
})
router.get('/ece-staff', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/staffs/ece-staff', { admin: true, staff })
  })
})
router.get('/mech-staff', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/staffs/mech-staff', { admin: true, staff })
  })
})
router.get('/civil-staff', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/staffs/civil-staff', { admin: true, staff })
  })
})
// -------->viewing teachers end here<--------

// -------->viewing teachers only for printing their datails to pdf<--------
router.get('/cse-staff-details', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/cse-staff-details', { admin: true, staff })
  })
})
router.get('/civil-staff-details', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/civil-staff-details', { admin: true, staff })
  })
})
router.get('/ece-staff-details', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/ece-staff-details', { admin: true, staff })
  })
})
router.get('/mech-staff-details', (req, res) => {
  adminHelper.viewStaff().then((staff) => {
    res.render('admin/mech-staff-details', { admin: true, staff })
  })
})
// -------->viewing for pdf end here<--------


router.get('/reg-17-student', (req, res) => {
  res.render('admin/student-17', { admin: true })
})
router.get('/reg-17/cse-01', (req, res) => {
  res.render('admin/cse/reg-17/cse-01', { admin: true })
})


router.get('/reg-21-student', (req, res) => {
  res.render('admin/student-21', { admin: true })
})




module.exports = router;

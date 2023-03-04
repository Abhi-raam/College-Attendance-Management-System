var db = require('../config/connection')
var collection = require('../config/collections')
const { reject, resolve } = require('promise')
const { response } = require('../app')
const objectID = require('mongodb').ObjectId

module.exports = {
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false
      let response = {}
      let staff = await db.get().collection(collection.Staff).findOne({ Email: userData.Username })
      if (staff) {
        if (userData.Password === staff.Password) {
          console.log("Login success");
          response.staff = staff
          response.status = true
          resolve(response)
        } else {
          console.log("Incorrect password");
          resolve({ status: false })
        }
      } else {
        console.log("No user found");
        resolve({ status: false })

      }
    })
  },
  students: (staff) => {
    // console.log(staff.Department);
    if (staff.Department === "CSE") {
      if (staff.Year === "First") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Cse_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Second") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Cse_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Third") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Cse_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Fourth") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Cse_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      }
    } else if (staff.Department === "ECE") {
      if (staff.Year === "First") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Ece_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Second") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Ece_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Third") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Ece_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Fourth") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Ece_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      }
    } else if (staff.Department === "CIVIL") {
      if (staff.Year === "First") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Civil_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Second") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Civil_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Third") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Civil_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Fourth") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Civil_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      }
    } else if (staff.Department === "MECH") {
      if (staff.Year === "First") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Mech_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Second") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Mech_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Third") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Mech_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      } else if (staff.Year === "Fourth") {
        return new Promise(async (resolve, reject) => {
          let students = await db.get().collection(collection.Mech_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
          resolve(students)
        })
      }
    }
  },

  addInitialAttendance: (staff, student) => {
    if (staff.Department === "CSE") {
      return new Promise((resolve, reject) => {
        // Check if student already exists in database
        student.forEach(async (student) => {
          let std = await db.get().collection(collection.Cse_attendance).findOne({ _id: objectID(student._id) })
          if (std) {
            // Student already exists in database, don't add
            // console.log(std);
            resolve();
          } else {
            // Student doesn't exist in database, add
            db.get().collection(collection.Cse_attendance).insertOne({ ...student, Attendance: [] })
              .then((response) => {
                resolve();
              });
          }
        })
      });
    }
  },


  addAttendance: (stdId, dateTaken, staff, allStd) => {
    if (staff.Department === "CSE") {
      return new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < allStd.length; i++) {
            const status = stdId.includes(allStd[i]) ? 1 : 0;
            const filter = { _id: objectID(allStd[i]) };
            const update = {
              $push: {
                Attendance: { DateTaken: dateTaken, Status: status }
              },
            };
            const options = { upsert: true };
            await db.get().collection(collection.Cse_attendance).updateOne(filter, update, options);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }
  },

  // viewAttendance:(staff)=>{
  //   if(staff.Department==="CSE"){
  //     if(staff.Year==="First"){
  //       return new Promise(async(resolve,reject)=>{
          
  //       })
  //     }
  //   }
  // }

}
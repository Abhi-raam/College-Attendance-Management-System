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
    }else if (staff.Department === "ECE") {
      return new Promise((resolve, reject) => {
        // Check if student already exists in database
        student.forEach(async (student) => {
          let std = await db.get().collection(collection.Ece_attendance).findOne({ _id: objectID(student._id) })
          if (std) {
            // Student already exists in database, don't add
            resolve();
          } else {
            // Student doesn't exist in database, add
            db.get().collection(collection.Ece_attendance).insertOne({ ...student, Attendance: [] })
              .then((response) => {
                resolve();
              });
          }
        })
      });
    }else if (staff.Department === "MECH") {
      return new Promise((resolve, reject) => {
        // Check if student already exists in database
        student.forEach(async (student) => {
          let std = await db.get().collection(collection.Mech_attendance).findOne({ _id: objectID(student._id) })
          if (std) {
            // Student already exists in database, don't add
            resolve();
          } else {
            // Student doesn't exist in database, add
            db.get().collection(collection.Mech_attendance).insertOne({ ...student, Attendance: [] })
              .then((response) => {
                resolve();
              });
          }
        })
      });
    }else if (staff.Department === "CIVIL") {
      return new Promise((resolve, reject) => {
        // Check if student already exists in database
        student.forEach(async (student) => {
          let std = await db.get().collection(collection.Civil_attendance).findOne({ _id: objectID(student._id) })
          if (std) {
            // Student already exists in database, don't add
            resolve();
          } else {
            // Student doesn't exist in database, add
            db.get().collection(collection.Civil_attendance).insertOne({ ...student, Attendance: [] })
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
            // const status = stdId.includes(allStd[i]) ? 1 : 0;
            const status = stdId && stdId.includes(allStd[i]) ? 1 : 0;
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
    }else if (staff.Department === "ECE") {
      return new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < allStd.length; i++) {
            // const status = stdId.includes(allStd[i]) ? 1 : 0;
            const status = stdId && stdId.includes(allStd[i]) ? 1 : 0;
            const filter = { _id: objectID(allStd[i]) };
            const update = {
              $push: {
                Attendance: { DateTaken: dateTaken, Status: status }
              },
            };
            const options = { upsert: true };
            await db.get().collection(collection.Ece_attendance).updateOne(filter, update, options);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }else if (staff.Department === "MECH") {
      return new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < allStd.length; i++) {
            // const status = stdId.includes(allStd[i]) ? 1 : 0;
            const status = stdId && stdId.includes(allStd[i]) ? 1 : 0;
            const filter = { _id: objectID(allStd[i]) };
            const update = {
              $push: {
                Attendance: { DateTaken: dateTaken, Status: status }
              },
            };
            const options = { upsert: true };
            await db.get().collection(collection.Mech_attendance).updateOne(filter, update, options);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }else if (staff.Department === "CIVIL") {
      return new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < allStd.length; i++) {
            // const status = stdId.includes(allStd[i]) ? 1 : 0;
            const status = stdId && stdId.includes(allStd[i]) ? 1 : 0;
            const filter = { _id: objectID(allStd[i]) };
            const update = {
              $push: {
                Attendance: { DateTaken: dateTaken, Status: status }
              },
            };
            const options = { upsert: true };
            await db.get().collection(collection.Civil_attendance).updateOne(filter, update, options);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }
  },

  viewAttendance: (staff, date) => {
    if (staff.Department === "CSE" && staff.Year === "First") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "First", Attendance: { $elemMatch: { DateTaken: date } } } },
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CSE" && staff.Year === "Second") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Second", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CSE" && staff.Year === "Third") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Third", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CSE" && staff.Year === "Fourth") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Fourth", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "ECE" && staff.Year === "First") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "First", Attendance: { $elemMatch: { DateTaken: date } } } },
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "ECE" && staff.Year === "Second") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Second", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "ECE" && staff.Year === "Third") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Third", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "ECE" && staff.Year === "Fourth") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Fourth", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "MECH" && staff.Year === "First") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "First", Attendance: { $elemMatch: { DateTaken: date } } } },
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "MECH" && staff.Year === "Second") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Second", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "MECH" && staff.Year === "Third") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Third", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "MECH" && staff.Year === "Fourth") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Fourth", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CIVIL" && staff.Year === "First") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "First", Attendance: { $elemMatch: { DateTaken: date } } } },
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CIVIL" && staff.Year === "Second") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Second", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CIVIL" && staff.Year === "Third") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Third", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }else if (staff.Department === "CIVIL" && staff.Year === "Fourth") {
      return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          // Match documents with Attendance array that contains the specified date
          { $match: { Year: "Fourth", Attendance: { $elemMatch: { DateTaken: date } } } }, 
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified date
          { $match: { "Attendance.DateTaken": date } }
        ]).toArray();
        resolve(studentList);
      })
    }
  },

  viewAttendanceMonth: (data, month,Department,Year) => {
    if (Department === "CSE" && Year==="First") {
        return new Promise(async (resolve, reject) => {
            let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
                // Match documents with Attendance array that contains the specified month
                { $match: {Year:"First", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
                // Unwind the Attendance array
                { $unwind: "$Attendance" },
                // Match the Attendance array element with the specified month
                { $match: { "Attendance.DateTaken": { $regex: month } } },
                // Group by student name and accumulate the Attendance array
                {
                    $group: {
                        _id: "$Name",
                        Attendance: { $push: "$Attendance" }
                    }
                },
                // Add the student name to each element of the Attendance array
                {
                    $project: {
                        _id: 0,
                        Name: "$_id",
                        Attendance: 1
                    }
                },
                {
                    $sort:{
                        Name:1
                    }
                }
            ]).toArray();
            resolve(studentList);
        })
    }else if (Department === "CSE" && Year==="Second") {
        return new Promise(async (resolve, reject) => {
            let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
                { $match: {Year:"Second", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
                { $unwind: "$Attendance" },
                { $match: { "Attendance.DateTaken": { $regex: month } } },
                {
                    $group: {
                        _id: "$Name",
                        Attendance: { $push: "$Attendance" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        Name: "$_id",
                        Attendance: 1
                    }
                },
                {
                    $sort:{
                        Name:1
                    }
                }
            ]).toArray();
            resolve(studentList);
        })
    }else if (Department === "CSE" && Year==="Third") {
        return new Promise(async (resolve, reject) => {
            let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
                { $match: {Year:"Third", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
                { $unwind: "$Attendance" },
                { $match: { "Attendance.DateTaken": { $regex: month } } },
                {
                    $group: {
                        _id: "$Name",
                        Attendance: { $push: "$Attendance" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        Name: "$_id",
                        Attendance: 1
                    }
                },
                {
                    $sort:{
                        Name:1
                    }
                }
            ]).toArray();
            resolve(studentList);
        })
    }else if (Department === "CSE" && Year==="Fourth") {
        return new Promise(async (resolve, reject) => {
            let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
                { $match: {Year:"Fourth", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
                { $unwind: "$Attendance" },
                { $match: { "Attendance.DateTaken": { $regex: month } } },
                {
                    $group: {
                        _id: "$Name",
                        Attendance: { $push: "$Attendance" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        Name: "$_id",
                        Attendance: 1
                    }
                },
                {
                    $sort:{
                        Name:1
                    }
                }
            ]).toArray();
            resolve(studentList);
        })
    }else  if (Department === "ECE" && Year==="First") {
      return new Promise(async (resolve, reject) => {
          let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
              // Match documents with Attendance array that contains the specified month
              { $match: {Year:"First", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
              // Unwind the Attendance array
              { $unwind: "$Attendance" },
              // Match the Attendance array element with the specified month
              { $match: { "Attendance.DateTaken": { $regex: month } } },
              // Group by student name and accumulate the Attendance array
              {
                  $group: {
                      _id: "$Name",
                      Attendance: { $push: "$Attendance" }
                  }
              },
              // Add the student name to each element of the Attendance array
              {
                  $project: {
                      _id: 0,
                      Name: "$_id",
                      Attendance: 1
                  }
              },
              {
                  $sort:{
                      Name:1
                  }
              }
          ]).toArray();
          resolve(studentList);
      })
  }else if (Department === "ECE" && Year==="Second") {
      return new Promise(async (resolve, reject) => {
          let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
              { $match: {Year:"Second", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
              { $unwind: "$Attendance" },
              { $match: { "Attendance.DateTaken": { $regex: month } } },
              {
                  $group: {
                      _id: "$Name",
                      Attendance: { $push: "$Attendance" }
                  }
              },
              {
                  $project: {
                      _id: 0,
                      Name: "$_id",
                      Attendance: 1
                  }
              },
              {
                  $sort:{
                      Name:1
                  }
              }
          ]).toArray();
          resolve(studentList);
      })
  }else if (Department === "ECE" && Year==="Third") {
      return new Promise(async (resolve, reject) => {
          let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
              { $match: {Year:"Third", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
              { $unwind: "$Attendance" },
              { $match: { "Attendance.DateTaken": { $regex: month } } },
              {
                  $group: {
                      _id: "$Name",
                      Attendance: { $push: "$Attendance" }
                  }
              },
              {
                  $project: {
                      _id: 0,
                      Name: "$_id",
                      Attendance: 1
                  }
              },
              {
                  $sort:{
                      Name:1
                  }
              }
          ]).toArray();
          resolve(studentList);
      })
  }else if (Department === "ECE" && Year==="Fourth") {
      return new Promise(async (resolve, reject) => {
          let studentList = await db.get().collection(collection.Ece_attendance).aggregate([
              { $match: {Year:"Fourth", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
              { $unwind: "$Attendance" },
              { $match: { "Attendance.DateTaken": { $regex: month } } },
              {
                  $group: {
                      _id: "$Name",
                      Attendance: { $push: "$Attendance" }
                  }
              },
              {
                  $project: {
                      _id: 0,
                      Name: "$_id",
                      Attendance: 1
                  }
              },
              {
                  $sort:{
                      Name:1
                  }
              }
          ]).toArray();
          resolve(studentList);
      })
  }else if (Department === "MECH" && Year==="First") {
    return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
            // Match documents with Attendance array that contains the specified month
            { $match: {Year:"First", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
            // Unwind the Attendance array
            { $unwind: "$Attendance" },
            // Match the Attendance array element with the specified month
            { $match: { "Attendance.DateTaken": { $regex: month } } },
            // Group by student name and accumulate the Attendance array
            {
                $group: {
                    _id: "$Name",
                    Attendance: { $push: "$Attendance" }
                }
            },
            // Add the student name to each element of the Attendance array
            {
                $project: {
                    _id: 0,
                    Name: "$_id",
                    Attendance: 1
                }
            },
            {
                $sort:{
                    Name:1
                }
            }
        ]).toArray();
        resolve(studentList);
    })
}else if (Department === "MECH" && Year==="Second") {
    return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
            { $match: {Year:"Second", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
            { $unwind: "$Attendance" },
            { $match: { "Attendance.DateTaken": { $regex: month } } },
            {
                $group: {
                    _id: "$Name",
                    Attendance: { $push: "$Attendance" }
                }
            },
            {
                $project: {
                    _id: 0,
                    Name: "$_id",
                    Attendance: 1
                }
            },
            {
                $sort:{
                    Name:1
                }
            }
        ]).toArray();
        resolve(studentList);
    })
}else if (Department === "MECH" && Year==="Third") {
    return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
            { $match: {Year:"Third", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
            { $unwind: "$Attendance" },
            { $match: { "Attendance.DateTaken": { $regex: month } } },
            {
                $group: {
                    _id: "$Name",
                    Attendance: { $push: "$Attendance" }
                }
            },
            {
                $project: {
                    _id: 0,
                    Name: "$_id",
                    Attendance: 1
                }
            },
            {
                $sort:{
                    Name:1
                }
            }
        ]).toArray();
        resolve(studentList);
    })
}else if (Department === "MECH" && Year==="Fourth") {
    return new Promise(async (resolve, reject) => {
        let studentList = await db.get().collection(collection.Mech_attendance).aggregate([
            { $match: {Year:"Fourth", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
            { $unwind: "$Attendance" },
            { $match: { "Attendance.DateTaken": { $regex: month } } },
            {
                $group: {
                    _id: "$Name",
                    Attendance: { $push: "$Attendance" }
                }
            },
            {
                $project: {
                    _id: 0,
                    Name: "$_id",
                    Attendance: 1
                }
            },
            {
                $sort:{
                    Name:1
                }
            }
        ]).toArray();
        resolve(studentList);
    })
}else  if (Department === "CIVIL" && Year==="First") {
  return new Promise(async (resolve, reject) => {
      let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          // Match documents with Attendance array that contains the specified month
          { $match: {Year:"First", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
          // Unwind the Attendance array
          { $unwind: "$Attendance" },
          // Match the Attendance array element with the specified month
          { $match: { "Attendance.DateTaken": { $regex: month } } },
          // Group by student name and accumulate the Attendance array
          {
              $group: {
                  _id: "$Name",
                  Attendance: { $push: "$Attendance" }
              }
          },
          // Add the student name to each element of the Attendance array
          {
              $project: {
                  _id: 0,
                  Name: "$_id",
                  Attendance: 1
              }
          },
          {
              $sort:{
                  Name:1
              }
          }
      ]).toArray();
      resolve(studentList);
  })
}else if (Department === "CIVIL" && Year==="Second") {
  return new Promise(async (resolve, reject) => {
      let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          { $match: {Year:"Second", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
          { $unwind: "$Attendance" },
          { $match: { "Attendance.DateTaken": { $regex: month } } },
          {
              $group: {
                  _id: "$Name",
                  Attendance: { $push: "$Attendance" }
              }
          },
          {
              $project: {
                  _id: 0,
                  Name: "$_id",
                  Attendance: 1
              }
          },
          {
              $sort:{
                  Name:1
              }
          }
      ]).toArray();
      resolve(studentList);
  })
}else if (Department === "CIVIL" && Year==="Third") {
  return new Promise(async (resolve, reject) => {
      let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          { $match: {Year:"Third", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
          { $unwind: "$Attendance" },
          { $match: { "Attendance.DateTaken": { $regex: month } } },
          {
              $group: {
                  _id: "$Name",
                  Attendance: { $push: "$Attendance" }
              }
          },
          {
              $project: {
                  _id: 0,
                  Name: "$_id",
                  Attendance: 1
              }
          },
          {
              $sort:{
                  Name:1
              }
          }
      ]).toArray();
      resolve(studentList);
  })
}else if (Department === "CIVIL" && Year==="Fourth") {
  return new Promise(async (resolve, reject) => {
      let studentList = await db.get().collection(collection.Civil_attendance).aggregate([
          { $match: {Year:"Fourth", Attendance: { $elemMatch: { DateTaken: { $regex: month } } } } },
          { $unwind: "$Attendance" },
          { $match: { "Attendance.DateTaken": { $regex: month } } },
          {
              $group: {
                  _id: "$Name",
                  Attendance: { $push: "$Attendance" }
              }
          },
          {
              $project: {
                  _id: 0,
                  Name: "$_id",
                  Attendance: 1
              }
          },
          {
              $sort:{
                  Name:1
              }
          }
      ]).toArray();
      resolve(studentList);
  })
}
},

  // view attendance based on student name will be used in fature
  // studentAttendance: (staff, stdId) => {
  //   if (staff.Department === "CSE") {
  //     return new Promise(async (resolve, reject) => {
  //       let student = await db
  //         .get()
  //         .collection(collection.Cse_attendance)
  //         .findOne({ _id: objectID(stdId) });
  //       if (student) {
  //         resolve(student);
  //       } else {
  //         reject(new Error("Student not found"));
  //       }
  //     });
  //   }
  // },

}
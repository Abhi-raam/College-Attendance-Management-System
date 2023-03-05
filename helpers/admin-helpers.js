var db = require('../config/connection')
var collection = require('../config/collections')
// const { response } = require('../../../stucor/app')
const { reject, resolve } = require('promise')
const objectID = require('mongodb').ObjectId

module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection('admin').findOne({ Username: userData.Username })
            if (admin) {
                if (userData.Password === admin.Password) {
                    console.log("Login success");
                    response.admin = admin
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
    addStaff: (staff, callback) => {
        db.get().collection('staff').insertOne(staff).then((data) => {
            // console.log("Somtheing ::"+data.insertedId);
            callback(data.insertedId)
        })
    },
    // viewStaff:()=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let staff = await db.get().collection('staff').find().sort({ Name: 1 }).toArray()
    //         resolve(staff)
    //     })
    // },
    viewCseStaff: () => {
        return new Promise(async (resolve, reject) => {
            let staff = await db.get().collection('staff').find({ Department: "CSE" }).sort({ Name: 1 }).toArray()
            resolve(staff)
        })
    },
    viewEceStaff: () => {
        return new Promise(async (resolve, reject) => {
            let staff = await db.get().collection('staff').find({ Department: "ECE" }).sort({ Name: 1 }).toArray()
            resolve(staff)
        })
    },
    viewCivilStaff: () => {
        return new Promise(async (resolve, reject) => {
            let staff = await db.get().collection('staff').find({ Department: "CIVIL" }).sort({ Name: 1 }).toArray()
            resolve(staff)
        })
    }, viewMechStaff: () => {
        return new Promise(async (resolve, reject) => {
            let staff = await db.get().collection('staff').find({ Department: "MECH" }).sort({ Name: 1 }).toArray()
            resolve(staff)
        })
    },
    // deleteCseStaff function can delete all staff 
    deleteCseStaff: (staffId) => {
        return new Promise((resolve, reject) => {
            db.get().collection("staff").deleteOne({ _id: objectID(staffId) }).then((response) => {
                // console.log("Something => "+staffId);
                resolve(staffId)
            })
        })
    },
    // this below function is only for editing the staff details
    viewOneStaff: (staffId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('staff').findOne({ _id: objectID(staffId) }).then((staff) => {
                resolve(staff)
            })
        })
    },
    editStaff: (staffId, staffDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection("staff").update({ _id: objectID(staffId) }, {
                $set: {
                    Name: staffDetails.Name,
                    Email: staffDetails.Email,
                    Mobile: staffDetails.Mobile,
                    Password: staffDetails.Password,
                    Year: staffDetails.Year,
                    Designation: staffDetails.Designation,
                    Department: staffDetails.Department
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    // =============================================================CSE functions============================================

    addCseStudents: (cseStudents) => {
        return new Promise((resolve, reject) => {
            db.get().collection("cseStudents").insertOne(cseStudents).then((data) => {
                resolve(true)
            })
        })
    },
    // addCseStudents:(cseStudents)=>{
    //     return new Promise((resolve,reject)=>{
    //         let cseStd = {
    //             Name:cseStudents.Name,
    //             RegisterNo:cseStudents.RegisterNo,
    //             Attendance:[],
    //             Year:cseStudents.Year,
    //             Email:cseStudents.Email,
    //             Mobile:cseStudents.Mobile
    //         }
    //         db.get().collection(collection.Cse_students).insertOne(cseStd).then((data)=>{
    //             resolve(true)
    //         })
    //     })
    // },
    // view only   students based on their studying year from cse students database
    viewCseFirstStudents: () => {
        return new Promise(async (resolve, reject) => {
            let csestudent = await db.get().collection("cseStudents").find({ Year: "First" }).sort({ Name: 1 }).toArray()
            resolve(csestudent)
        })
    },
    viewCseSecondStudents: () => {
        return new Promise(async (resolve, reject) => {
            let csestudent = await db.get().collection("cseStudents").find({ Year: "Second" }).sort({ Name: 1 }).toArray()
            resolve(csestudent)
        })
    },
    viewCseThirdStudents: () => {
        return new Promise(async (resolve, reject) => {
            let csestudent = await db.get().collection("cseStudents").find({ Year: "Third" }).sort({ Name: 1 }).toArray()
            resolve(csestudent)
        })
    },
    viewCseFourthStudents: () => {
        return new Promise(async (resolve, reject) => {
            let csestudent = await db.get().collection("cseStudents").find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
            resolve(csestudent)
        })
    },
    deleteCseStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection("cseStudents").deleteOne({ _id: objectID(studentId) }).then((response) => {
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneCseStudent: (stdId) => {
        return new Promise((resolve, reject) => {
            db.get().collection("cseStudents").findOne({ _id: objectID(stdId) }).then((cseStudent) => {
                resolve(cseStudent)
            })
        })
    },
    editCseStudent: (stdId, stdDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection("cseStudents").update({ _id: objectID(stdId) }, {
                $set: {
                    Name: stdDetails.Name,
                    RegisterNo: stdDetails.RegisterNo,
                    Year: stdDetails.Year,
                    Email: stdDetails.Email,
                    Mobile: stdDetails.Mobile
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    // =============================================================ECE functions============================================

    addEceStudents: (eceStudents) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Ece_students).insertOne(eceStudents).then((data) => {
                resolve(true)
            })
        })
    },
    viewEceFirstStudents: () => {
        return new Promise(async (resolve, reject) => {
            let ecestudent = await db.get().collection(collection.Ece_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
            resolve(ecestudent)
        })
    },
    viewEceSecondStudents: () => {
        return new Promise(async (resolve, reject) => {
            let ecestudent = await db.get().collection(collection.Ece_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
            resolve(ecestudent)
        })
    },
    viewEceThirdStudents: () => {
        return new Promise(async (resolve, reject) => {
            let ecestudent = await db.get().collection(collection.Ece_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
            resolve(ecestudent)
        })
    },
    viewEceFourthStudents: () => {
        return new Promise(async (resolve, reject) => {
            let ecestudent = await db.get().collection(collection.Ece_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
            resolve(ecestudent)
        })
    },
    deleteEceStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Ece_students).deleteOne({ _id: objectID(studentId) }).then((response) => {
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneEceStudent: (stdId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Ece_students).findOne({ _id: objectID(stdId) }).then((eceStudent) => {
                resolve(eceStudent)
            })
        })
    },
    editEceStudent: (stdId, stdDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Ece_students).update({ _id: objectID(stdId) }, {
                $set: {
                    Name: stdDetails.Name,
                    RegisterNo: stdDetails.RegisterNo,
                    Year: stdDetails.Year,
                    Email: stdDetails.Email,
                    Mobile: stdDetails.Mobile
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    // =============================================================MECH functions============================================

    addMechStudents: (mechStudents) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Mech_students).insertOne(mechStudents).then((data) => {
                resolve(true)
            })
        })
    },
    viewMechFirstStudents: () => {
        return new Promise(async (resolve, reject) => {
            let mechstudent = await db.get().collection(collection.Mech_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
            resolve(mechstudent)
        })
    },
    viewMechSecondStudents: () => {
        return new Promise(async (resolve, reject) => {
            let mechstudent = await db.get().collection(collection.Mech_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
            resolve(mechstudent)
        })
    },
    viewMechThirdStudents: () => {
        return new Promise(async (resolve, reject) => {
            let mechstudent = await db.get().collection(collection.Mech_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
            resolve(mechstudent)
        })
    },
    viewMechFourthStudents: () => {
        return new Promise(async (resolve, reject) => {
            let mechstudent = await db.get().collection(collection.Mech_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
            resolve(mechstudent)
        })
    },
    deleteMechStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Mech_students).deleteOne({ _id: objectID(studentId) }).then((response) => {
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneMechStudent: (stdId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Mech_students).findOne({ _id: objectID(stdId) }).then((mechStudent) => {
                resolve(mechStudent)
            })
        })
    },
    editMechStudent: (stdId, stdDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Mech_students).update({ _id: objectID(stdId) }, {
                $set: {
                    Name: stdDetails.Name,
                    RegisterNo: stdDetails.RegisterNo,
                    Year: stdDetails.Year,
                    Email: stdDetails.Email,
                    Mobile: stdDetails.Mobile
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    // =============================================================CIVIL functions============================================

    addCivilStudents: (civilStudents) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Civil_students).insertOne(civilStudents).then((data) => {
                resolve(true)
            })
        })
    },
    viewCivilFirstStudents: () => {
        return new Promise(async (resolve, reject) => {
            let civilstudent = await db.get().collection(collection.Civil_students).find({ Year: "First" }).sort({ Name: 1 }).toArray()
            resolve(civilstudent)
        })
    },
    viewCivilSecondStudents: () => {
        return new Promise(async (resolve, reject) => {
            let civilstudent = await db.get().collection(collection.Civil_students).find({ Year: "Second" }).sort({ Name: 1 }).toArray()
            resolve(civilstudent)
        })
    },
    viewCivilThirdStudents: () => {
        return new Promise(async (resolve, reject) => {
            let civilstudent = await db.get().collection(collection.Civil_students).find({ Year: "Third" }).sort({ Name: 1 }).toArray()
            resolve(civilstudent)
        })
    },
    viewCivilFourthStudents: () => {
        return new Promise(async (resolve, reject) => {
            let civilstudent = await db.get().collection(collection.Civil_students).find({ Year: "Fourth" }).sort({ Name: 1 }).toArray()
            resolve(civilstudent)
        })
    },
    deleteCivilStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Civil_students).deleteOne({ _id: objectID(studentId) }).then((response) => {
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneCivilStudent: (stdId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Civil_students).findOne({ _id: objectID(stdId) }).then((civilStudent) => {
                resolve(civilStudent)
            })
        })
    },
    editCivilStudent: (stdId, stdDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Civil_students).update({ _id: objectID(stdId) }, {
                $set: {
                    Name: stdDetails.Name,
                    RegisterNo: stdDetails.RegisterNo,
                    Year: stdDetails.Year,
                    Email: stdDetails.Email,
                    Mobile: stdDetails.Mobile
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    // ==============Attendance function =============
    viewAttendance: (data) => {
        if (data.Department === "CSE") {
            return new Promise(async (resolve, reject) => {
                let studentList = await db.get().collection(collection.Cse_attendance).aggregate([
                    // Match documents with Attendance array that contains the specified date
                    { $match: { Attendance: { $elemMatch: { DateTaken: data.dateTaken } } } },
                    // Unwind the Attendance array
                    { $unwind: "$Attendance" },
                    // Match the Attendance array element with the specified date
                    { $match: { "Attendance.DateTaken": data.dateTaken } }
                ]).toArray();
                resolve(studentList);
            })
        }
    }
}
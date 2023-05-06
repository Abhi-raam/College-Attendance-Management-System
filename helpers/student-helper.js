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
            if (userData.Department === "CSE") {
                let student = await db.get().collection(collection.Cse_students).findOne({ RegisterNo: userData.Regno })
                if (student) {
                    if (userData.Password === student.DOB) {
                        console.log("Login success");
                        response.student = student
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
            } else if (userData.Department === "ECE") {
                let student = await db.get().collection(collection.Ece_students).findOne({ RegisterNo: userData.Regno })
                if (student) {
                    if (userData.Password === student.DOB) {
                        console.log("Login success");
                        response.student = student
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
            } else if (userData.Department === "CIVIL") {
                let student = await db.get().collection(collection.Civil_students).findOne({ RegisterNo: userData.Regno })
                if (student) {
                    if (userData.Password === student.DOB) {
                        console.log("Login success");
                        response.student = student
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
            } else if (userData.Department === "MECH") {
                let student = await db.get().collection(collection.Mech_students).findOne({ RegisterNo: userData.Regno })
                if (student) {
                    if (userData.Password === student.DOB) {
                        console.log("Login success");
                        response.student = student
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
            }
        })
    },

    getAttendanceStd: (student) => {
        return new Promise(async(resolve, reject) => {
            try {
                if(student.Department === "CSE"){
                    let attendanceList = await db.get().collection(collection.Cse_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                      });
                    resolve(attendanceArray);
                }
                else if(student.Department === "ECE"){
                    let attendanceList = await db.get().collection(collection.Ece_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                      });
                    resolve(attendanceArray);
                }
                else if(student.Department === "MECH"){
                    let attendanceList = await db.get().collection(collection.Mech_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                      });
                    resolve(attendanceArray);
                }
                else if(student.Department === "CIVIL"){
                    let attendanceList = await db.get().collection(collection.Civil_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                      });
                    resolve(attendanceArray);
                }
            } catch (error) {  
            }
        })
    }







}
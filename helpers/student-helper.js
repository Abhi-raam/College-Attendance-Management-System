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
                let student = await db.get().collection(collection.Cse_students).findOne({RegisterNo:userData.Regno})
                if(student){
                    if(userData.Password === student.DOB){
                        console.log("Login success");
                        response.student = student
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect password");
                        resolve({status:false})
                    }
                }else{
                    console.log("No user found");
                    resolve({status:false})
                }
            }else if(userData.department === "ECE"){
                let student = await db.get().collection(collection.Ece_students).findOne({RegisterNo:userData.Regno})
                if(student){
                    if(userData.Password === student.DOB){
                        console.log("Login success");
                        response.student = student
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect password");
                        resolve({status:false})
                    }
                }else{
                    console.log("No user found");
                    resolve({status:false})
                }
            }else if(userData.department === "CIVIL"){
                let student = await db.get().collection(collection.Civil_students).findOne({RegisterNo:userData.Regno})
                if(student){
                    if(userData.Password === student.DOB){
                        console.log("Login success");
                        response.student = student
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect password");
                        resolve({status:false})
                    }
                }else{
                    console.log("No user found");
                    resolve({status:false})
                }
            }else if(userData.department === "MECH"){
                let student = await db.get().collection(collection.Mech_students).findOne({RegisterNo:userData.Regno})
                if(student){
                    if(userData.Password === student.DOB){
                        console.log("Login success");
                        response.student = student
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect password");
                        resolve({status:false})
                    }
                }else{
                    console.log("No user found");
                    resolve({status:false})
                }
            }
        })
    },

    // viewAttendanceMonth:(student,month)=>{
    //     return new Promise((resolve,reject)=>{
    //         if(student.Department === "CSE"){
    //         let
    //         }
    //     })
    // }
    getAttendanceDatesForStudent: (month, student) => {
        console.log(student);
        return new Promise(async (resolve, reject) => {
            try{
                let attendanceList = await db.get().collection(collection.Cse_attendance).aggregate([
                    // Match documents with the specified student name
                    { $match: { Name: student.Name } },
                    // Unwind the Attendance array
                    { $unwind: "$Attendance" },
                    // Filter by the specified student name and where the status is present
                    { $match: { Name: student.Name,"Attendance.DateTaken": { $regex: month } } },
                    // Project only the DateTaken field
                    // { $project: { _id: 0, DateTaken: "$Attendance.DateTaken" } }
                    { $project: { _id: 0, Attendance: "$Attendance" } }
                ]).toArray();
                resolve(attendanceList);
            }catch(error){
                reject(error)
            }
        })
      }
   






}
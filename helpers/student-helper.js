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

    getAttendanceStd: (student,year) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (student.Department === "CSE") {
                    let attendanceList = await db.get().collection(collection.Cse_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $match: { "Attendance.DateTaken": { $regex: year } } },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                    });
                    resolve(attendanceArray);
                }
                else if (student.Department === "ECE") {
                    let attendanceList = await db.get().collection(collection.Ece_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $match: { "Attendance.DateTaken": { $regex: year } } },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                    });
                    let totalArray = attendanceArray.length
                    let totalHoliday = 0;
                    let workingDay = 0;
                    for (let i = 0; i < totalArray; i++) {
                        const attendance = attendanceArray[i];
                        if (attendance.Status !== 'Holiday') {
                            if (attendance.Status === 1) {
                                totalHoliday++;
                            }
                            if (attendance.Status === 1 || attendance.Status === 0) {
                                workingDay++;
                            }
                        }
                    }
                    resolve({attendanceArray,totalHoliday,workingDay});
                }
                else if (student.Department === "MECH") {
                    let attendanceList = await db.get().collection(collection.Mech_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $match: { "Attendance.DateTaken": { $regex: year } } },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                    });
                    resolve(attendanceArray);
                }
                else if (student.Department === "CIVIL") {
                    let attendanceList = await db.get().collection(collection.Civil_attendance).aggregate([
                        { $match: { Name: student.Name } },
                        { $unwind: "$Attendance" },
                        { $match: { "Attendance.DateTaken": { $regex: year } } },
                        { $project: { _id: 0, Attendance: "$Attendance" } }
                    ]).toArray();
                    const attendanceArray = attendanceList.map((item) => {
                        return { DateTaken: item.Attendance.DateTaken, Status: item.Attendance.Status }
                    });
                    resolve(attendanceArray);
                }
            } catch (error) {
                reject(error)
            }
        })
    },
    viewAttendancePersent: (student) => {
        return new Promise((resolve, reject) => {
            try {
                if (student.Department === "CSE") {
                    db.get().collection(collection.Cse_attendance).findOne({ _id: objectID(student._id) }).then((Student => {
                        if (!Student || !Student.Attendance) { // adding null check
                            reject();
                            return;
                        }
                        const TotalAttendance = Student.Attendance.length;
                        let presentCount = 0;
                        let workingDay = 0;
                        for (let i = 0; i < TotalAttendance; i++) {
                            const attendance = Student.Attendance[i];
                            if (attendance.Status !== 'Holiday') {
                                if (attendance.Status === 1) {
                                    presentCount++;
                                }
                                if (attendance.Status === 1 || attendance.Status === 0) {
                                    workingDay++;
                                }
                            }
                        }
                        resolve({ presentCount, workingDay, stdName: Student.Name })
                    }))
                }
                else if (student.Department === "ECE") {
                    db.get().collection(collection.Ece_attendance).findOne({ _id: objectID(student._id) }).then((Student => {
                        if (!Student || !Student.Attendance) { // adding null check
                            reject();
                            return;
                        }
                        const TotalAttendance = Student.Attendance.length;
                        let presentCount = 0;
                        let workingDay = 0;
                        for (let i = 0; i < TotalAttendance; i++) {
                            const attendance = Student.Attendance[i];
                            if (attendance.Status !== 'Holiday') {
                                if (attendance.Status === 1) {
                                    presentCount++;
                                }
                                if (attendance.Status === 1 || attendance.Status === 0) {
                                    workingDay++;
                                }
                            }
                        }
                        resolve({ presentCount, workingDay, stdName: Student.Name })
                    }))
                }
                else if (student.Department === "MECH") {
                    db.get().collection(collection.Mech_attendance).findOne({ _id: objectID(student._id) }).then((Student => {
                        if (!Student || !Student.Attendance) { // adding null check
                            reject();
                            return;
                        }
                        const TotalAttendance = Student.Attendance.length;
                        let presentCount = 0;
                        let workingDay = 0;
                        for (let i = 0; i < TotalAttendance; i++) {
                            const attendance = Student.Attendance[i];
                            if (attendance.Status !== 'Holiday') {
                                if (attendance.Status === 1) {
                                    presentCount++;
                                }
                                if (attendance.Status === 1 || attendance.Status === 0) {
                                    workingDay++;
                                }
                            }
                        }
                        resolve({ presentCount, workingDay, stdName: Student.Name })
                    }))
                }
                else if (student.Department === "CIVIL") {
                    db.get().collection(collection.Civil_attendance).findOne({ _id: objectID(student._id) }).then((Student => {
                        if (!Student || !Student.Attendance) { // adding null check
                            reject();
                            return;
                        }
                        const TotalAttendance = Student.Attendance.length;
                        let presentCount = 0;
                        let workingDay = 0;
                        for (let i = 0; i < TotalAttendance; i++) {
                            const attendance = Student.Attendance[i];
                            if (attendance.Status !== 'Holiday') {
                                if (attendance.Status === 1) {
                                    presentCount++;
                                }
                                if (attendance.Status === 1 || attendance.Status === 0) {
                                    workingDay++;
                                }
                            }
                        }
                        resolve({ presentCount, workingDay, stdName: Student.Name })
                    }))
                }
            } catch (error) {
                reject(error)
            }
        })
    }





}
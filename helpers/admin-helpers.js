var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('../../../stucor/app')
const { reject, resolve } = require('promise')
const  objectID  = require('mongodb').ObjectId

module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection('admin').findOne({Username:userData.Username})
            if (admin) {
                if (userData.Password === admin.Password){
                  console.log("Login success");
                  response.admin = admin
                  response.status = true
                  resolve(response)
                } else {
                  console.log("Incorrect password");
                  resolve({status:false})
                }
              } else{
                console.log("No user found");
                resolve({status:false})

              }
        })
    },
    addStaff:(staff,callback)=>{
        db.get().collection('staff').insertOne(staff).then((data)=>{
            // console.log("Somtheing ::"+data.insertedId);
            callback(data.insertedId)
        })
    },
    viewStaff:()=>{
        return new Promise(async(resolve,reject)=>{
            let staff = await db.get().collection('staff').find().sort({ Name: 1 }).toArray()
            resolve(staff)
        })
    },
    // deleteCseStaff function can delete all staff 
    deleteCseStaff:(staffId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("staff").deleteOne({_id:objectID(staffId)}).then((response)=>{
                // console.log("Something => "+staffId);
                resolve(staffId)
            })
        })
    },
    // this below function is only for editing the staff details
    viewOneStaff:(staffId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('staff').findOne({_id:objectID(staffId)}).then((staff)=>{
                resolve(staff)
            })
        })
    },
    editStaff:(staffId,staffDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("staff").update({_id:objectID(staffId)},{
                $set:{
                    Name:staffDetails.Name,
                    Email:staffDetails.Email,
                    Mobile:staffDetails.Mobile,
                    Password:staffDetails.Password,
                    Designation:staffDetails.Designation,
                    Department:staffDetails.Department
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    addCseStudents:(cseStudents)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("cseStudents").insertOne(cseStudents).then((data)=>{
                resolve(true)
            })
        })
    },
    viewCseStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let csestudent = await db.get().collection("cseStudents").find().sort({ Name: 1 }).toArray()
            resolve(csestudent)
        })
    },deleteCseStudent:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("cseStudents").deleteOne({_id:objectID(studentId)}).then((response)=>{
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneCseStudent:(stdId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("cseStudents").findOne({_id:objectID(stdId)}).then((cseStudent)=>{
                resolve(cseStudent)
            })
        })
    },
    editCseStudent:(stdId,stdDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection("cseStudents").update({_id:objectID(stdId)},{
                $set:{
                    Name:stdDetails.Name,
                    RegisterNo:stdDetails.RegisterNo,
                    Year:stdDetails.Year,
                    Email:stdDetails.Email,
                    Mobile:stdDetails.Mobile
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    addEceStudents:(eceStudents)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Ece_students).insertOne(eceStudents).then((data)=>{
                resolve(true)
            })
        })
    },
    viewEceStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let ecestudent = await db.get().collection(collection.Ece_students).find().sort({ Name: 1 }).toArray()
            resolve(ecestudent)
        })
    },deleteEceStudent:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Ece_students).deleteOne({_id:objectID(studentId)}).then((response)=>{
                // console.log("Something => "+staffId);
                resolve(studentId)
            })
        })
    },
    viewOneEceStudent:(stdId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Ece_students).findOne({_id:objectID(stdId)}).then((eceStudent)=>{
                resolve(eceStudent)
            })
        })
    },
    editEceStudent:(stdId,stdDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Ece_students).update({_id:objectID(stdId)},{
                $set:{
                    Name:stdDetails.Name,
                    RegisterNo:stdDetails.RegisterNo,
                    Year:stdDetails.Year,
                    Email:stdDetails.Email,
                    Mobile:stdDetails.Mobile
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
}
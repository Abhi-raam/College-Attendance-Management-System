var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('../../../stucor/app')
const { reject } = require('promise')
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
            let staff = await db.get().collection('staff').find().toArray()
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
    }
}
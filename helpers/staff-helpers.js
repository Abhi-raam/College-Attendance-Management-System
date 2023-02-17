var db = require('../config/connection')
var collection = require('../config/collections')
const { reject, resolve } = require('promise')
const  objectID  = require('mongodb').ObjectId

module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let staff = await db.get().collection(collection.Staff).findOne({Email:userData.Username})
            if (staff) {
                if (userData.Password === staff.Password){
                  console.log("Login success");
                  response.staff = staff
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

}
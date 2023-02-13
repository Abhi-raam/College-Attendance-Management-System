var db = require('../config/connection')
var collection = require('../config/collections')

module.exports={

    addStaff:(staff,callback)=>{
        db.get().collection('staff').insertOne(staff).then((data)=>{
            callback(true)
        })
    },
    viewStaff:()=>{
        return new Promise(async(resolve,reject)=>{
            let staff = await db.get().collection('staff').find().toArray()
            resolve(staff)
        })
    }
}
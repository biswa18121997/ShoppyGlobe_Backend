import mongoose from 'mongoose';
//connection function for database..
export const Connect=()=>mongoose.connect('mongodb+srv://biswajitshrm6:7DL0Lz8dxicjlXQJ@users.mt5yvfh.mongodb.net/ShoppyGlobe')
.then(()=>{
    console.log("database is connected succesfully..");
})
.catch((e)=>{
    console.log(e);
})
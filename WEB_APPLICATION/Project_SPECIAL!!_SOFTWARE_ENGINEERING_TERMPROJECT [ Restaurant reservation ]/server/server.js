const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const host = '127.0.0.1';

var DATABASE = require("./database");

dotenv.config();
app.use(bodyparser.json());
app.use(cors());

//CORS Middleware
app.use(function(req, res, next) {
    //enable CORS removedMiddlewares
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.get('/',(req, res) => {
    const conn = DATABASE;
    conn.connect((err)=>{
        if (err){
            res.send({status:'fail',msg:err});
        }
        res.send({status:'ok',msg:"Connected database successfully"});
    });
});
//logins
app.post('/login',(req,res) => {
    const conn = DATABASE;
    const email = req.body.email;
    const password = req.body.password;
    const query = "SELECT * FROM user WHERE email=?;"
    conn.query(query,[email],(err,rows)=>{
        if(err){
            console.log("Error: ",err);
            res.send({status:'fail',msg:err});
            conn.end();
        }
        else{
            const OBJ = rows.map((row)=>{
                return {uid: row.uid,
                        first_name: row.fname,
                        last_name: row.lname,
                        Email: row.email,
                        tel: row.tel
                    }
            });
            const hashOBJ = rows.map((row)=>{
                return {
                    password: row.hashpassword
                    }
            });
            if(bcrypt.compare(password, hashOBJ[0].password)){
                res.send({status:'success',msg:OBJ});
                conn.end();
            }
            else{
                res.send({status:'fail',msg:"Login Unsuccessfully !"});
                conn.end();
            }
        }
    });

});

//create user
app.post('/user',(req, res) => {
    const conn = DATABASE;
    const uid = req.body.uid;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const tel = req.body.tel;
    const email = req.body.email;
    const password = req.body.password;
    const query = "INSERT INTO user (uid,fname,lname,email,hashpassword,tel) VALUES (?,?,?,?,?,?)";

    bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS,10), (err,hash) => {
        conn.query(query,[uid,fname,lname,email,hash,tel],(err)=>{
            if (err){
                console.log("Error: ",err);
                conn.end();
                res.send({status:'fail',msg:err});
            }
        res.send({status:'success',msg: "Created user successfully !"});
        });
    });
});

//Update data user
app.put('/user',(req,res)=>{
    const conn = DATABASE;
    const uid = req.body.uid;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const tel = req.body.tel;
    const email = req.body.email;
    const password = req.body.password;
    const query = "SELECT * FROM user WHERE email=?;"
    conn.query(query,[email],(err,rows)=>{
        if(err){
            console.log("Error: ",err);
            res.send({status:'fail',msg:err});
            conn.end();
        }
        else{
 
            const hashOBJ = rows.map((row)=>{
                return {
                    password: row.hashpassword
                    }
            });
            if(bcrypt.compare(password, hashOBJ[0].password)){
                const query2 = "UPDATE user SET fname=?,lname=?,tel=? WHERE uid=?;";
                conn.query(query2,[fname,lname,tel,uid],(err,row2s)=>{
                    if(err){
                        console.log("Error: ",err);
                        res.send({status:'fail',msg:err});
                        conn.end();
                    }
                    else{
                        const query3 = "SELECT * FROM user WHERE uid=?;";
                        conn.query(query3,[uid],(err,row3s)=>{
                        if(err){
                            console.log("Error: ",err);
                            res.send({status:'fail',msg:err});
                            conn.end();
                        }
                        else{
                            const OBJ = row3s.map((row)=>{
                                return {
                                    uid: row.uid,
                                    first_name: row.fname,
                                    last_name: row.lname,
                                    Email: row.email,
                                    tel: row.tel
                                }
                            });
                            res.send({status:'success',msg:OBJ});
                            conn.end();
                        }
                        });
                    }
                });
            
        }else{
                res.send({status:'fail',msg:"Update data Unsuccessfully !"});
                conn.end();
            }
        }
    });
});

//Delete user data
app.delete('/user',(req,res)=>{
    const conn = DATABASE;
    const uid = req.body.uid;
    const email = req.body.email;
    const password = req.body.password;
    const query = "SELECT * FROM user WHERE email=?;"
    conn.query(query,[email],(err,rows)=>{
        if(err){
            console.log("Error: ",err);
            res.send({status:'fail',msg:err});
            conn.end();
        }
        else{
            const OBJ = rows.map((row)=>{
                return {uid: row.uid,
                        first_name: row.fname,
                        last_name: row.lname,
                        Email: row.email,
                        tel: row.tel
                    }
            });
            const hashOBJ = rows.map((row)=>{
                return {
                    password: row.hashpassword
                    }
            });
            if(bcrypt.compare(password, hashOBJ[0].password)){
                const query2 = "DELETE FROM user WHERE uid=?;";
                conn.query(query2,[uid],(err,rows2)=>{
                    if(err){
                        console.log("Error: ",err);
                        res.send({status:'fail',msg:err});
                        conn.end();
                    }
                    else{
                        res.send({ status:'success',msg:'Deleted User Successfully !'})
                        conn.end();
                    }
                });
            }
            else{
                res.send({status:'fail',msg:"Login Unsuccessfully !"});
                conn.end();
            }
        }
    });

});

app.listen(port,host,() => {
    console.log(`App Listening at http://${host}:${port}`);
});
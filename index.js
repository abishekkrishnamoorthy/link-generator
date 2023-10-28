const express=require('express')
const app=express()
const path=require('path')
const con = require('./conn/dbc')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join('./public')))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
}).listen(3000,()=>{ console.log('running')})

app.post('/created',(req,res)=>{
    const before=req.body.linkbefore
    const after=`/${req.body.linkafter}`
    console.log(after)
    var sql = "INSERT INTO `map`(`link`,`short`) VALUES ('"+before+"','"+after+"')"
    con.query(sql,function (err, result) {
        if (err) throw err;
        console.log("inserted");
        res.send("sucess")
      });
    
})
app.get('^/([^/]+)$',(req,res)=>{
    const url=req.url
    var sql="SELECT * FROM `map` WHERE `short`='"+url+"'"
    con.query(sql,(error, results, fields)=>{
        const ev=JSON.stringify(results)
        const data=JSON.parse(ev)
        if(results.length>0){
            if(data[0].short==url)
            res.redirect(data[0].link)
        }
        else{
            res.send("not found error")
        }
})
})
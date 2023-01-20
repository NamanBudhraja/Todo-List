const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
var checkedValue=null;
const app=express();
app.use((bodyparser.urlencoded({extended:true})));
app.use(express.static("public"));
const _=require("lodash");
const bodyParser = require("body-parser");
var day;
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://admin-naman:test123@cluster0.39bopjl.mongodb.net/todolistDB",{useNewUrlParser:true});
const tdlschema=new mongoose.Schema({
    name:String
});
const item =mongoose.model("Item",tdlschema);
const it1=new item({
    name:"welcome"
});
const it2=new item({
    name:"Press + to add an item"
});
const it3=new item({
    name:"Press <-- to remove an item"
});
const defaultit=[it1,it2,it3];
const listschema=new mongoose.Schema({
    name:String,
    items:[tdlschema]
});
const list=mongoose.model("List",listschema);
app.get("/",function(req,res){
    var today=new Date();
    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    day=today.toLocaleDateString("en-US",options);
    item.find({},function(err,itdata){
        if(itdata.length===0)
        {
            item.insertMany(defaultit,function(err){
                if(err)
                console.log(err);
                else
                console.log("successfully inserted");
            });
            res.redirect("/");
        }
        else{
        res.render("list",{kind:day,newlist:itdata});}
    });
});
app.get("/:nme",function(req,res){
    const a=_.capitalize(req.params.nme);
    list.findOne({name:a},function(err,found){
        if(!err){
            if(!found){
                const lst=new list({
                    name:a,
                    items:defaultit
                });
                lst.save();
                res.redirect("/"+a);
            }
            else{
                res.render("list",{kind:a,newlist:found.items});
            }
        }
    });
});
app.post("/",function(req,res){
     const dta=req.body.itemlo;
     const bt=req.body.button;
     const itms=new item({
        name:dta
     });
    if(bt==day)
     {
        itms.save();
        res.redirect("/");
     }
     else
     {
     list.findOne({name:bt},function(err,found){
        found.items.push(itms);
        found.save();
        res.redirect("/"+bt);
         });
        }
});
app.post("/delete",function(req,res){
       const del=req.body.chk;
       const d=req.body.lname;
       if(d==day){
       item.deleteOne({_id:del},function(err){
        if(err)
        console.log(err);
        else
        console.log("successfully deleted");
        res.redirect("/");
       });
    }
    else
    {
       list.findOneAndUpdate({name:d},{$pull:{items:{_id:del}}},function(err,found){
       if(!err)
       res.redirect("/"+d);
       });
    }
});
mongoose.set('strictQuery', false);
app.listen(process.env.PORT||3000,function(){
    console.log("server started");
});

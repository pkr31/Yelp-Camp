var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Oh No... Error!!!")
        }
        else{
           
            res.render("campgrounds/index",{ campgrounds:allCampgrounds})
        }
    })
      
        // res.render("campground",{campgrounds:campgrounds});
});
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,image:image,description:desc,author:author};
    // campgrounds.push(newCampground);
    Campground.create(newCampground,function(err,newlyCampground){
        if(err){
           
            
            console.log("Oh No ...Error");
            console.log(err);
        }
        else{
            console.log(newlyCampground)
            res.redirect("/campgrounds");
        }
    })
})
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})


router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
           }
        else{
           res.render("campgrounds/show",{campground:foundCampground});
        }
    })
})
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
         if(err){
            console.log(err)
        }
        else{
             res.render("campgrounds/edit",{foundCampground:foundCampground});
        }
       
    })
    
    
})
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
          res.redirect("/campgrounds")
        }
        else{
          res.redirect("/campgrounds")
        }
    })
})



module.exports=router




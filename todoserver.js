const express=require('express');
const app=express();
const fs=require("fs");
app.use(express.json());
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
});
app.post("/todo",(req,res)=>{
    saveAllTodos(req.body,(err)=>{
        if(err){
            res.status(500).send("error");
            return;
        }
        res.status(200).send("success");
    })
});
app.get("/todo-data",(req,res)=>{
    readAllTodos((err,data)=>{
        if(err){
            res.status(500).send("error");
            return;
        }
        res.status(200).json(data);
    });
});
 

app.post("/delTodo",(req,res)=>{
    const idselected = req.body.id;
    
    readAllTodos((err,todo)=>{
        if(err){
            res.status(500).json({result:"failure"})
            return;
        }
        else{
            todo.forEach((datas,idxs) => {
                if(datas.id=== idselected){
                    todo.splice(idxs,1);
                }
            });
        }
        fs.writeFile("./treasure.mp4" ,JSON.stringify(todo),(err)=>{
            if( err ){
                res.status(500).json({result:'failure W'});
            }
            
            res.status(200).json({result:'success'})
        });
    }); 
});



app.post("/editTodo",(req,res)=>{

    readAllTodos((err,todo)=>{
        if(err){
            res.status(500).json({update:'failed'});
            return;
        }

        const edited = req.body;
        // console.log(edited.id);

        todo.forEach((data,idx)=>{
            console.log(data.id);
            if(data.id === edited.id){
                todo[idx].todoText = edited.data;
            }
        });

        fs.writeFile("./treasure.mp4",JSON.stringify(todo),(err)=>{
            if( err ){
                res.status(500).json({ update :'failed'});
            }
            
            res.status(200).json({update:'success'})
        });
    }); 
})





app.get("/about",(req,res)=>{
    res.sendFile(__dirname+"/public/about.html");
});
app.get("/contact",(req,res)=>{
    res.sendFile(__dirname+"/public/contact.html");
});
app.get("/todo",(req,res)=>{
    res.sendFile(__dirname+"/public/todo.html");
});

app.get("/scripts/todoscript.js",(req,res)=>{
    res.sendFile(__dirname+"/scripts/todoscript.js");
});



app.listen(3000,()=>{
    console.log("The app is running at port http://localhost:3000");
});

function readAllTodos(callbacks){
    fs.readFile("./treasure.mp4","utf-8",(err,data)=>{
        if(err){
           callbacks(err);
            return;
        }
        if(data.length===0){
            data="[]";
        }
        try {
        data=JSON.parse(data); 
        callbacks(null,data);
        } 
        catch (err) {
            callbacks(err);
            return;
        }
    });
}
function saveAllTodos(todo,callbacks){
    readAllTodos((err,data)=>{
        if(err){
            callbacks(err);
             return;
         }
         data.push(todo); 
         fs.writeFile("./treasure.mp4",JSON.stringify(data),(err)=>{
            if(err){
                callbacks(err);
                return;
            }
            callbacks(null);
        }); 
    });
}
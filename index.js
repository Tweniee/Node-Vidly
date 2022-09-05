const startupDebugger = require("debug")('app:startup')
const dbDebugger = require("debug")('app:db')
const express = require('express');
const validation = require("./validate")
const morgan = require("morgan")
const helmet = require("helmet")
const logger = require("./logger")
const app = express();

//enviroment variables (DEV,PROD or .....)
// console.log("NODE_ENV: ",process.env.NODE_ENV) 
// console.log("App: ",app.get('env'))

//Using Template View for MVC 
app.set("view engine","pug");
app.set("views","./views"); //default or you can change it

//Middlewares
app.use(express.json());
app.use(logger) //using logger
app.use(express.static('public')); //to access static files present in public folder
if(app.get("env") === "development"){
    startupDebugger("Morgan is enable")
app.use(morgan('combined')) //it will log every HTTP req
}
app.use(helmet())

//db work
dbDebugger("Db connected")


const genres = [
    { "id": 1, "name": "Action" },
    { "id": 2, "name": "Animation" },
    { "id": 3, "name": "Comedy" },
    { "id": 4, "name": "Crime" },
    { "id": 5, "name": "Drama" },
    { "id": 6, "name": "Experimental" },
    { "id": 7, "name": "Fantasy" },
    { "id": 8, "name": "Historical" },
    { "id": 9, "name": "Horror" },
    { "id": 10, "name": "Romance" }
]

app.get("/",(req,res)=>{
    // res.send("Hello WOrld")
    res.render('index',{title: "My First App",message: "Hello world"}); 
    //render accept first arguement of the file you are targetting
    //and second arguement to accept the keys values to defined in the view 
})

app.get("/api/genres", (req, res) => {
    res.status(200).send(genres)
});

app.post("/api/genres", (req, res) => {
    const { error } = validation(req.body);
    if (error ?? false) { //using Nullish operator to check if error is null or not
        error.details.forEach(err => { //forEach loop for every error message
            res.status(400).send(err.message)
        });
        return;
    }
    genres.push(req.body); //making the new object to add in existing genres
    res.status(200).send(req.body);
});

app.put("/api/genres/:id", (req, res) => {
    const { error } = validation(req.body);
    if (error ?? false) { //using Nullish operator to check if error is null or not
        error.details.forEach(err => { //forEach loop for every error message
            res.status(400).send(err.message)
        });
        return;
    }
    let genreIndex = -1
    genres.forEach((item, index) => {
        if (item.id === parseInt(req.params.id)) genreIndex = index
    })
    if (genreIndex == -1) return res.status(404).send("Invalid Id Genre not found");
    genres[genreIndex] = req.body;
    res.send(genres)
});

app.delete("/api/genres/:id",(req,res)=>{
    let genreIndex = -1;
    genres.forEach((item, index) => {
        if (item.id === parseInt(req.params.id)) genreIndex = index
    })
    if (genreIndex == -1) return res.status(404).send("Invalid Id Genre not found");
    genres.splice(genreIndex,1);
    res.send(genres);
});


const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`lisening to Port ${Port}`)
})

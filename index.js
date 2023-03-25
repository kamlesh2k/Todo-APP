// require express for setting up the express server
const express = require('express');
// set up the port number
const port = 8000;
// using express
const app = express();
// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded());

// importing the DataBase
const db = require('./config/mongoose');
// importng the Schema For tasks
const  Task  = require('./models/task');



var TodoApp= [
    {
        description: "Assignment",
        category: "Work",
        date: "18-05-2023"
    },
    {
        description: "Party",
        category: "Friends",
        date: "20-05-2023"
    },
    {
        description: "Shoping",
        category: "Family",
        date: "18-05-2023"
    }
]



// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//rendering the App Page
// app.get('/', function(req, res){
//     Task.find({}).then(()=>{
//         console.log("data found");
//         return res.render('home', {
//             tittle: "TODO APP",
//             task: TodoApp
//         });

//     }).catch((err)=>{
//             console.log('Error in Fetching contacts from db :-', err);
//             return;
//     })
// });
app.get('/', function(req, res) {
    Task.find({})
      .then(function(tasks) {
        res.render('home', {
          title: 'Home',
          task: tasks
        });
      })
      .catch(function(err) {
        console.log('Error in fetching tasks from db', err);
        res.status(500).send('Internal Server Error');
      });
  });


// creating Tasks
// app.post('/create-task', function(req, res){
//     //  console.log("Creating Task");
      
//     Task.create({
//           description: req.body.description,
//           category: req.body.category,
//           date: req.body.date
//           }, function(err, newtask){
//           if(err){console.log('error in creating task', err); return;}
//           //console.log(newtask);
//           return res.redirect('back');
  
//       });
//   });
app.post('/create-task', function(req, res) {
    Task.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
      })
      .then(function(newTask) {
        console.log('Task created:', newTask);
        return res.redirect('back');
      })
      .catch(function(err) {
        console.log('Error in creating task', err);
        return res.status(500).send('Internal Server Error');
      });
  });



  //delete a task
//   app.get('/delete-task', function(req, res){
//     // get the id from query
//     var id = req.query;
//     // checking the number of tasks selected to delete
//     var count = Object.keys(id).length;
//     for(let i=0; i < count ; i++){
//         // finding and deleting tasks from the DB one by one using id
//         Task.findByIdAndDelete(Object.keys(id)[i], function(err){
//         if(err){
//             console.log('error in deleting task');
//             }
//         })
//     }
//     return res.redirect('back'); 
// });
app.get('/delete-task', function(req, res) {
    // get the id from query
    const id = req.query;
    // checking the number of tasks selected to delete
    const count = Object.keys(id).length;
  
    // create an array to hold the promises returned by Task.findByIdAndDelete()
    const deletePromises = [];
  
    for (let i = 0; i < count; i++) {
      // push each promise to the array
      deletePromises.push(Task.findByIdAndDelete(Object.keys(id)[i]));
    }
    // use Promise.all() to wait for all promises to complete before redirecting
    Promise.all(deletePromises)
      .then(function() {
        return res.redirect('back');
      })
      .catch(function(err) {
        console.log('error in deleting tasks', err);
        res.status(500).send('Internal Server Error');
      });
  });
  
  



// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server :`, err);
    }

    console.log(`Server is running on port : `, port);
});
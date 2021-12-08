const express = require("express");
const http = require("http");
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// const bodyParser = require("body-parser");
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/socket.html");
  // userName = req.body.name;
  // socket.user = userName;
  // console.log("2 är: " + socket.user);
});

let users = 0;
let allUsers = [];

// när en klient ansluter och skapar en socket triggas händelsen "connection" på serversidan
io.on("connection", (socket) => {   // obs - inparametern socket hänvisar till den aktuella uppkopplingen mot en viss klient

  socket.on("userName", (userName) => {
    
    let userId = socket.id;

    socket.user = userName; //Ger användarnamn
    allUsers [users] = socket.user; // Lägger i listan
    users++;
    console.log(allUsers[0]);
    console.log(allUsers[1]);

    for(let i = 0; i < allUsers.length; i++){
      io.emit("online", allUsers[i]);
    } 

    // socket.on("online", () => {
    // });

    let newConnection;
    if (users < 2 ){  
      newConnection = 'Du är den enda här just nu ' + userName;
      io.emit("announcement", newConnection );
    }
    else {
      newConnection = "En klient anslöt sig till servern! Det är " + users + " användare anslutna.";
      socket.broadcast.emit("announcement", newConnection );
      io.to(userId).emit("announcement", "Välkommen " + userName + ". Det är " + users + " användare anslutna.");      
    }

    // lyssna på händelsen "chat"
    socket.on("chat", (name , msg) => {
      socket.broadcast.emit("chat", name, msg);
    });

    socket.on("typing", function(data) {
        console.log("typing");
    // send an event to everyone but the person who emitted the typing event to the server
      socket.broadcast.emit("typing", data);
    });

    socket.on('disconnect', function () {

      allUsers [users] = " ";

      for(let i = 0; i < allUsers.length - 1; i++){
        io.emit("online", allUsers[i]);
      } 
      users--;

      let newDisconnection;
      if (users > 2){
        newDisconnection ="En klient lämnade servern! Det är " + users + " användare anslutna.";
      }
      else {
        newDisconnection ="Nu är det bara du kvar " + userName;
      }
      socket.broadcast.emit("announcement", newDisconnection);

    });
  });  
});

server.listen(3000, () => {
  console.log('Lyssnar på port 3000');
});
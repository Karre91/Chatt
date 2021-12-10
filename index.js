const express = require("express");
const { all } = require("express/lib/application");
const http = require("http");
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);  

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/socket.html");
});

let users = 0; 
let allUsers = [];

// när en klient ansluter och skapar en socket triggas händelsen "connection" på serversidan
io.on("connection", (socket) => {  
  
  socket.on("userName", (userName) => {    

    let userId = socket.id; 

    socket.user = userName; //Ger användarnamn
    allUsers.push(socket.user); //Lägger till i listan

    users++; //Ökar antalet
    
    io.emit("usersOnline", allUsers);  // Skriver ut alla online 

    let newConnection;
    if (users < 2 ){  
      newConnection = 'Du är den enda här just nu ' + userName;
      io.to(userId).emit("announcement", newConnection);
    }
    else {
      newConnection = userName + " anslöt sig till servern! Det är " + users + " användare anslutna.";
      socket.broadcast.emit("announcement", newConnection);
      io.to(userId).emit("announcement", "Välkommen " + userName + ". Det är " + users + " användare anslutna.");      
    }    

    // lyssna på händelsen "chat"
    socket.on("chat", (name , msg) => {
      socket.broadcast.emit("chat", name, msg);
    });

    // Lyssna på händelssen "typing"
    socket.on("typing", (bool, userName) => {
      socket.broadcast.emit("typing", bool, userName);
    });

    //När någon lämnar chatten
    socket.on('disconnect', function () {
  
      allUsers = allUsers.filter(item => item !== socket.user); //Ta bort den användare som triggade eventet
      socket.broadcast.emit("usersOnline", allUsers); 

      users--;
      
      let newDisconnection;
      if (users > 1){
        newDisconnection ="Någon lämnade servern! Det är " + users + " användare anslutna.";
        socket.broadcast.emit("announcement", newDisconnection);
      }
      else {
        newDisconnection ="Nu är det bara du kvar " + allUsers;
        io.emit("announcement", newDisconnection );
      }      
    });
  });  
});

server.listen(3000, () => {
  console.log('Lyssnar på port 3000');
});
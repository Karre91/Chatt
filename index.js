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
});

let users = 0;

// när en klient ansluter och skapar en socket triggas händelsen "connection" på serversidan
io.on("connection", (socket) => {   // obs - inparametern socket hänvisar till den aktuella uppkopplingen mot en viss klient
    
    users++;
    let userId = socket.id;

    let newConnection;        
    if (users < 2 ){
        newConnection = "Du är den enda här just nu.";
        io.emit("announcement", newConnection );    
            
    }
    else {
        newConnection = "En klient anslöt sig till servern! Ni är " + users + " här just nu.";
        socket.broadcast.emit("announcement", newConnection );  
        io.to(userId).emit("announcement", "Välkommen, ni är " + users + " här just nu" );  
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
      users--;
      let newDisconnection;
      if (users > 2){
        newDisconnection ="En klient lämnade servern! Nu är ni " + users + " stycken.";
      }
      else {
        newDisconnection ="Nu är det bara du kvar.";
      }
      
      socket.broadcast.emit("announcement", newDisconnection)
   });


   

});

server.listen(3000, () => {
  console.log('Lyssnar på port 3000');
});
window.onload = () => {
    // trigga händelsen "connection" hos servern genom att skapa en socket på klientsidan   
    let userName = prompt("Ange användarnamn:");
    while (!userName){
        userName = prompt("Ange användarnamn:");
    }    
    // document.getElementById("name").value = userName;
    
    const socket = io();    // anropa socket.io:s konstruktor  

    var messages = document.getElementById("messages");
    var online = document.getElementById("online");
    
    socket.emit('userName', userName);

    
    // let allUsers = [];
    
    // userList.setAttribute("id","onl");
    
    // Skriver ut
    socket.on("online", (user) => {        
        console.log("UsER: " + user)
        
        var userList = document.createElement('li');
        userList.textContent =  user;
        online.appendChild(userList);

        //window.scrollTo(0, document.body.scrollHeight);
        // allUsers.push(user);

        // for(let i = 0; i < allUsers.length; i++){      
        
        // 
    });
    
    // ta emot användarinput och skicka meddelande
    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();   // hindra att formuläret laddas om         

        let msg = document.getElementById("input").value;
        let tid = new Date().toISOString().substr(11, 8);        

        if (msg != "") {
            socket.emit("chat", userName, msg); // skicka händelse till server  

            //Skriver ut
            var item = document.createElement('li');
            item.textContent =  `${tid}: Jag - ${msg}`;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);

            document.getElementById("input").value = "";   // rensa inmatningsfältet 
        }        
    });

    let write = document.getElementById("input");
    write.addEventListener("keypress", function() {          
        console.log("keypress");        
        socket.emit("typing", userName);

    });   

    socket.on("typing", function (name) {
        console.log("typing klient");      
        let typ = document.getElementById("typ");      
        typ.innerHTML = "💬" + name + " skriver...";
    });    
    
    //Skriver ut announcements om när personer kommer in i chaten
    socket.on("announcement", (string) => {
        console.log("announcement");
        var item = document.createElement('li');
        item.textContent = string;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    // ta emot meddelanden från servern och skriv ut
    socket.on("chat", (name , msg) => {
        console.log("klient ");
        let typ = document.getElementById("typ");      
        typ.innerHTML = " "; 

        let tid = new Date().toISOString().substr(11, 8);   // aktuellt klockslag i formatet hh:mm:ss
        
        var item = document.createElement('li');
        item.textContent =   `${tid}: ${name} - ${msg}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);        
    });
}



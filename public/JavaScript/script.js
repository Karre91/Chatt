window.onload = () => {
    //Frågar efter användarnamn  
    let userName = prompt("Ange användarnamn:");
    while (!userName){
        userName = prompt("Ange användarnamn:");
    }    
    
    const socket = io();    // anropa socket.io:s konstruktor  
    socket.emit('userName', userName); // Till serversidan, skickar med användarnamn

    var messages = document.getElementById("messages");  
    var onlineBox = document.getElementById("onlineBox"); //OBS   
    let typing = document.getElementById("typing");  
    let tid = new Date().toISOString().substr(11, 8); 
    let write = document.getElementById("input");
    
    
    // Skriver ut anslutna användare
    socket.on("usersOnline", (data) => { 
        document.getElementById("onlineBox").innerHTML = ""; // Nollställer online listan

        var userList = document.createElement('p');
        // userList.setAttribute("class","onlineUser");  
        userList.textContent =  data;
        onlineBox.append(userList);
    });    

    // ta emot användarinput och skicka meddelande
    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();   // hindra att formuläret laddas om         

        let msg = document.getElementById("input").value;
        if (msg != "") {
            socket.emit("chat", userName, msg); // skicka händelse till server  

            //Skriver ut
            var item = document.createElement('li');
            item.setAttribute("id","myMess"); 
            item.textContent =  `${tid} Jag -  ${msg} \n`;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);

            document.getElementById("input").value = "";   // rensa inmatningsfältet 
        }        
    });

    // Timer
    let timeout;   
    function timeoutFunction() {
        socket.emit("typing", false, userName);
    }
        
    // Lyssnar på om någon skriver
    write.addEventListener("keyup", ()  => {
        socket.emit("typing", true, userName); 
        clearTimeout(timeout); // Rensar timeout
        timeout = setTimeout(timeoutFunction, 800);
    });

    // Skriver ut när någon skriver
    socket.on("typing", (bool, name) => {
        if (bool == false) {
            typing.innerHTML = " "; 
        }
        else if (bool == true) {
            typing.innerHTML = "💬" + name + " skriver..."; 
        }
    });    
    
    // Skriv ut 
    socket.on("announcement", (string) => {
        var item = document.createElement('li');
        item.textContent = string;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    // ta emot meddelanden från servern och skriv ut
    socket.on("chat", (name , msg) => { 
        var item = document.createElement('li');
        item.textContent =   `${tid}: ${name} - ${msg} \n`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);        
    });
}



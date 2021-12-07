window.onload = () => {
    // trigga händelsen "connection" hos servern genom att skapa en socket på klientsidan   
    let socket = new io();    // anropa socket.io:s konstruktor    
    
    // ta emot användarinput och skicka meddelande
    document.getElementById("form").addEventListener("submit", (evt) => {
        evt.preventDefault();   // hindra att formuläret laddas om         

        let msg = document.getElementById("input").value;
        let name = document.getElementById("name").value;
        let tid = new Date().toISOString().substr(11, 8);

        if (msg != "") {
            socket.emit("chat", name, msg); // skicka händelse till server  

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
        let name = document.getElementById("name").value;
        console.log("keypress");        
        socket.emit("typing", name);

    });

    socket.on("typing", function (name) {
        console.log("typing klient");      
        let typ = document.getElementById("typ");      
        typ.innerHTML = name + " skriver...";
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



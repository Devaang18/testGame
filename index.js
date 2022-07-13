const sock = io();


let i=1; regdice=0; locdice=0;

const writeEvent = (text) => {
    
    const parent = document.querySelector('#events');

    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};

/*const ChatSetup = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    
    const text = input.value;
   
    


    sock.emit('message', text);
    
};*/


const JoinRoomSetup = (e) => {
    e.preventDefault();

    const roomInput = document.querySelector('#join-room');
    const roomName= roomInput.value;

    roomInput.value = '';

    sock.emit('join-room', roomName, msg => {
        writeEvent(msg);  
    });
};

const CreateRoomSetup = (e) => {
    e.preventDefault();

    const roomInput = document.querySelector('#create-room');
    const roomName= roomInput.value;

    roomInput.value = '';

    sock.emit('create-room', roomName, msg => {
        writeEvent(msg);
    });
};

function regionalrainfall (){
    document.getElementById('regional').style.display="block";
    const rndInt = Math.floor(Math.random() * 6) + 1;
    regdice = document.getElementById("Regional-Outcome").innerHTML = rndInt;
    disableButton("regionalRain");
    localrainfall();
    enableButton("localRain");
    document.getElementById("Local-Outcome").innerHTML = "...";  
}

function localrainfall (){
    document.getElementById('local').style.display="block";
    const rndInt = Math.floor(Math.random() * 6) + 1;
    locdice = document.getElementById("Local-Outcome").innerHTML = rndInt;
    disableButton("localRain");
    document.getElementById('outcome').style.display="block";
}

function outcome(){
    if (regdice+locdice>=10){
        writeEvent('Flood');
        sock.emit('flood');
    }
    else {
        writeEvent('No Flood');
    }
    displayNextButton();
}

function ending(){
    writeEvent('Thank you for participating');
    document.getElementById('nextRound').style.display="none";
    document.getElementById('outcome').style.display="none";
    document.getElementById('local').style.display="none";
    document.getElementById('regional').style.display="none";
    document.getElementById('endButton').style.display="none";
}



function enableButton(name){
    document.getElementById(name).disabled=false;
}
function disableButton(name){
    document.getElementById(name).disabled=true;
}


const pfpgame = (e) => {
    document.getElementById('wrapper').style.display="none";
    regionalrainfall();
    enableButton("regionalRain");
    document.getElementById("Regional-Outcome").innerHTML = "...";
};

const roundloop = (e) => {
    if (i<=3)
    {
        writeEvent(`Round ${i}`);
        pfpgame();
        i++;
    }
    else{
        document.getElementById('nextRound').style.display="none";
        writeEvent('Game Over');
        document.getElementById('endButton').style.display="block";
    }
};

function roundloopbuttonRun(){
    roundloop();
}

function displayNextButton(){
    document.getElementById('nextRound').style.display="block";
}

sock.on('server-client', roundloop);
sock.on('message', writeEvent);

document.getElementById('nextRound').style.display="none";
document.getElementById('outcome').style.display="none";
document.getElementById('local').style.display="none";
document.getElementById('regional').style.display="none";
document.getElementById('endButton').style.display="none";


//Chat setup
/*document
    .querySelector('#chat-form')
    .addEventListener('submit', ChatSetup);*/
    

document
    .querySelector('#join-room-form')    
    .addEventListener('submit', JoinRoomSetup);

document
    .querySelector('#create-room-form')    
    .addEventListener('submit', CreateRoomSetup);


    

const epmt = require('electron-prompt');
const remote =  require('@electron/remote')

function getInput(str) {
  epmt({
    title: 'that-square-game.herokuapp.com says',
    label:  str,
    value: '',
    inputAttrs: {
        type: 'text',
        required: true
    },
    type: 'input',
    alwaysOnTop: true,
})
.then((r) => {
    if(r === null) {
        return null;
    } else {
        
        players[0].name = r;
        socket.emit("SetName", players[0].name);
    }
})
.catch(console.error);
    
}

prompt = getInput;
globalThis.ToggleFs = function() {
  remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
}

globalThis.ChangeRoom =function() {
  if(room == "main"){
    room = "gun"
  }
  else if(room == "gun"){
    room = "main"
  }

  socket.emit("ChangeRoom", room)
  for (player in players) {
      if (player != 0)
          delete players[player];
  }
  SetupRoom();
  let p = GeneratePlayer();
  p.name = players[0].name;
  p.colour = players[0].colour;
  p.isMain = true;

  players[0] = p;
}
function removeOptionsMenu() {
    0 == globalThis.drawOptions && null != document.getElementById("optionsMenu") && document.getElementById("optionsMenu").remove()
  } 
function insertOptionsMenu() {
    1 == globalThis.drawOptions && null == document.getElementById("optionsMenu") && document.body.insertAdjacentHTML("beforeend",
     `<div id="optionsMenu">
          <div id="optionsMenuBG" class="btn-group-vertical d-flex justify-content-center">
          <button id="changeRoom" class="opBtn  mx-auto d-block" ">Change Room</button>
          <button id="toggleFs" class="opBtn  mx-auto d-block" ">Toggle fullscreen</button>
        </div>
        <style>
          .opBtn{padding: 0px 10px;}
          #optionsMenuBG{
            justify-content: center;  
            width: 275px;
            height: 400px;
            text-align:center;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);}
          #optionsMenu{
            position:fixed;
            width:100%;
            height:100%;
            top:0px;
            left:0px;
            z-index:1000;
            margin: 0;
            background-color: rgba(0, 0, 0,0.3);
          }
       </style>
      </div>`)
      document.getElementById("changeRoom").addEventListener("click", globalThis.ChangeRoom)
      document.getElementById("toggleFs").addEventListener("click", globalThis.ToggleFs)
  }
document.addEventListener("keydown", (e) => {
  if(e.key == "Escape" && e.repeat == false){globalThis.drawOptions = !globalThis.drawOptions}
})

globalThis.window.onresize = () => {
  c = document.getElementById("canvas");
  c.height = window.innerHeight
  c.width = window.innerWidth
  if(room == "gun"){  
   camera.bounds.x = 600,camera.bounds.y = 400
}
else if(room == "main"){
    camera.bounds.x = c.width / 8 * 3;
    camera.bounds.y = c.height / 8 * 3
}
textbox.width = document.getElementById("canvas").width;
textbox.y = document.getElementById("canvas").height - 50;

}

globalThis.window.onload = () => {
  document.body.insertAdjacentHTML("beforeend",`<!-- CSS only --><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`);
  var original = globalThis.Loop;
  globalThis.drawOptions = false;
  globalThis.Loop = () => {
    if(globalThis.drawOptions){
      insertOptionsMenu();
    }
    else{
      removeOptionsMenu();
    }
    if(globalThis.drawOptions == true){
      original();
    }
  }
}

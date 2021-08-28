"use strict";

let canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 600;
let ctx = canvas.getContext("2d");
ctx.lineWidth = 1;
ctx.shadowColor = "black";
let pausemenu = document.getElementById("pausemenu");



let clicks = 0;
let selector = {};
let ENEMIES = [];
let TOWERS = [];
let BULLETS = [];
let PARTICLES = [];

const PI = Math.PI;
const keys = {};
let GAMEOBJECTS = [];
let KEYSCOLLECTED = [];
let level = 1;
let textFile = null;
let style = true;


let levelhtml = document.getElementById("levelhtml");
levelhtml.value = "test"
let playerhealth = document.getElementById("playerhealth");
playerhealth.value = 10;
let playermoney = document.getElementById("playermoney");
playermoney.value = "Money: 8$";
let levelwave = document.getElementById("levelwave");
levelwave.value = 0;

let LEVELS = [
    
    {
        name:"Testing man",
        content:[
            {x:100,y:150,w:100,h:40},
        ],
        lpath:[
            {x:10,y:20},
            {x:10,y:60},
            {x:40,y:40},
            {x:80,y:80},

        ]
    },

    {"content":[{"x":20,"y":140,"w":80,"h":380,"t":"platform","e":"none"},{"x":200,"y":340,"w":140,"h":140,"t":"platform","e":"none"},{"x":380,"y":140,"w":140,"h":140,"t":"platform","e":"none"},{"x":580,"y":360,"w":100,"h":100,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":90},{"x":100,"y":100},{"x":140,"y":140},{"x":150,"y":240},{"x":180,"y":500},{"x":240,"y":540},{"x":330,"y":530},{"x":370,"y":500},{"x":350,"y":140},{"x":370,"y":100},{"x":500,"y":90},{"x":540,"y":130},{"x":560,"y":490},{"x":620,"y":530},{"x":690,"y":520},{"x":720,"y":480},{"x":710,"y":330},{"x":750,"y":280},{"x":790,"y":280}],"name":"test"}
    ,
]


// timer

const timer = {
    time:0,
    reset: function(set=0){this.time = set},
    start: function(){this.timer = setInterval(() => {
        this.time += 100;
    }, 100);},
    stop: function(){clearInterval(this.timer)},
    display: function(){
        timerhtml.value = time(this.time);
    
    }


}


// gameobject class

class gameobject{

    constructor(x,y,width,height,type = "platform",extra = "none"){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.extra = extra;
        this.setcolors();

    }

    update(){
    }

    render(){
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;


        ctx.beginPath();
        ctx.globalAlpha = this.opac;
        ctx.strokeStyle = this.strokecolor;
        ctx.fillStyle = this.fillcolor;
        ctx.shadowColor = this.shadowcolor;

        if(style){
            ctx.strokeRect(this.x,this.y,this.width,this.height);
            ctx.fillRect(this.x,this.y,this.width,this.height);

        }else{
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.strokeRect(this.x,this.y,this.width,this.height);
        }
        
        
        ctx.fill()
        ctx.stroke(); 
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;


    }

    collision(x1,y1,x2,y2){
        let colleft = (x1 > this.x && x1 < this.x+this.width);
        let colright =  (x2 > this.x && x2 < this.x+this.width);

        let coltop = (y1 > this.y && y1 < this.y+this.height);
        let colbottom = (y2 > this.y && y2 < this.y+this.height);

        
        let col = (colright || colleft) && (coltop || colbottom) 


        return {col,coltop,colbottom,colright,colleft};
    }

    setcolors(){
        if(this.type === "platform"){
            this.strokecolor = "black"
            this.fillcolor = "white";
            this.shadowcolor = "black";
            this.opac = 1;
        } 
        else if(this.type === "lava"){
            this.strokecolor = "red";
            this.fillcolor = "red";
            this.shadowcolor = "red";
            this.opac = 1;
        }    
        else if(this.type === "goal"){
            this.strokecolor = "yellow";
            this.fillcolor = "yellow";
            this.shadowcolor = "grey";
            this.opac = 1;
        }    
        else if(this.type === "bounce"){
            this.strokecolor = "#6ec971"
            this.fillcolor = "green";
            this.shadowcolor = "#6ec971";
            this.opac = 1;
        }
        else if(this.type === "water"){
            ctx.globalAlpha = 0.3;
            this.strokecolor = "white"
            this.fillcolor = "#6dccff";
            this.shadowcolor = "#6dccff";
            this.opac = 0.5;
        }else{
            this.strokecolor = "white"
            this.fillcolor = "pink";
            this.shadowcolor = "pink";
            this.opac = 1;
        }
    }

}

class enemy{

    constructor(type){
        this.x = 0;
        this.y = 0;
        this.pathprog = 0;
        this.type = type
        this.settypes();
    }

    update(i){

        let levelx = LEVELS[level].lpath[this.pathprog].x;
        let levely = LEVELS[level].lpath[this.pathprog].y;

        if(this.health <= 0){
            makeparticle(this.x,this.y,"explosion");
            ENEMIES.splice(i,1);
            player.changemoney(0.1);
            makeparticle(this.x,this.y,"money",0.1);

        }

        if(this.pathprog === 0){
            this.x = LEVELS[level].lpath[0].x;
            this.y = LEVELS[level].lpath[0].y;
            this.pathprog ++;
        }else{

            
            let distancep = distance(LEVELS[level].lpath[this.pathprog-1].x,levelx,LEVELS[level].lpath[this.pathprog-1].y,levely);
            let newspeed_x = Math.abs(LEVELS[level].lpath[this.pathprog-1].x-levelx)/distancep*this.speed ;
            let newspeed_y = Math.abs(LEVELS[level].lpath[this.pathprog-1].y-levely)/distancep*this.speed;

            if(newspeed_x > ( Math.abs(this.x - levelx)) ){this.x = levelx}
            if(newspeed_y > ( Math.abs(this.y - levely)) ){this.y = levely}


            if(this.x > levelx){
                this.x -= newspeed_x
            }
            if(this.x < levelx){
                this.x += newspeed_x
            }
            if(this.y > levely){
                this.y -= newspeed_y
            }
            if(this.y < levely){
                this.y += newspeed_y
            }
            
            
            if(this.x === levelx && this.y === levely){
                if( LEVELS[level].lpath.length-1 > this.pathprog){
                    this.pathprog ++}
                else{
                    ENEMIES.splice(i,1);
                    player.changehealth(-1);
                }
            }

        }
    }

    render(){
        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
        ctx.fill();
    }

    settypes(){

        switch(this.type){

            case "normal_1":
                this.size = 10;
                this.speed = 1;
                this.health = 3;
                this.color = "blue";
                break;
            case "slow_1":
                this.size = 10;
                this.speed = 0.5;
                this.health = 4;
                this.color = "darkblue";
                break;
                case "fast_1":
                    this.size = 10;
                    this.speed = 1.5;
                    this.health = 2;
                    this.color = "lightblue";
                break;
            case "normal_2":
                this.size = 11;
                this.speed = 1.1;
                this.health = 8;
                this.color = "red";
                break;
            case "slow_2":
                this.size = 11;
                this.speed = 0.6;
                this.health = 9;
                this.color = "darkred";
                break;
            case "fast_2":
                this.size = 11;
                this.speed = 1.6;
                this.health = 7;
                this.color = "#FF6666";
                break;
            case "normal_3":
                this.size = 14;
                this.speed = 1.1;
                this.health = 12;
                this.color = "green";
                break;
            case "slow_3":
                this.size = 14;
                this.speed = 0.6;
                this.health = 14;
                this.color = "darkgreen";
                break;
            case "fast_3":
                this.size = 14;
                this.speed = 1.6;
                this.health = 10;
                this.color = "ligthgreen";
                break;

        }


    }



} 

class tower{

constructor(x,y,type){

    this.x = x;
    this.y = y;
    this.type = type;
    this.dir = 0;
    this.wstep = 0;
    this.settype();

}

update(i){
this.wstep += randomrange(1,2);
let bestdistance = Infinity;
let bestenemy = null;
ENEMIES.forEach((v,i)=>{
let enemydistance = distance(v.x,this.x,v.y,this.y)
if(enemydistance< bestdistance && enemydistance < this.range){bestdistance = enemydistance; bestenemy = i;}
})    
if(bestenemy != null){
    this.dir = (Math.atan2((this.y-ENEMIES[bestenemy].y),(this.x-ENEMIES[bestenemy].x)))+PI;
    if(this.wstep > this.firerrate){
        makebullet(this.x,this.y,this.dir,this.shotspeed,this.damage);
        this.wstep = 0;}
}



}

render(){

    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle =  "black";
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x +Math.cos(this.dir)*this.size, this.y + Math.sin(this.dir)*this.size);
    ctx.stroke();
    ctx.strokeStyle =  "black";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;

}

settype(){

    switch(this.type){

        case "tiny_ball_buster":
            this.color = "hsl(185, 32%, 77%)";
            this.size = 10;
            this.range = 150;
            this.firerrate = 50;
            this.shotspeed = 7;
            this.damage = 0.25;
            break;
        case "normal_ball_buster":
            this.color = "hsl(194, 14%, 50%)";
            this.size = 10;
            this.range = 180;
            this.firerrate = 60;
            this.shotspeed = 10;
            this.damage = 1;
            break;
        case "fast_ball_buster":
            this.color = "hsl(194, 14%, 70%)";
            this.size = 10;
            this.range = 190;
            this.firerrate = 55;
            this.shotspeed = 11;
            this.damage = 1;
            break;
        case "normal_ball_crusher":
            this.color = "hsl(194, 14%, 30%)";
            this.size = 10;
            this.range = 130;
            this.firerrate = 100;
            this.shotspeed = 11;
            this.damage = 2;
            break;
        case "normal_ball_sniper":
            this.color = "hsl(194, 14%, 30%)";
            this.size = 10;
            this.range = 400;
            this.firerrate = 300;
            this.shotspeed = 25;
            this.damage = 3;
            break;
        case "holy_ball_smasher":
            this.color = "hsl(0, 20%, 37%)";
            this.size = 10;
            this.range = 300;
            this.firerrate = 3;
            this.shotspeed = 11;
            this.damage = 1;
            break;


        




    }





}


}

class bullet{

    constructor(x,y,dir,speed,damage){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = speed;
        this.damage = damage;
        this.color = "darkred";
        this.size = 5;

    }

    update(i){

        this.x += Math.cos(this.dir)*this.speed;
        this.y += Math.sin(this.dir)*this.speed;
        
        if( this.x > canvas.width-this.size || this.x < 0 ||  this.y > canvas.height-this.size || this.y < 0){
            BULLETS.splice(i,1);
        }

        

        ENEMIES.forEach(v=>{
            if(distance(v.x,this.x,v.y,this.y) < this.size+v.size){
                v.health -= this.damage;
                makeparticle(this.x,this.y,"dmg",this.damage);
                BULLETS.splice(i,1);
            }


        })
    }

    render(){

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
        ctx.fill();

    }

}

const spawnhandler = {

    piece:0,
    step:0,
    spawnrate:150,

    wave:0,
    wavestep:0,
    waverate:3,

    update: function(){
        this.step++;
        if(this.step > this.spawnrate){
            this.step = 0;
            this.piece ++;
            if(this.piece > this.waves[this.wave].pieces.length-1 ){this.piece = 0;this.wavestep++; }
            makeenemy(this.waves[this.wave].pieces[this.piece]);
        }

        if(this.wavestep > this.waverate){
            this.wave ++;
            this.step = -300;
            this.wavestep = 0;
            if(this.wave > this.waves.length-1){this.wave = 0}
            levelwave.value = "Wave: " + this.wave;
            this.setvaltowave();
        }
    },

    setvaltowave: function(){
        this.spawnrate = this.waves[this.wave].wave_spawnrate;
        this.waverate = this.waves[this.wave].wave_waverate;
    },
    
    waves:
    [
        {
            wave_spawnrate: 130,
            wave_waverate:1,    
            pieces:[
                "normal_1",
                "normal_1",
                "normal_1",
                "slow_1",
            ]
        },
        
        {
            wave_spawnrate: 100,
            wave_waverate:3,    
            pieces:[
                "slow_1",
                "slow_1",
                "slow_2",
                "normal_1",
                "normal_1",
            ]
        },

        {
            wave_spawnrate: 50,
            wave_waverate:2,    
            pieces:[
                "slow_2",
                "fast_1",
                "normal_2",
            ]
        },

        {
            wave_spawnrate: 50,
            wave_waverate:2,    
            pieces:[
                "slow_2",
                "fast_1",
                "normal_2",
                "normal_1",
                "normal_2",
                "slow_2",
                "slow_2",
                "normal_2",
                "normal_1",
                "fast_2",
                "fast_2",
                "fast_2",

            ]
        },

        {
            wave_spawnrate: 30,
            wave_waverate:40,    
            pieces:[
                "slow_2",
                "slow_2",
                "slow_2",
                "normal_2",
                "normal_2",
                "fast_2",
                "fast_2",
                "fast_2",
                "fast_3",
                "fast_2",

            ]
        },

    ],


}

class particle{

    constructor(x,y,type,extra){
        this.orginx = x;
        this.orginy = y;
        this.type = type;
        this.extra = extra;
        this.x = x;
        this.y = y;
        this.opac = 1;
        this.settype();
    }
    
    update(i){


        switch(this.type){

            case "explosion":

                this.x += Math.cos(this.dir)*this.speed;
                this.y += Math.sin(this.dir)*this.speed;
                this.speed *= 0.9;
                this.opac -= 0.02;

                if(this.opac <= 0){PARTICLES.splice(i,1)}

                break;

            case "money":
                this.opac -= 0.008;
                this.y -= this.speed;
                this.speed *= 0.9;
                if(this.opac <= 0){
                    PARTICLES.splice(i,1);
                }
                break;
            case "dmg":
                
                this.opac -= 0.05;
                this.y -= this.speed;
                this.speed *= 0.9;
                if(this.opac <= 0){
                    PARTICLES.splice(i,1);
                }
                break;


        }
        
    }
    
    render(){

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.globalAlpha = this.opac;
    ctx.strokeStyle = this.color;

    switch(this.type){

        case "explosion":
            ctx.moveTo(this.orginx,this.orginy);
            ctx.lineTo(this.x,this.y);
            ctx.stroke();
            break;
            case "money":
                ctx.font = "20px Monospace";
                ctx.strokeText(this.extra + "$",this.x,this.y);
                break;
            case "dmg":
                ctx.font = "15px Monospace";
                ctx.strokeText(this.extra,this.x,this.y);
                break;

    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    }

    settype(){

        switch(this.type){

            case "explosion":
                this.opac = 0.5;
                this.dir = randomrange(0,6)+Math.random();
                this.speed = randomrange(1,6);
                this.color = "red";

                break;

            case "money":
                this.opac = 0.9;
                this.speed = randomrange(2,3)+Math.random();;

                if(this.extra > 0){
                    this.color = "green";
                }else{
                    this.color = "red";
                }

                break;
            case "dmg":
                this.opac = 0.8;
                this.speed = 2+Math.random();;
                this.color = "darkred";
                break;


        }


    }
    
    
}

const player = {

    health:10,
    money:8,
    moneystep:0,
    moneyrate:150,
    update:function(){
    player.moneystep++;
    if(player.moneystep > player.moneyrate){
        player.moneystep = 0
        player.changemoney(1)
        makeparticle(750,50,"money",1);
    }
    if(player.health<=0){
        hardreset();
    }
    },
    changehealth:function(amount){
    player.health += amount;
    playerhealth.value = "Health: "+player.health;
    },
    changemoney:function(amount){
    player.money += amount;
    playermoney.value = "Money: "+player.money.toFixed(1)+"$";
    },
    reset:function(){
    player.health=100;
    player.money=0;
    },


}

const shop = {

    stower:"normal_ball_buster",
    sprice:
    {
        tiny_ball_buster:{name:"Tiny Ball Buster",price:4},
        normal_ball_buster:{name:"Normal Ball Buster",price:8},
        fast_ball_buster:{name:"Fast Ball Buster",price:16},
        normal_ball_crusher:{name:"Normal Ball Crusher",price:20},
        normal_ball_sniper:{name:"Normal Ball Sniper",price:40},
        holy_ball_smasher:{name:"Holy Ball Smasher",price:150},

    },
    select:function(selected){
        shop.stower = selected.value;
        document.getElementById("selectedtowerdisplay").innerHTML = shop.sprice[selected.value].name;
    },
    populateshop:function(){
        let towerselect = document.getElementById("towerbar");
        for(let i in shop.sprice){
            let htmltower = shop.sprice[i];
            let towerbtn = document.createElement("button");
            towerbtn.innerHTML = htmltower.name +": "+ htmltower.price + "$";              
            let valuetower = htmltower.name.toLowerCase();    
            valuetower = valuetower.replace(/ /g,"_")
            towerbtn.value = valuetower;
            towerbtn.classList.add("towerselect"); 
            towerbtn.addEventListener("click", ()=>{shop.select(towerbtn)});
            towerselect.appendChild(towerbtn);  

        }

    }





}
shop.populateshop();
shop.select({value:shop.stower})



makeenemy("blue");
//  build level 

buildcurrentlevel();



// game loop 

window.requestAnimationFrame(main); 

let lastRenderTime = 0;
let GameSpeed = 60;
let lastGameSpeed = 60

function main(currentTime){
    window.requestAnimationFrame(main);
    const sslr = (currentTime- lastRenderTime)/1000
    if (sslr < 1 / GameSpeed) {return}
    lastRenderTime = currentTime;  
    render();
    update();
}



function update(){
GAMEOBJECTS.forEach(v=>{v.update();})
ENEMIES.forEach((v,i)=>{v.update(i);})
TOWERS.forEach((v,i)=>{v.update(i);})
BULLETS.forEach((v,i)=>{v.update(i);})
PARTICLES.forEach((v,i)=>{v.update(i);})
spawnhandler.update();
player.update();

if(keys["Escape"]){
    selector.w = 0;
    selector.h = 0;
    removeEventListener("mousemove", mousemove);
    removeEventListener("mouseup", mouseup);
}

}

function render(){

ctx.clearRect(0,0,canvas.width,canvas.height)
if(LEVELS[level].lpath.length > 0){
drawpath();
}
GAMEOBJECTS.forEach(v=>{v.render();})
TOWERS.forEach(v=>{v.render();})
BULLETS.forEach(v=>{v.render();})
PARTICLES.forEach(v=>{v.render();})
ENEMIES.forEach(v=>{v.render();})

ctx.strokeRect(selector.x,selector.y,selector.w,selector.h);
}

// draw path

function drawpath(){
let lpath = LEVELS[level].lpath;
ctx.beginPath();
ctx.moveTo(lpath[0].x,lpath[0].y);
lpath.forEach(v=>{
ctx.lineTo(v.x,v.y);


})
ctx.stroke();

}

// make gm

function makegm(x,y,w,h,type,extra){
    const newgm = new gameobject(x,y,w,h,type,extra);
    GAMEOBJECTS.push(newgm);
}

function makeenemy(type){
    const newe = new enemy(type);
    ENEMIES.push(newe);
}

function maketower(x,y,type){
    const newtower = new tower(x,y,type)
    TOWERS.push(newtower);
}

function makebullet(x,y,dir,speed,damage){
    const newbullet = new bullet(x,y,dir,speed,damage)
    BULLETS.push(newbullet);
}

function makeparticle(x,y,type,extra){
    switch(type){

        case "explosion":
            
            for(let i = 0; i<randomrange(10,30);i++){
                const newpar = new particle(x,y,type)
                PARTICLES.push(newpar);
            }
            break;
        case "money":
        case "dmg":
            const newpar = new particle(x,y,type,extra)
            PARTICLES.push(newpar);
            break;
    }
    
}

function buildcurrentlevel(){

    LEVELS[level].content.forEach(v=>{
        makegm(v.x,v.y,v.w,v.h,v.t,v.e);
    })

}



function nextlevel(amount = 1){
    GAMEOBJECTS = [];
    level += amount;
    if (level > LEVELS.length-1){
        level = 1;
    }
    levelhtml.value = LEVELS[level].name;
    
}

function savelevel(){
    const savedcontent = [];
    const savedpath = [];
    const savedlevel = {};
    GAMEOBJECTS.forEach(v=>{
        const savedgm = {}
        savedgm.x = v.x;
        savedgm.y = v.y;
        savedgm.w = v.width;
        savedgm.h = v.height;
        savedgm.t = v.type;
        savedgm.e = v.extra;
        savedcontent.push(savedgm);
    })
    LEVELS[level].lpath.forEach(v=>{
        const savedpoint = {}
        savedpoint.x = v.x;
        savedpoint.y = v.y;
        savedpath.push(savedpoint);
    })

    savedlevel.content = savedcontent;
    savedlevel.lpath = savedpath;
    savedlevel.name = prompt("Level Name");
    alert(JSON.stringify(savedlevel))

}

function loadlevel(towhere = level){
    if (towhere === LEVELS.length){LEVELS.push(new Object())}
    let loadedlevel = prompt("Enter Level Code !");
    GAMEOBJECTS = [];
    ENEMIES = [];
    TOWERS = [];
    loadedlevel = JSON.parse(loadedlevel);
    LEVELS[towhere].content = loadedlevel.content;
    LEVELS[towhere].name = loadedlevel.name;
    LEVELS[towhere].lpath = loadedlevel.lpath;
    buildcurrentlevel();
    

}

function hardreset(){
    document.getElementById("editorbuttons").style.display = "none";
    removeEventListener("mousedown", editorclicking);
    removeEventListener("mousedown", gameclicking);
    addEventListener("mousedown", gameclicking); 
    selector = {}
    GAMEOBJECTS = [];
    ENEMIES = [];
    TOWERS = [];
    BULLETS = [];
    level = 1;
    player.reset();
    levelhtml.value = LEVELS[level].name;
    buildcurrentlevel();
}

//distance

function distance(x1,x2,y1,y2){
return Math.sqrt(((x2-x1)**2)+((y2-y1)**2));
}


function randomrange(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function time(ms) {
    return new Date(ms).toISOString().slice(14, -1);
}

// toggle menus n things

function togglePause(){
    document.getElementById("settingsmenu").style.display = "none";
    if(GameSpeed === 0){
        pausemenu.style.display = "none";
        canvas.style.filter = "none"
        GameSpeed = lastGameSpeed; 


    }else{
        pausemenu.style.display = "flex";
        canvas.style.filter = "blur(10px)";

        
        GameSpeed = 0; 
    }

}

function togglestyle(){

    if(style){
        style = false
    }else{
        style = true}

}

// file gen save map

function savemap(){

    let download = document.getElementById("DownloadMap");
    download.href = createFile(JSON.stringify(LEVELS));
    download.style.display = "block";

}

function createFile(levelstxt) {
    let data = new Blob([levelstxt], {type: 'text/plain'});
    
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

// load map

function loadmap(){
    let loadedmap = document.getElementById("loadmap").files[0];
    
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        LEVELS = JSON.parse(event.target.result);
        hardreset();
    });
    reader.readAsText(loadedmap);
    
}

//clear map

function clearmap(){

LEVELS = [{name:"Edit Level",spawn:{x:150,y:100},content:[{x:100,y:150,w:100,h:40}]}]

}


// change input 

function changeinput(self){
    selector.t = self.value;
}

function toggleMenu(id){

    let keybind = document.getElementById(id);
    if(keybind.style.display==="flex"){
        keybind.style.display = "none";
    }else{
        keybind.style.display = "flex";

    }
}

addEventListener("keydown", e => {
    // console.log(e.key);
    keys[e.key] = true;
});

addEventListener("keyup", e => {
    keys[e.key] = false;
});

addEventListener("keypress",e=>{
    switch(e.key){
        case "p":
            togglePause();
            break;
    }

})

function starteditor(){
    
    level=0; 
    nextlevel(0);
    selector.t = "platform";
    document.getElementById("editorbuttons").style.display = "flex";
    document.getElementById("DownloadMap").style.display = "none";

    setTimeout(()=>{
        addEventListener("mousedown", editorclicking); 
        removeEventListener("mousedown", gameclicking);
    },100)

}

function editorclicking(e){
        
    let rect = canvas.getBoundingClientRect();
    let mouseX = Math.floor((e.clientX- rect.left) /20 )*20;
    let mouseY = Math.floor((e.clientY- rect.top) /20 )*20;
    if(mouseX>=0 && mouseX<800 && mouseY>=0&&mouseY<600){

        if (selector.t === "delete"){

            GAMEOBJECTS.forEach((v,i)=>{
            let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
            if(collision.col){
                GAMEOBJECTS.splice(i,1);
            }
            
            })

        }
        else if(selector.t === "move_to_top"){

            GAMEOBJECTS.forEach((v,i)=>{
                let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
                if(collision.col){
                    makegm(v.x,v.y,v.width,v.height,v.type,v.extra);
                    GAMEOBJECTS.splice(i,1)}
                }) 

        
        }
        else if(selector.t === "path"){
            LEVELS[level].lpath.push({x:mouseX,y:mouseY}); 

        }
        else if(selector.t === "delete_last_point"){
            LEVELS[level].lpath.pop(); 

        }
        else{
        addEventListener("mousemove", mousemove); 
        addEventListener("mouseup", mouseup); 

        selector.x1 = mouseX;
        selector.y1 = mouseY;
        selector.x = selector.x1;
        selector.y = selector.y1;
        selector.w = 20;
        selector.h = 20;

        }
    }

}  

function mousemove(e){
    let rect = canvas.getBoundingClientRect();
    let mouseX = Math.floor((e.clientX- rect.left) /20 )*20;
    let mouseY = Math.floor((e.clientY- rect.top) /20 )*20;

    selector.x2 = mouseX;
    selector.y2 = mouseY;
    if(selector.x1 < selector.x2){
        selector.x = selector.x1; selector.w = selector.x2-selector.x1;  }
    else if(selector.x1 === selector.x2){
        selector.x = selector.x1; selector.w = 20; 
    }
    else{ 
        selector.x = selector.x2; selector.w = selector.x1-selector.x2;   
    }

    if(selector.y1 < selector.y2){
        selector.y = selector.y1; selector.h = selector.y2-selector.y1;}
    else if(selector.y1 === selector.y2){
        selector.y = selector.y1; selector.h = 20; 
    }else{
        selector.y = selector.y2; selector.h = selector.y1-selector.y2;
        }
}

function mouseup(){

    makegm(selector.x,selector.y,selector.w,selector.h,selector.t,selector.e)
    let typet = selector.t;
    let extrat = selector.e;
    selector = {};
    selector.t = typet;
    selector.e = extrat;
    removeEventListener("mousemove", mousemove);
    removeEventListener("mouseup", mouseup);

}


addEventListener("mousedown", gameclicking); 

function gameclicking(e){

    let rect = canvas.getBoundingClientRect();
    let mouseX = (Math.floor((e.clientX- rect.left) /20 )*20)+10;
    let mouseY = (Math.floor((e.clientY- rect.top) /20 )*20)+10;
    if(mouseX>=0 && mouseX<800 && mouseY>=0&&mouseY<600){
    GAMEOBJECTS.forEach((v,i)=>{
        let collision = v.collision(mouseX,mouseY,mouseX,mouseY);
        if(collision.col){
            let hadcol = false;
            TOWERS.forEach(tower=>{
                if(distance(mouseX,tower.x,mouseY,tower.y) < tower.size*2){
                    hadcol = true;
                };
            })
            let stowerprice = shop.sprice[shop.stower].price;
            if(!hadcol && player.money >= stowerprice){
                maketower(mouseX,mouseY,shop.stower);
                player.changemoney(-stowerprice);
                makeparticle(mouseX,mouseY,"money",-stowerprice);
            }
            return;
        }
        
        })
    }
}
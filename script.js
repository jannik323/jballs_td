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
let mastervolume = 1;


let levelhtml = document.getElementById("levelhtml");
levelhtml.value = "Level: balling ground"
let playerhealth = document.getElementById("playerhealth");
playerhealth.value = "Health: 10";
let playermoney = document.getElementById("playermoney");
playermoney.value = "Money: 8$";
let levelwave = document.getElementById("levelwave");
levelwave.value = "Wave: 0";

let LEVELS = [
    
    {
        name:"Testing man",
        content:[
        ],
        lpath:[
        
        ]
    },

    {"content":[{"x":20,"y":140,"w":80,"h":380,"t":"platform","e":"none"},{"x":200,"y":340,"w":140,"h":140,"t":"platform","e":"none"},{"x":380,"y":140,"w":140,"h":140,"t":"platform","e":"none"},{"x":580,"y":360,"w":100,"h":100,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":90},{"x":100,"y":100},{"x":140,"y":140},{"x":150,"y":240},{"x":180,"y":500},{"x":240,"y":540},{"x":330,"y":530},{"x":370,"y":500},{"x":350,"y":140},{"x":370,"y":100},{"x":500,"y":90},{"x":540,"y":130},{"x":560,"y":490},{"x":620,"y":530},{"x":690,"y":520},{"x":720,"y":480},{"x":710,"y":330},{"x":750,"y":280},{"x":790,"y":280}],"name":"balling ground"}
    ,
    {"content":[{"x":320,"y":140,"w":280,"h":60,"t":"platform","e":"none"},{"x":160,"y":20,"w":20,"h":80,"t":"platform","e":"none"},{"x":160,"y":220,"w":20,"h":260,"t":"platform","e":"none"},{"x":680,"y":480,"w":20,"h":100,"t":"platform","e":"none"},{"x":720,"y":120,"w":20,"h":100,"t":"platform","e":"none"}],"lpath":[{"x":220,"y":0},{"x":220,"y":120},{"x":300,"y":100},{"x":440,"y":100},{"x":600,"y":100},{"x":680,"y":120},{"x":680,"y":220},{"x":600,"y":240},{"x":300,"y":240},{"x":220,"y":220},{"x":220,"y":380},{"x":220,"y":480},{"x":300,"y":460},{"x":580,"y":460},{"x":640,"y":480},{"x":640,"y":580}],"name":"ballside"}
    ,
    {"content":[{"x":280,"y":300,"w":80,"h":200,"t":"platform","e":"none"},{"x":280,"y":140,"w":80,"h":60,"t":"platform","e":"none"},{"x":40,"y":440,"w":120,"h":60,"t":"platform","e":"none"},{"x":640,"y":140,"w":80,"h":60,"t":"platform","e":"none"},{"x":460,"y":300,"w":80,"h":200,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":540},{"x":420,"y":540},{"x":420,"y":260},{"x":220,"y":260},{"x":220,"y":100},{"x":780,"y":100}],"name":"balled in"}
    ,
    {"content":[{"x":400,"y":240,"w":140,"h":180,"t":"platform","e":"none"},{"x":300,"y":240,"w":20,"h":180,"t":"platform","e":"none"},{"x":400,"y":160,"w":140,"h":20,"t":"platform","e":"none"},{"x":600,"y":240,"w":20,"h":180,"t":"platform","e":"none"},{"x":400,"y":480,"w":140,"h":20,"t":"platform","e":"none"},{"x":640,"y":520,"w":40,"h":40,"t":"platform","e":"none"},{"x":640,"y":100,"w":40,"h":40,"t":"platform","e":"none"},{"x":260,"y":100,"w":40,"h":40,"t":"platform","e":"none"},{"x":260,"y":520,"w":40,"h":40,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":480},{"x":340,"y":480},{"x":340,"y":200},{"x":580,"y":200},{"x":580,"y":460},{"x":360,"y":460},{"x":360,"y":220},{"x":560,"y":220},{"x":560,"y":440},{"x":380,"y":440},{"x":380,"y":0}],"name":"center of balls"}
    ,
    {"content":[{"x":620,"y":220,"w":140,"h":60,"t":"platform","e":"none"},{"x":220,"y":220,"w":120,"h":60,"t":"platform","e":"none"},{"x":600,"y":40,"w":20,"h":60,"t":"platform","e":"none"},{"x":220,"y":40,"w":20,"h":60,"t":"platform","e":"none"},{"x":320,"y":40,"w":20,"h":60,"t":"platform","e":"none"},{"x":380,"y":220,"w":20,"h":60,"t":"platform","e":"none"},{"x":560,"y":220,"w":20,"h":60,"t":"platform","e":"none"},{"x":100,"y":220,"w":20,"h":60,"t":"platform","e":"none"},{"x":100,"y":40,"w":20,"h":60,"t":"platform","e":"none"},{"x":660,"y":40,"w":20,"h":60,"t":"platform","e":"none"},{"x":220,"y":400,"w":20,"h":60,"t":"platform","e":"none"},{"x":380,"y":400,"w":200,"h":60,"t":"platform","e":"none"},{"x":620,"y":400,"w":20,"h":60,"t":"platform","e":"none"},{"x":740,"y":400,"w":20,"h":60,"t":"platform","e":"none"},{"x":100,"y":400,"w":80,"h":80,"t":"platform","e":"none"},{"x":40,"y":220,"w":20,"h":260,"t":"platform","e":"none"},{"x":40,"y":40,"w":20,"h":60,"t":"platform","e":"none"}],"lpath":[{"x":780,"y":200},{"x":600,"y":200},{"x":600,"y":300},{"x":360,"y":300},{"x":360,"y":200},{"x":220,"y":200},{"x":220,"y":120},{"x":640,"y":120},{"x":640,"y":20},{"x":80,"y":20},{"x":80,"y":380},{"x":200,"y":380},{"x":200,"y":480},{"x":780,"y":480}],"name":"sticks and stones may break your balls"}
    ,
    {"content":[{"x":200,"y":200,"w":60,"h":60,"t":"platform","e":"none"},{"x":380,"y":200,"w":60,"h":60,"t":"platform","e":"none"},{"x":380,"y":380,"w":60,"h":60,"t":"platform","e":"none"},{"x":200,"y":380,"w":60,"h":60,"t":"platform","e":"none"},{"x":200,"y":540,"w":60,"h":40,"t":"platform","e":"none"},{"x":380,"y":540,"w":60,"h":40,"t":"platform","e":"none"},{"x":520,"y":200,"w":40,"h":60,"t":"platform","e":"none"},{"x":600,"y":200,"w":40,"h":60,"t":"platform","e":"none"},{"x":600,"y":380,"w":40,"h":60,"t":"platform","e":"none"},{"x":520,"y":380,"w":40,"h":60,"t":"platform","e":"none"},{"x":80,"y":200,"w":40,"h":60,"t":"platform","e":"none"},{"x":80,"y":380,"w":40,"h":60,"t":"platform","e":"none"},{"x":80,"y":540,"w":40,"h":40,"t":"platform","e":"none"},{"x":520,"y":540,"w":40,"h":40,"t":"platform","e":"none"},{"x":600,"y":540,"w":40,"h":40,"t":"platform","e":"none"},{"x":600,"y":100,"w":40,"h":40,"t":"platform","e":"none"},{"x":520,"y":100,"w":40,"h":40,"t":"platform","e":"none"},{"x":380,"y":100,"w":60,"h":40,"t":"platform","e":"none"},{"x":200,"y":100,"w":60,"h":40,"t":"platform","e":"none"},{"x":80,"y":100,"w":40,"h":40,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":80},{"x":480,"y":80},{"x":480,"y":520},{"x":160,"y":520},{"x":160,"y":160},{"x":680,"y":160},{"x":680,"y":480},{"x":0,"y":480}],"name":"ballsy patterns"}
    ,
    {"content":[{"x":320,"y":80,"w":260,"h":80,"t":"platform","e":"none"},{"x":320,"y":240,"w":260,"h":40,"t":"platform","e":"none"},{"x":320,"y":340,"w":260,"h":40,"t":"platform","e":"none"},{"x":320,"y":460,"w":260,"h":80,"t":"platform","e":"none"},{"x":660,"y":80,"w":80,"h":80,"t":"platform","e":"none"},{"x":660,"y":460,"w":80,"h":80,"t":"platform","e":"none"},{"x":200,"y":240,"w":40,"h":40,"t":"platform","e":"none"},{"x":200,"y":340,"w":40,"h":40,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":40},{"x":620,"y":40},{"x":620,"y":200},{"x":280,"y":200},{"x":280,"y":420},{"x":620,"y":420},{"x":620,"y":580}],"name":"balled in balls"}
    ,

]

const TOWERTYPES = {

    tiny_ball_pincher:
        {
        color : "hsl(185, 32%, 87%)",
        size : 5,
        range : 80,
        firerate : 8,
        shotspeed : 5,
        damage : 0.01,
        },
    strong_ball_pincher:
        {
        color : "hsl(185, 52%, 78%)",
        size : 10,
        range : 80,
        firerate : 8,
        shotspeed : 5,
        damage : 0.1,
        },
    tiny_ball_buster:
        {
        color : "hsl(185, 32%, 77%)",
        size : 5,
        range : 130,
        firerate : 50,
        shotspeed : 7,
        damage : 0.2,
        },
    normal_ball_buster:
        {
        color : "hsl(194, 14%, 50%)",
        size : 10,
        range : 180,
        firerate : 60,
        shotspeed : 10,
        damage : 1,
        },
    fast_ball_buster:
        {
        color : "hsl(194, 14%, 70%)",
        size : 15,
        range : 190,
        firerate : 55,
        shotspeed : 11,
        damage : 1,
        },
    normal_ball_crusher:
        {
        color : "hsl(194, 14%, 30%)",
        size : 10,
        range : 100,
        firerate : 100,
        shotspeed : 11,
        damage : 2,
        },
    trained_ball_crusher:
        {
        color : "hsl(194, 14%, 20%)",
        size : 15,
        range : 80,
        firerate : 110,
        shotspeed : 8,
        damage : 5,
        },
    pro_ball_crusher:
        {
        color : "hsl(194, 14%, 10%)",
        size : 20,
        range : 70,
        firerate : 150,
        shotspeed : 9,
        damage : 10,
        },
    normal_ball_smasher:
        {
        color : "hsl(0, 20%, 47%)",
        size : 25,
        range : 200,
        firerate : 8,
        shotspeed : 3,
        damage : 0.5,
        },
    holy_ball_smasher:
        {
        color : "hsl(0, 20%, 37%)",
        size : 30,
        range : 250,
        firerate : 4,
        shotspeed : 5,
        damage : 0.5,
        },
    normal_ball_refiner:
        {
        color : "hsl(60, 62%, 69%)",
        size : 10,
        range : 60,
        firerate : 100,
        shotspeed : 6,
        damage : 0.1,
        moneymulti: 2,
        },
    trained_ball_refiner:
        {
        color : "hsl(60, 62%, 49%)",
        size : 15,
        range : 70,
        firerate : 110,
        shotspeed : 7,
        damage : 0.2,
        moneymulti: 3,
        },
    normal_ball_sniper:
        {
        color : "hsl(1, 52%, 28%)",
        size : 15,
        range : 300,
        firerate : 300,
        shotspeed : 22,
        damage : 8,
        homing:PI/100,
        },
    trained_ball_sniper:
        {
        color : "hsl(1, 52%, 20%)",
        size : 20,
        range : 450,
        firerate : 330,
        shotspeed : 25,
        damage : 18,
        homing:PI/80,
        },
    weak_ball_searcher:
        {
        color : "hsl(245, 35%, 70%)",
        size : 10,
        range : 200,
        firerate : 180,
        shotspeed : 3,
        damage : 1,
        homing:PI/100,
        },
    normal_ball_searcher:
        {
        color : "hsl(245, 35%, 50%)",
        size : 15,
        range : 250,
        firerate : 200,
        shotspeed : 3,
        damage : 2,
        homing:PI/80,
        },
    pro_ball_searcher:
        {
        color : "hsl(245, 35%, 30%)",
        size : 20,
        range : 260,
        firerate : 200,
        shotspeed : 4,
        damage : 6,
        homing:PI/40,
        },
    normal_ball_freezer:
    {
        color : "hsl(181, 35%, 75%)",
        size : 10,
        range : 130,
        firerate : 100,
        shotspeed : 10,
        damage : 1,
        freeze:1.5,
        },
    fast_ball_freezer:
    {
        color : "hsl(181, 35%, 85%)",
        size : 15,
        range : 130,
        firerate : 80,
        shotspeed : 11,
        damage : 1,
        freeze:2,
        },
    normal_ball_spiker:
    {
        color : "hsl(102, 35%, 57%)",
        size : 10,
        range : 130,
        firerate : 150,
        shotspeed : 10,
        damage : 0.5,
        spike:0.1,
        },
    trained_ball_spiker:
    {
        color : "hsl(102, 35%, 37%)",
        size : 15,
        range : 110,
        firerate : 180,
        shotspeed : 11,
        damage : 1,
        spike:0.4,
        },

}

const ENEMYTYPES = {

    normal_1:{
        size : 10,
        speed : 1,
        health : 3,
        reward : 0.1,
        color : "hsl(211, 36%, 50%)",
        },
    slow_1:{
        size : 11,
        speed : 0.5,
        health : 4,
        reward : 0.1,
        color : "hsl(211, 36%, 30%)",
        },
    fast_1:{
        size : 9,
        speed : 1.5,
        health : 2,
        reward : 0.1,
        color : "hsl(211, 36%, 70%)",
        },
    normal_2:{
        size : 11,
        speed : 1.1,
        health : 8,
        reward : 0.2,
        color : "hsl(0, 36%, 50%)",
        },
    slow_2:{
        size : 13,
        speed : 0.6,
        health : 9,
        reward : 0.2,
        color : "hsl(0, 36%, 30%)",
        },
    fast_2:{
        size : 9,
        speed : 1.6,
        health : 7,
        reward : 0.2,
        color : "hsl(0, 36%, 70%)",
        },
    normal_3:{
        size : 12,
        speed : 1.1,
        health : 12,
        reward : 0.3,
        color : "hsl(124, 36%, 50%)",
        },
    slow_3:{
        size : 15,
        speed : 0.6,
        health : 14,
        reward : 0.3,
        color : "hsl(124, 36%, 30%)",
        },
    fast_3:{
        size : 10,
        speed : 1.6,
        health : 10,
        reward : 0.3,
        color : "hsl(124, 36%, 70%)",
        },
    normal_4:{
        size : 15,
        speed : 1.1,
        health : 20,
        reward : 0.3,
        color : "hsl(294, 36%, 50%)",
        },
    slow_4:{
        size : 17,
        speed : 0.6,
        health : 30,
        reward : 0.3,
        color : "hsl(294, 36%, 30%)",
        },
    fast_4:{
        size : 12,
        speed : 1.6,
        health : 15,
        reward : 0.3,
        color : "hsl(294, 36%, 70%)",
        },
    boss_1:{
        size : 28,
        speed : 0.4,
        health : 300,
        reward : 20,
        color : "hsl(308, 24%, 23%)",
        permshowhealth : true,
        },
    normal_5:{
        size : 18,
        speed : 1.2,
        health : 25,
        reward : 0.4,
        color : "hsl(63, 35%, 50%)",
        },
    slow_5:{
        size : 20,
        speed : 0.5,
        health : 50,
        reward : 0.4,
        color : "hsl(63, 35%, 30%)",
        },
    fast_5:{
        size : 13,
        speed : 2,
        health : 15,
        reward : 0.4,
        color : "hsl(63, 35%, 70%)",
        },
    superfast_1:{
        size : 10,
        speed : 2.5,
        health : 14,
        reward : 0.3,
        color : "hsl(63, 35%, 80%)",
        },
    boss_2:{
        size : 35,
        speed : 0.4,
        health : 800,
        reward : 40,
        color : "hsl(28, 62%, 58%)",
        permshowhealth : true,
        },

}


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

        
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.fillRect(this.x,this.y,this.width,this.height);

        
        
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

        
        let col = (colright || colleft) && (coltop || colbottom);


        return {col,coltop,colbottom,colright,colleft};
    }

    incollision(x1,y1,x2,y2){
        let colleft = (x1 >= this.x && x1 <= this.x+this.width);
        let colright =  (x2 >= this.x && x2 <= this.x+this.width);

        let coltop = (y1 >= this.y && y1 <= this.y+this.height);
        let colbottom = (y2 >= this.y && y2 <= this.y+this.height);
        
        let col = (colright&&colleft&&coltop&&colbottom)
        return col;
    }

    setcolors(){
        if(this.type === "platform"){
            this.strokecolor = "black"
            this.fillcolor = "#e8e4dd";
            this.shadowcolor = "black";
            this.opac = 1;
        
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
        this.x = -100;
        this.y = 0;
        this.pathprog = 0;
        this.type = type
        this.showhealth = false;
        this.showinfo = false;
        this.moneymulti = 1;
        this.freeze = 1;
        this.spike = 0;
        this.spikestep  = 0;
        this.settypes();
        this.multiedreward = this.moneymulti*this.reward;
        this.totalspeed = this.speed/this.freeze;
    }

    update(i){

        let levelx = LEVELS[level].lpath[this.pathprog].x;
        let levely = LEVELS[level].lpath[this.pathprog].y;

        if(this.health <= 0){
            makeparticle(this.x,this.y,"explosion");
            player.changemoney(this.multiedreward);
            makeparticle(this.x,this.y,"money",this.multiedreward);
            ENEMIES.splice(i,1);
            playSound("explosion",{ volume: mastervolume });

        }

        if(this.spike > 0){
            this.spikestep += 1;
            if(this.spikestep > 100){
                this.spikestep = 0;
                this.spike *= 100;
                this.spike = Math.round(this.spike);
                this.spike /= 100;
                this.health -= this.spike;
                makeparticle(this.x,this.y,"dmg",this.spike);
            }
        }

        if(this.pathprog === 0){
            this.x = LEVELS[level].lpath[0].x;
            this.y = LEVELS[level].lpath[0].y;
            this.pathprog ++;
        }else{

            
            let distancep = distance(LEVELS[level].lpath[this.pathprog-1].x,levelx,LEVELS[level].lpath[this.pathprog-1].y,levely);
            let newspeed_x = Math.abs(LEVELS[level].lpath[this.pathprog-1].x-levelx)/distancep*this.totalspeed ;
            let newspeed_y = Math.abs(LEVELS[level].lpath[this.pathprog-1].y-levely)/distancep*this.totalspeed;

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
                    playSound("healthdown",{ volume: mastervolume });
                }
            }

        }
    }

    render(){
        ctx.beginPath();
        ctx.shadowBlur = this.size;
        ctx.fillStyle = this.color;
        ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
        ctx.fill();
        ctx.shadowBlur = 0;

        if(this.showhealth){
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.moveTo(this.x-this.size,this.y-(this.size*2));
            ctx.lineTo(this.x-this.size+((this.health/this.orighealth)*this.size*2),this.y-(this.size*2));
            ctx.stroke();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
        }

        if(this.showinfo){

            ctx.strokeStyle = "black";
            ctx.globalAlpha = 1;
            ctx.font = "15px Monospace",
            ctx.strokeText(this.type,this.x+this.size*2,this.y);
            ctx.strokeText("reward: "+this.multiedreward,this.x+this.size*2,this.y+20);
            ctx.strokeText("health: "+this.orighealth,this.x+this.size*2,this.y+40);
            ctx.strokeText("speed: "+this.totalspeed,this.x+this.size*2,this.y+60)

        }
    }

    settypes(){
        this.size = ENEMYTYPES[this.type].size;
        
        this.speed = ENEMYTYPES[this.type].speed;
        this.health = ENEMYTYPES[this.type].health;
        this.reward = ENEMYTYPES[this.type].reward;
        this.color = ENEMYTYPES[this.type].color;
        this.permshowhealth = ENEMYTYPES[this.type].permshowhealth;

        this.orighealth  =this.health;
        if(this.permshowhealth){this.showhealth = true;}
        if(this.permshowhealth === undefined){this.permshowhealth = false;}

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
    this.showinfo = false;
    this.g_offset = 2;
    this.g_offset_a = 0;

}

update(i){
    this.wstep += 1+Math.random();
    let bestdistance = Infinity;
    let bestenemy = null;
    ENEMIES.forEach((v,i)=>{
        let enemydistance = distance(v.x,this.x,v.y,this.y)
        if(enemydistance< bestdistance && enemydistance < this.range){bestdistance = enemydistance; bestenemy = i;}
    })    
    if(bestenemy != null){
        this.dir = (Math.atan2((this.y-ENEMIES[bestenemy].y),(this.x-ENEMIES[bestenemy].x)))+PI;
        if(this.wstep > this.firerate){
            makebullet(this.x,this.y,this.dir,this.shotspeed,this.damage,this);
            playSound("shoot",{ volume: mastervolume });
            this.wstep = 0;
            if(this.g_offset <= 2){
                this.g_offset_a -= this.size-(this.size/1.5)
            }
        }
            
    }   

    this.g_offset -= this.g_offset_a;
    if(this.g_offset > 2){
        this.g_offset_a += this.size/80;
        this.g_offset_a *= 0.85;
    }else{
        this.g_offset = 2
    }

}

render(part = "tower"){

    


    if(part === "canon"){
        ctx.beginPath();
        ctx.lineWidth = this.size/2;
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur = this.size;
        ctx.strokeStyle =  "black";
        ctx.moveTo(this.x +(Math.cos(this.dir)*(0+(this.size/this.g_offset))), this.y + (Math.sin(this.dir)*(0+(this.size/this.g_offset))) );
        ctx.lineTo(this.x +(Math.cos(this.dir)*(this.size+(this.size/this.g_offset))), this.y + (Math.sin(this.dir)*(this.size+(this.size/this.g_offset))) );
        ctx.stroke(); 
        ctx.strokeStyle =  "black";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }else if(part === "tower") {

        ctx.beginPath();
        ctx.shadowBlur = this.size;
        ctx.fillStyle = this.color;
        ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
        ctx.fill();
        ctx.shadowBlur = 0;

    }else if(part === "text" && this.showinfo){

        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.strokeStyle = "grey";
        ctx.arc(this.x-this.range/100,this.y-this.range/100, this.range, 0,PI*2)
        ctx.stroke();
        ctx.strokeStyle = "black";
        ctx.globalAlpha = 1;
        ctx.font = "15px Monospace",
        ctx.strokeText(this.type,this.x+this.size*2,this.y+0);
        ctx.strokeText("damage: "+this.damage,this.x+this.size*2,this.y+20);
        ctx.strokeText("firerate: "+this.firerate,this.x+this.size*2,this.y+40);
        ctx.strokeText("shotspeed: "+this.shotspeed,this.x+this.size*2,this.y+60);
      
    }
    

    

}

settype(){


    this.color = TOWERTYPES[this.type].color;
    this.size = TOWERTYPES[this.type].size;
    this.range = TOWERTYPES[this.type].range;
    this.firerate = TOWERTYPES[this.type].firerate;
    this.shotspeed = TOWERTYPES[this.type].shotspeed;
    this.damage = TOWERTYPES[this.type].damage;
    this.homing = TOWERTYPES[this.type].homing;
    this.moneymulti = TOWERTYPES[this.type].moneymulti;
    this.freeze = TOWERTYPES[this.type].freeze;
    this.spike = TOWERTYPES[this.type].spike;


}


}

class bullet{

    constructor(x,y,dir,speed,damage,parent){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = speed;
        this.damage = damage;
        this.color = "#bf715b";
        this.parent = parent;
        this.size = parent.size/4;
        this.x += Math.cos(this.dir)*parent.size;
        this.y += Math.sin(this.dir)*parent.size;
        

    }

    update(i){

        this.x += Math.cos(this.dir)*this.speed;
        this.y += Math.sin(this.dir)*this.speed;

        if(this.parent.homing !== undefined){
            let bestdistance = Infinity;
            let bestenemy = null;
            ENEMIES.forEach((v,i)=>{
            let enemydistance = distance(v.x,this.x,v.y,this.y)
            if(enemydistance< bestdistance && enemydistance < 100){bestdistance = enemydistance; bestenemy = i;}
            })  

            if(bestenemy !== null){
                let enemydir = (Math.atan2((this.y-ENEMIES[bestenemy].y),(this.x-ENEMIES[bestenemy].x)))+PI;
                if(this.dir > enemydir){
                    this.dir -= this.parent.homing;
                }else{
                    this.dir += this.parent.homing;
                }
            }
        }


        
        if( this.x > canvas.width-this.size || this.x < 0 ||  this.y > canvas.height-this.size || this.y < 0){
            BULLETS.splice(i,1);
        }

        

        ENEMIES.forEach(v=>{
            if(distance(v.x,this.x,v.y,this.y) < this.size+v.size){
                v.health -= this.damage;
                makeparticle(this.x,this.y,"dmg",this.damage);
                BULLETS.splice(i,1);
                if (this.parent.moneymulti !== undefined){
                    v.moneymulti = this.parent.moneymulti;
                    v.multiedreward = v.moneymulti*v.reward;
                }
                if (this.parent.freeze !== undefined){
                    v.freeze = this.parent.freeze;
                    v.totalspeed = v.speed/v.freeze;
                }
                if (this.parent.spike !== undefined){
                    v.spike += this.parent.spike;
                }

            }


        })
    }

    render(){

        ctx.beginPath();
        ctx.shadowBlur = this.size;
        ctx.fillStyle = this.color;
        ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
        ctx.fill();
        ctx.shadowBlur = 0;

    }

}

const spawnhandler = {

    active:true,

    piece:0,
    step:0,
    spawnrate:150,

    wave:0,
    wavestep:0,
    waverate:3,

    update: function(){
        if(spawnhandler.active){
            spawnhandler.step++;
            if(spawnhandler.step > spawnhandler.spawnrate){
                spawnhandler.step = 0;
                makeenemy(spawnhandler.waves[spawnhandler.wave].pieces[spawnhandler.piece]);
                spawnhandler.piece ++;
                if(spawnhandler.piece > spawnhandler.waves[spawnhandler.wave].pieces.length-1 ){spawnhandler.piece = 0;spawnhandler.wavestep++; }
            }
    
            if(spawnhandler.wavestep >= spawnhandler.waverate){
                spawnhandler.wave ++;
                spawnhandler.step = -800;
                spawnhandler.wavestep = 0;
                if(spawnhandler.wave > spawnhandler.waves.length-1){spawnhandler.wave = 0}
                levelwave.value = "Wave: " + spawnhandler.wave;
                spawnhandler.setvaltowave();
            }
        }
    },

    setvaltowave: function(){
        spawnhandler.spawnrate = spawnhandler.waves[spawnhandler.wave].wave_spawnrate;
        spawnhandler.waverate = spawnhandler.waves[spawnhandler.wave].wave_waverate;
    },

    reset:function(){
        spawnhandler.piece=0;
        spawnhandler.step=0;
        spawnhandler.spawnrate=150;
        spawnhandler.wave=0;
        spawnhandler.wavestep=0;
        spawnhandler.waverate=3;
        levelwave.value = "Wave: " + spawnhandler.wave;
        spawnhandler.setvaltowave();
    },
    
    waves:
    [
        {
            wave_spawnrate: 130,
            wave_waverate:3,    
            pieces:[
                "normal_1",
                "normal_1",
                "normal_1",
                "slow_1",
            ]
        },
        
        {
            wave_spawnrate: 100,
            wave_waverate:4,    
            pieces:[
                "slow_1",
                "slow_1",
                "slow_2",
                "normal_1",
                "normal_1",
            ]
        },

        {
            wave_spawnrate: 70,
            wave_waverate:3,    
            pieces:[
                "slow_2",
                "normal_2",
                "fast_1",
            ]
        },

        {
            wave_spawnrate: 50,
            wave_waverate:3,    
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
            wave_spawnrate: 40,
            wave_waverate:4,    
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

        {
            wave_spawnrate: 50,
            wave_waverate:3,    
            pieces:[
                "slow_2",
                "slow_3",
                "slow_3",
                "normal_3",
                "normal_3",
                "fast_3",
                "fast_3",
                "fast_3",
                "fast_3",
                "fast_3",

            ]
        },

        {
            wave_spawnrate: 25,
            wave_waverate:3,    
            pieces:[
                "slow_3",
                "slow_3",
                "slow_4",
                "slow_4",
                "normal_1",
                "normal_1",

            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:4,    
            pieces:[
                "normal_4",
                "normal_4",
                "normal_4",
                "normal_4",
                "fast_4",
                "fast_4",

            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:1,    
            pieces:[
                "normal_4",
                "normal_4",
                "normal_4",
                "normal_4",
                "slow_3",
                "slow_3",
                "slow_4",
                "slow_4",
                "boss_1",
                

            ]
        },

        {
            wave_spawnrate: 80,
            wave_waverate:4,    
            pieces:[
                "normal_4",
                "normal_4",
                "normal_4",
                "normal_4",
                "fast_4",
                "slow_4",
                "slow_3",
                "slow_4",
                "slow_4",
                

            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:5,    
            pieces:[
                "normal_4",
                "normal_5",
                "normal_5",
                "normal_4",
                "fast_4",
                "slow_4",
                "slow_3",
                "slow_3",
                "slow_3",
                

            ]
        },

        {
            wave_spawnrate: 140,
            wave_waverate:5,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "fast_5",
                "fast_5",
                "normal_5",
                "normal_5",
                "slow_5",
                "slow_5",
            ]
        },

        {
            wave_spawnrate: 20,
            wave_waverate:10,    
            pieces:[
                "normal_2",
                "normal_2",
                "normal_2",
                "normal_2",
                "normal_2",
                "fast_2",
            ]
        },

        {
            wave_spawnrate: 140,
            wave_waverate:5,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "fast_5",
                "fast_5",
                "normal_5",
                "normal_5",
                "slow_5",
                "slow_5",
            ]
        },

        {
            wave_spawnrate: 130,
            wave_waverate:2,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "normal_5",
                "normal_5",
                "slow_5",
                "superfast_1",
            ]
        },

        {
            wave_spawnrate: 90,
            wave_waverate:1,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_4",
                "fast_5",
                "fast_5",
                "fast_4",
                "normal_5",
                "normal_5",
                "slow_5",
                "slow_5",
                "slow_5",
                "slow_5",
                "boss_2",
            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:200,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "normal_5",
                "normal_5",
                "slow_5",
                "superfast_1",
                "superfast_1",
            ]
        },

    ],


}
spawnhandler.reset();

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
    mouseX:0,
    mouseY:0,
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
    playermoney.value = "Money: "+player.money.toFixed(2)+"$";
    },
    reset:function(){
    player.health=10;
    playerhealth.value = "Health: "+player.health;
    player.money=8;
    playermoney.value = "Money: "+8.0+"$";
    player.moneystep=0;

    },


}

const previewturret = {

    x:0,
    y:0,
    type:"norrmal_ball_buster",
    active:false,
    color:"grey",
    size:10,
    range:100,
    update:function(){
        if(previewturret.active){
        previewturret.x = player.mouseX;
        previewturret.y = player.mouseY;
        }

    },
    render:function(){
        if(previewturret.active){
            ctx.beginPath();
    
            ctx.shadowBlur = this.size;
            ctx.fillStyle = this.color;
            ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
            ctx.fill();
            ctx.shadowBlur = 0;
    
            ctx.beginPath();
            ctx.lineWidth = this.size/2;
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle =  "black";
            ctx.moveTo(this.x +(this.size/2), this.y);
            ctx.lineTo(this.x +(this.size+(this.size/2)), this.y);
            ctx.stroke();
            ctx.strokeStyle =  "black";
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;

            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.strokeStyle = "grey";
            ctx.arc(this.x-this.range/100,this.y-this.range/100, this.range, 0,PI*2)
            ctx.stroke();
            ctx.strokeStyle = "black";
            ctx.globalAlpha = 1;
        }
    },
    settype(newtype = null){
        if(newtype !== null){previewturret.type = newtype}
        previewturret.color = TOWERTYPES[this.type].color;
        previewturret.size = TOWERTYPES[this.type].size;
        previewturret.range = TOWERTYPES[this.type].range;
    }


} 

const shop = {

    stower:"normal_ball_buster",
    inputtype:"place",
    sprice:
    {
        tiny_ball_buster:{name:"Tiny Ball Buster",price:3},
        normal_ball_buster:{name:"Normal Ball Buster",price:8},
        fast_ball_buster:{name:"Fast Ball Buster",price:16},
        tiny_ball_pincher:{name:"Tiny Ball Pincher",price:1},
        strong_ball_pincher:{name:"Strong Ball Pincher",price:10},
        normal_ball_freezer:{name:"Normal Ball Freezer",price:14},
        fast_ball_freezer:{name:"Fast Ball Freezer",price:25},
        normal_ball_refiner:{name:"Normal Ball Refiner",price:20},
        trained_ball_refiner:{name:"Trained Ball Refiner",price:30},
        normal_ball_crusher:{name:"Normal Ball Crusher",price:20},
        trained_ball_crusher:{name:"Trained Ball Crusher",price:30},
        normal_ball_spiker:{name:"Normal Ball Spiker",price:20},
        trained_ball_spiker:{name:"Trained Ball Spiker",price:35},
        pro_ball_crusher:{name:"Pro Ball Crusher",price:40},
        normal_ball_sniper:{name:"Normal Ball Sniper",price:40},
        trained_ball_sniper:{name:"Trained Ball Sniper",price:70},
        weak_ball_searcher:{name:"Weak Ball Searcher",price:15},
        normal_ball_searcher:{name:"Normal Ball Searcher",price:20},
        pro_ball_searcher:{name:"Pro Ball Searcher",price:30},
        normal_ball_smasher:{name:"Normal Ball Smasher",price:69},
        holy_ball_smasher:{name:"Holy Ball Smasher",price:201},

    },
    select:function(selected){
        shop.stower = selected.value;
        shop.inputchange("place",selected);
    },
    inputchange:function(type,selection=type){
        shop.inputtype = type;
        if(type === "place"){
            document.getElementById("selectedtowerdisplay").innerHTML = shop.sprice[selection.value].name;
            previewturret.active = true;
            previewturret.settype(selection.value);
        }else{
            document.getElementById("selectedtowerdisplay").innerHTML = selection;
            previewturret.active = false;
        }

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
            towerbtn.addEventListener("click", ()=>{playSound(`menu`,{ volume: mastervolume }); shop.select(towerbtn)});
            towerselect.appendChild(towerbtn);  

        }

    },
    reset:function(){
        shop.stower="normal_ball_buster";
        shop.inputtype="place";

    },
    deselect:function(){
        previewturret.active= false;
        shop.inputtype = "none";
        document.getElementById("selectedtowerdisplay").innerHTML = "";
    },





}
shop.populateshop();
shop.select({value:shop.stower})



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
previewturret.update();
player.update();

if(keys["Escape"]){
    selector.w = 0;
    selector.h = 0;
    removeEventListener("mousemove", mousemove);
    removeEventListener("mouseup", mouseup);
    shop.deselect();
}

}

function render(){

ctx.clearRect(0,0,canvas.width,canvas.height)
if(LEVELS[level].lpath.length > 0){
drawpath();
}
GAMEOBJECTS.forEach(v=>{v.render();})
TOWERS.forEach(v=>{v.render("tower");})
TOWERS.forEach(v=>{v.render("canon");})
TOWERS.forEach(v=>{v.render("text");})
BULLETS.forEach(v=>{v.render();})
PARTICLES.forEach(v=>{v.render();})
ENEMIES.forEach(v=>{v.render();})
previewturret.render();



ctx.strokeRect(selector.x,selector.y,selector.w,selector.h);
}

// draw path

function drawpath(){

ctx.setLineDash([5,5]);
let lpath = LEVELS[level].lpath;
ctx.beginPath();
ctx.moveTo(lpath[0].x,lpath[0].y);
lpath.forEach(v=>{
ctx.lineTo(v.x,v.y)
})
ctx.stroke();
ctx.setLineDash([]);


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

function makebullet(x,y,dir,speed,damage,parent){
    const newbullet = new bullet(x,y,dir,speed,damage,parent)
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
    ENEMIES = [];
    TOWERS = [];
    BULLETS = [];
    PARTICLES = [];
    player.reset();
    shop.reset();
    spawnhandler.reset();
    level += amount;
    if (level > LEVELS.length-1){
        level = 1;
    }
    levelhtml.value = "Level: "+LEVELS[level].name;
    buildcurrentlevel();
    
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
    removeEventListener("mousemove", gamemousemove);
    addEventListener("mousemove", gamemousemove); 
    spawnhandler.active = true;
    selector = {}
    GAMEOBJECTS = [];
    ENEMIES = [];
    TOWERS = [];
    BULLETS = [];
    PARTICLES = [];
    level = 1;
    player.reset();
    shop.reset();
    spawnhandler.reset();
    levelhtml.value = "Level: "+LEVELS[level].name;
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
    let all_e = document.getElementById("all_e");
    if(GameSpeed === 0){
        pausemenu.style.display = "none";
        all_e.style.filter = "none"
        GameSpeed = lastGameSpeed; 


    }else{
        pausemenu.style.display = "flex";
        all_e.style.filter = "blur(5px)";

        
        GameSpeed = 0; 
    }

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
    spawnhandler.active = false;
    selector.t = "platform";
    document.getElementById("editorbuttons").style.display = "flex";
    document.getElementById("DownloadMap").style.display = "none";
    

    setTimeout(()=>{
        addEventListener("mousedown", editorclicking); 
        removeEventListener("mousedown", gameclicking);
        removeEventListener("mousemove", gamemousemove);

    },100)

}

function editorclicking(e){
        
    let rect = canvas.getBoundingClientRect();
    let mouseX = Math.floor((e.clientX- rect.left) /20 )*20;
    let mouseY = Math.floor((e.clientY- rect.top) /20 )*20;
    if(mouseX>=0 && mouseX<800 && mouseY>=0&&mouseY<600){

        if (selector.t === "delete"){

            GAMEOBJECTS.forEach((v,i)=>{
            let collision = v.collision(mouseX,mouseY,mouseX+1,mouseY+1);
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
addEventListener("mousemove", gamemousemove); 

function gameclicking(e){
    if(GameSpeed === 0){return}

    

    if(player.mouseX>=0 && player.mouseX<800 && player.mouseY>=0&&player.mouseY<600){
    if(shop.inputtype !== "none"){
        
    let anycol = false;
    GAMEOBJECTS.forEach(v=>{
        let collision = v.incollision(player.mouseX-(TOWERTYPES[shop.stower].size),player.mouseY-(TOWERTYPES[shop.stower].size),player.mouseX+(TOWERTYPES[shop.stower].size),player.mouseY+(TOWERTYPES[shop.stower].size));
        if(collision){
            anycol = true;
            switch(shop.inputtype){

                case "place":
                    let hadcol = false;
                    TOWERS.forEach(tower=>{
                        if(distance(player.mouseX,tower.x,player.mouseY,tower.y) < tower.size+TOWERTYPES[shop.stower].size){
                            hadcol = true;
                        };
                    })
                    let stowerprice = shop.sprice[shop.stower].price;
                    if(!hadcol && player.money >= stowerprice){
                        maketower(player.mouseX,player.mouseY,shop.stower);
                        player.changemoney(-stowerprice);
                        makeparticle(player.mouseX,player.mouseY,"money",-stowerprice);
                        playSound("place",{ volume: mastervolume });
                    }
                break;


                case "delete":
                    TOWERS.forEach((tower,ie)=>{
                        if(distance(player.mouseX,tower.x,player.mouseY,tower.y) < tower.size){
                            player.changemoney((shop.sprice[tower.type].price)/2);
                            makeparticle(player.mouseX,player.mouseY,"money",(shop.sprice[tower.type].price)/2)
                            TOWERS.splice(ie,1);
                            playSound("delete",{ volume: mastervolume });
                        };
                    })
                break;




            }

        }

    
        })



    if(!anycol && shop.inputtype !== "info"){
        shop.deselect()
        playSound("cancel",{ volume: mastervolume });
    }

    if(shop.inputtype === "info"){
        TOWERS.forEach(tower=>{
            tower.showinfo = false;
            if(distance(player.mouseX,tower.x,player.mouseY,tower.y) < tower.size){tower.showinfo = true};
        })
        ENEMIES.forEach(enemy=>{
            if(!enemy.permshowhealth){
                enemy.showhealth = false;
            }
            enemy.showinfo = false;
            if(distance(player.mouseX,enemy.x,player.mouseY,enemy.y) < enemy.size){enemy.showhealth = true; enemy.showinfo = true;};
        })
    }

    }
    }else{
        if(shop.inputtype === "info"){
            TOWERS.forEach(tower=>{tower.showinfo = false})
            ENEMIES.forEach(enemy=>{if(!enemy.permshowhealth){enemy.showhealth = false};enemy.showinfo = false;})
        }
        shop.deselect();
    }

    

    
}

function gamemousemove(e){
    if(GameSpeed === 0){return}

    let towertypesize = TOWERTYPES[shop.stower].size*2;
    let rect = canvas.getBoundingClientRect();
    if(shop.inputtype === "place"){
        player.mouseX = (Math.floor((e.clientX- rect.left) /10 )*10)+towertypesize/2;
        player.mouseY = (Math.floor((e.clientY- rect.top) /10 )*10)+towertypesize/2;
    }else{
        player.mouseX = (Math.floor((e.clientX- rect.left) /10 )*10)+5;
        player.mouseY = (Math.floor((e.clientY- rect.top) /10 )*10)+5;
    }
    

}

var sounds = {
    "shoot" : {
      url : "sound/shoot.wav",
      volume : .6
    },
    "place" : {
        url : "sound/place.wav"
      },
    "delete" : {
    url : "sound/delete.wav"
    },
    "menu" : {
    url : "sound/menu.wav",
    volume : .2
    },
    "explosion" : {
    url : "sound/explosion.wav",
    volume : .4
    },
    "cancel" : {
    url : "sound/cancel.wav",
    volume : .2
    },
    "healthdown" : {
    url : "sound/healthdown.wav",
    volume : .4
    },
  };
  
  
  var soundContext = new AudioContext();
  
  for(var key in sounds) {
    loadSound(key);
  }
  
  function loadSound(name){
    var sound = sounds[name];
  
    var url = sound.url;
    var buffer = sound.buffer;
  
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      soundContext.decodeAudioData(request.response, function(newBuffer) {
        sound.buffer = newBuffer;
      });
    }
  
    request.send();
  }
  
  function playSound(name, options){
    var sound = sounds[name];
    var soundVolume = sounds[name].volume || 1;
  
    var buffer = sound.buffer;
    if(buffer){
      var source = soundContext.createBufferSource();
      source.buffer = buffer;
  
      var volume = soundContext.createGain();
  
      if(options) {
        if(options.volume) {
          volume.gain.value = soundVolume * options.volume;
        }
      } else {
        volume.gain.value = soundVolume;
      }
  
      volume.connect(soundContext.destination);
      source.connect(volume);
      source.start(0);
    }
  }
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
playerhealth.value = "Health: 20";
let playermoney = document.getElementById("playermoney");
playermoney.value = "Money: 8$";
let levelwave = document.getElementById("levelwave");
levelwave.value = "Wave: 0";

let sounds = {
    "shoot" : {
      url : "sound/shoot.wav",
      volume : .3
    },
    "place" : {
        url : "sound/place.wav",
        volume : .6
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
  

let soundContext = new AudioContext();

for(let key in sounds) {
loadSound(key);
}

function loadSound(name){
    let sound = sounds[name];

    let url = sound.url;
    let buffer = sound.buffer;

    let request = new XMLHttpRequest();
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
    let sound = sounds[name];
    let soundVolume = sounds[name].volume || 1;

    let buffer = sound.buffer;
    if(buffer){
        let source = soundContext.createBufferSource();
        source.buffer = buffer;

        let volume = soundContext.createGain();

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

let LEVELS = [
    
    {
        name:"Testing man",
        content:[
        ],
        lpath:[
        
        ]
    },

    {"content":[{"x":20,"y":200,"w":80,"h":100,"t":"platform_level_1","e":"none"},{"x":260,"y":320,"w":40,"h":180,"t":"platform_level_1","e":"none"},{"x":200,"y":340,"w":60,"h":140,"t":"platform_level_2","e":"none"},{"x":300,"y":340,"w":40,"h":140,"t":"platform_level_2","e":"none"},{"x":580,"y":360,"w":100,"h":100,"t":"platform_level_3","e":"none"},{"x":200,"y":0,"w":60,"h":120,"t":"lava","e":"none"},{"x":440,"y":460,"w":60,"h":140,"t":"lava","e":"none"},{"x":640,"y":0,"w":60,"h":140,"t":"lava","e":"none"},{"x":40,"y":380,"w":80,"h":80,"t":"platform_level_1","e":"none"},{"x":20,"y":460,"w":80,"h":40,"t":"platform_level_2","e":"none"},{"x":20,"y":300,"w":80,"h":80,"t":"platform_level_2","e":"none"},{"x":40,"y":140,"w":80,"h":60,"t":"platform_level_2","e":"none"},{"x":400,"y":200,"w":100,"h":60,"t":"platform_level_1","e":"none"},{"x":380,"y":140,"w":140,"h":60,"t":"platform_level_2","e":"none"}],"lpath":[{"x":0,"y":90},{"x":100,"y":100},{"x":140,"y":140},{"x":150,"y":240},{"x":180,"y":500},{"x":240,"y":540},{"x":330,"y":530},{"x":370,"y":500},{"x":350,"y":140},{"x":370,"y":100},{"x":500,"y":90},{"x":540,"y":130},{"x":560,"y":490},{"x":620,"y":530},{"x":690,"y":520},{"x":720,"y":480},{"x":710,"y":330},{"x":750,"y":280},{"x":790,"y":280}],"name":"balling ground"}
    ,
    {"content":[{"x":160,"y":240,"w":20,"h":220,"t":"platform_level_1","e":"none"},{"x":680,"y":500,"w":20,"h":80,"t":"platform_level_1","e":"none"},{"x":720,"y":140,"w":20,"h":60,"t":"platform_level_1","e":"none"},{"x":480,"y":140,"w":120,"h":60,"t":"platform_level_1","e":"none"},{"x":160,"y":20,"w":20,"h":80,"t":"platform_level_1","e":"none"},{"x":360,"y":340,"w":60,"h":40,"t":"platform_level_1","e":"none"},{"x":320,"y":280,"w":140,"h":60,"t":"platform_level_2","e":"none"},{"x":300,"y":160,"w":120,"h":40,"t":"platform_level_1","e":"none"},{"x":420,"y":140,"w":60,"h":60,"t":"platform_level_2","e":"none"},{"x":600,"y":140,"w":40,"h":40,"t":"platform_level_2","e":"none"},{"x":460,"y":280,"w":60,"h":40,"t":"platform_level_3","e":"none"},{"x":520,"y":360,"w":280,"h":40,"t":"lava","e":"none"},{"x":100,"y":160,"w":140,"h":20,"t":"lava","e":"none"},{"x":0,"y":160,"w":100,"h":60,"t":"lava","e":"none"},{"x":440,"y":480,"w":60,"h":120,"t":"lava","e":"none"},{"x":280,"y":540,"w":160,"h":60,"t":"lava","e":"none"},{"x":460,"y":0,"w":60,"h":60,"t":"lava","e":"none"},{"x":520,"y":0,"w":80,"h":20,"t":"lava","e":"none"},{"x":60,"y":380,"w":60,"h":120,"t":"lava","e":"none"},{"x":40,"y":460,"w":20,"h":80,"t":"lava","e":"none"}],"lpath":[{"x":220,"y":0},{"x":220,"y":120},{"x":300,"y":100},{"x":440,"y":100},{"x":600,"y":100},{"x":680,"y":120},{"x":680,"y":220},{"x":600,"y":240},{"x":300,"y":240},{"x":220,"y":220},{"x":220,"y":380},{"x":220,"y":480},{"x":300,"y":460},{"x":580,"y":460},{"x":640,"y":480},{"x":640,"y":580}],"name":"ballside"}
    ,
    {"content":[{"x":100,"y":460,"w":100,"h":40,"t":"platform_level_1","e":"none"},{"x":280,"y":300,"w":60,"h":140,"t":"platform_level_1","e":"none"},{"x":260,"y":440,"w":120,"h":60,"t":"platform_level_2","e":"none"},{"x":40,"y":440,"w":60,"h":60,"t":"platform_level_2","e":"none"},{"x":480,"y":240,"w":40,"h":100,"t":"platform_level_1","e":"none"},{"x":480,"y":340,"w":100,"h":100,"t":"platform_level_2","e":"none"},{"x":460,"y":440,"w":140,"h":60,"t":"platform_level_3","e":"none"},{"x":280,"y":140,"w":40,"h":80,"t":"platform_level_1","e":"none"},{"x":320,"y":160,"w":60,"h":40,"t":"platform_level_2","e":"none"},{"x":640,"y":140,"w":100,"h":40,"t":"platform_level_1","e":"none"},{"x":600,"y":140,"w":40,"h":100,"t":"platform_level_2","e":"none"},{"x":0,"y":280,"w":100,"h":60,"t":"lava","e":"none"},{"x":340,"y":20,"w":160,"h":40,"t":"lava","e":"none"},{"x":440,"y":140,"w":120,"h":40,"t":"lava","e":"none"},{"x":440,"y":0,"w":60,"h":20,"t":"lava","e":"none"},{"x":0,"y":140,"w":20,"h":140,"t":"lava","e":"none"}],"lpath":[{"x":0,"y":540},{"x":420,"y":540},{"x":420,"y":260},{"x":220,"y":260},{"x":220,"y":100},{"x":780,"y":100}],"name":"balled in"}
    ,
    {"content":[{"x":280,"y":520,"w":60,"h":40,"t":"platform_level_1","e":"none"},{"x":420,"y":480,"w":60,"h":40,"t":"platform_level_1","e":"none"},{"x":660,"y":500,"w":60,"h":60,"t":"platform_level_1","e":"none"},{"x":620,"y":260,"w":40,"h":120,"t":"platform_level_2","e":"none"},{"x":280,"y":280,"w":40,"h":100,"t":"platform_level_1","e":"none"},{"x":400,"y":140,"w":40,"h":40,"t":"platform_level_1","e":"none"},{"x":440,"y":160,"w":40,"h":20,"t":"platform_level_2","e":"none"},{"x":580,"y":80,"w":80,"h":40,"t":"platform_level_1","e":"none"},{"x":200,"y":500,"w":80,"h":60,"t":"platform_level_2","e":"none"},{"x":420,"y":300,"w":80,"h":60,"t":"platform_level_1","e":"none"},{"x":480,"y":360,"w":20,"h":20,"t":"platform_level_1","e":"none"},{"x":480,"y":380,"w":60,"h":40,"t":"platform_level_2","e":"none"},{"x":400,"y":360,"w":80,"h":60,"t":"platform_level_3","e":"none"},{"x":400,"y":240,"w":120,"h":60,"t":"platform_level_2","e":"none"}],"lpath":[{"x":0,"y":480},{"x":340,"y":480},{"x":340,"y":200},{"x":580,"y":200},{"x":580,"y":460},{"x":360,"y":460},{"x":360,"y":220},{"x":560,"y":220},{"x":560,"y":440},{"x":380,"y":440},{"x":380,"y":0}],"name":"center of balls"}
    ,
    {"content":[{"x":660,"y":220,"w":100,"h":40,"t":"platform_level_1","e":"none"},{"x":660,"y":40,"w":60,"h":60,"t":"platform_level_3","e":"none"},{"x":360,"y":80,"w":120,"h":20,"t":"platform_level_1","e":"none"},{"x":160,"y":120,"w":20,"h":60,"t":"platform_level_1","e":"none"},{"x":380,"y":220,"w":40,"h":60,"t":"platform_level_1","e":"none"},{"x":420,"y":240,"w":60,"h":40,"t":"platform_level_2","e":"none"},{"x":260,"y":420,"w":80,"h":40,"t":"platform_level_1","e":"none"},{"x":100,"y":240,"w":40,"h":60,"t":"platform_level_1","e":"none"},{"x":440,"y":500,"w":80,"h":20,"t":"platform_level_1","e":"none"},{"x":520,"y":500,"w":120,"h":40,"t":"platform_level_2","e":"none"},{"x":220,"y":400,"w":40,"h":60,"t":"platform_level_2","e":"none"},{"x":100,"y":300,"w":60,"h":40,"t":"platform_level_2","e":"none"},{"x":640,"y":260,"w":120,"h":60,"t":"platform_level_2","e":"none"},{"x":480,"y":60,"w":140,"h":40,"t":"platform_level_2","e":"none"}],"lpath":[{"x":780,"y":200},{"x":600,"y":200},{"x":600,"y":300},{"x":360,"y":300},{"x":360,"y":200},{"x":220,"y":200},{"x":220,"y":120},{"x":640,"y":120},{"x":640,"y":20},{"x":80,"y":20},{"x":80,"y":380},{"x":200,"y":380},{"x":200,"y":480},{"x":780,"y":480}],"name":"sticks and balls"}
    ,
    {"content":[{"x":400,"y":120,"w":180,"h":40,"t":"platform_level_1","e":"none"},{"x":660,"y":60,"w":60,"h":100,"t":"platform_level_2","e":"none"},{"x":420,"y":260,"w":160,"h":40,"t":"platform_level_1","e":"none"},{"x":540,"y":300,"w":40,"h":80,"t":"platform_level_1","e":"none"},{"x":140,"y":360,"w":100,"h":60,"t":"platform_level_1","e":"none"},{"x":380,"y":500,"w":120,"h":40,"t":"platform_level_1","e":"none"},{"x":320,"y":300,"w":220,"h":40,"t":"platform_level_2","e":"none"},{"x":340,"y":220,"w":200,"h":40,"t":"platform_level_2","e":"none"},{"x":400,"y":80,"w":180,"h":40,"t":"platform_level_2","e":"none"},{"x":340,"y":80,"w":60,"h":60,"t":"platform_level_2","e":"none"},{"x":200,"y":220,"w":40,"h":140,"t":"platform_level_2","e":"none"},{"x":420,"y":440,"w":40,"h":60,"t":"platform_level_2","e":"none"},{"x":680,"y":480,"w":60,"h":60,"t":"platform_level_1","e":"none"},{"x":660,"y":460,"w":20,"h":60,"t":"platform_level_2","e":"none"}],"lpath":[{"x":0,"y":40},{"x":620,"y":40},{"x":620,"y":200},{"x":280,"y":200},{"x":280,"y":420},{"x":620,"y":420},{"x":620,"y":580}],"name":"balled in balls"}
    ,
    {"content":[{"x":160,"y":200,"w":160,"h":60,"t":"platform_level_2","e":"none"},{"x":180,"y":160,"w":120,"h":40,"t":"platform_level_1","e":"none"},{"x":260,"y":420,"w":200,"h":60,"t":"platform_level_1","e":"none"},{"x":220,"y":480,"w":180,"h":40,"t":"platform_level_2","e":"none"},{"x":540,"y":260,"w":20,"h":100,"t":"platform_level_2","e":"none"},{"x":560,"y":280,"w":60,"h":40,"t":"platform_level_1","e":"none"},{"x":80,"y":320,"w":40,"h":100,"t":"platform_level_1","e":"none"},{"x":120,"y":340,"w":40,"h":80,"t":"platform_level_2","e":"none"},{"x":260,"y":20,"w":40,"h":60,"t":"platform_level_2","e":"none"},{"x":300,"y":40,"w":60,"h":60,"t":"platform_level_1","e":"none"},{"x":560,"y":120,"w":80,"h":40,"t":"platform_level_1","e":"none"},{"x":80,"y":80,"w":40,"h":60,"t":"lava","e":"none"},{"x":100,"y":480,"w":40,"h":20,"t":"lava","e":"none"},{"x":100,"y":500,"w":20,"h":20,"t":"lava","e":"none"},{"x":360,"y":280,"w":20,"h":40,"t":"lava","e":"none"},{"x":380,"y":240,"w":20,"h":60,"t":"lava","e":"none"},{"x":600,"y":420,"w":40,"h":40,"t":"lava","e":"none"},{"x":540,"y":440,"w":60,"h":40,"t":"lava","e":"none"}],"lpath":[{"x":240,"y":260},{"x":240,"y":400},{"x":500,"y":400},{"x":500,"y":200},{"x":680,"y":200},{"x":680,"y":460},{"x":680,"y":540},{"x":60,"y":540},{"x":60,"y":40},{"x":240,"y":40},{"x":240,"y":140},{"x":240,"y":160}],"name":"ball around"}
    ,
    {"content":[{"x":260,"y":180,"w":180,"h":60,"t":"water","e":"none"},{"x":380,"y":240,"w":60,"h":60,"t":"water","e":"none"},{"x":260,"y":240,"w":60,"h":60,"t":"water","e":"none"},{"x":260,"y":300,"w":180,"h":60,"t":"water","e":"none"},{"x":440,"y":420,"w":40,"h":160,"t":"platform_level_1","e":"none"},{"x":540,"y":240,"w":40,"h":200,"t":"platform_level_2","e":"none"},{"x":220,"y":80,"w":40,"h":20,"t":"platform_level_2","e":"none"},{"x":420,"y":80,"w":40,"h":20,"t":"platform_level_2","e":"none"},{"x":180,"y":180,"w":20,"h":40,"t":"platform_level_2","e":"none"},{"x":180,"y":340,"w":20,"h":40,"t":"platform_level_2","e":"none"},{"x":180,"y":240,"w":20,"h":80,"t":"platform_level_3","e":"none"},{"x":100,"y":260,"w":40,"h":40,"t":"platform_level_2","e":"none"},{"x":320,"y":240,"w":60,"h":60,"t":"platform_level_1","e":"none"},{"x":180,"y":420,"w":260,"h":40,"t":"platform_level_2","e":"none"}],"lpath":[{"x":0,"y":160},{"x":460,"y":160},{"x":460,"y":380},{"x":220,"y":380},{"x":220,"y":120},{"x":480,"y":120},{"x":480,"y":380},{"x":480,"y":400},{"x":200,"y":400},{"x":180,"y":400},{"x":160,"y":400},{"x":160,"y":80},{"x":160,"y":60},{"x":480,"y":60},{"x":500,"y":60},{"x":500,"y":580}],"name":"water ball"},

    {"content":[{"x":100,"y":20,"w":40,"h":180,"t":"platform_level_1","e":"none"},{"x":180,"y":160,"w":180,"h":40,"t":"platform_level_1","e":"none"},{"x":140,"y":20,"w":40,"h":180,"t":"platform_level_2","e":"none"},{"x":220,"y":260,"w":200,"h":40,"t":"platform_level_1","e":"none"},{"x":420,"y":100,"w":40,"h":200,"t":"platform_level_1","e":"none"},{"x":220,"y":300,"w":240,"h":40,"t":"platform_level_2","e":"none"},{"x":560,"y":160,"w":60,"h":60,"t":"platform_level_1","e":"none"},{"x":480,"y":480,"w":120,"h":40,"t":"platform_level_1","e":"none"},{"x":620,"y":340,"w":40,"h":180,"t":"platform_level_2","e":"none"},{"x":620,"y":100,"w":40,"h":120,"t":"platform_level_2","e":"none"},{"x":540,"y":300,"w":120,"h":40,"t":"platform_level_2","e":"none"},{"x":540,"y":220,"w":120,"h":80,"t":"platform_level_3","e":"none"},{"x":440,"y":420,"w":40,"h":100,"t":"platform_level_2","e":"none"},{"x":80,"y":300,"w":40,"h":160,"t":"platform_level_2","e":"none"},{"x":0,"y":240,"w":180,"h":40,"t":"platform_level_3","e":"none"},{"x":140,"y":300,"w":40,"h":160,"t":"lava","e":"none"},{"x":200,"y":20,"w":160,"h":120,"t":"water","e":"none"},{"x":700,"y":80,"w":60,"h":360,"t":"water","e":"none"},{"x":60,"y":520,"w":140,"h":60,"t":"water","e":"none"}],"lpath":[{"x":80,"y":0},{"x":80,"y":220},{"x":400,"y":220},{"x":400,"y":80},{"x":680,"y":80},{"x":680,"y":240},{"x":680,"y":540},{"x":420,"y":540},{"x":420,"y":360},{"x":220,"y":360},{"x":220,"y":480},{"x":60,"y":480},{"x":60,"y":300},{"x":0,"y":300}],"name":"big ball hills"}
    ,
    {"content":[{"x":20,"y":140,"w":80,"h":380,"t":"platform","e":"none"},{"x":200,"y":340,"w":140,"h":140,"t":"platform","e":"none"},{"x":380,"y":140,"w":140,"h":140,"t":"platform","e":"none"},{"x":580,"y":360,"w":100,"h":100,"t":"platform","e":"none"}],"lpath":[{"x":0,"y":90},{"x":100,"y":100},{"x":140,"y":140},{"x":150,"y":240},{"x":180,"y":500},{"x":240,"y":540},{"x":330,"y":530},{"x":370,"y":500},{"x":350,"y":140},{"x":370,"y":100},{"x":500,"y":90},{"x":540,"y":130},{"x":560,"y":490},{"x":620,"y":530},{"x":690,"y":520},{"x":720,"y":480},{"x":710,"y":330},{"x":750,"y":280},{"x":790,"y":280}],"name":" old balling ground"}
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
        focus : "nearest",
        },
    strong_ball_pincher:
        {
        color : "hsl(185, 52%, 78%)",
        size : 10,
        range : 80,
        firerate : 8,
        shotspeed : 5,
        damage : 0.1,
        focus : "nearest",
        },
    tiny_ball_buster:
        {
        color : "hsl(185, 32%, 77%)",
        size : 5,
        range : 130,
        firerate : 60,
        shotspeed : 7,
        damage : 0.2,
        focus : "nearest",
        },
    normal_ball_buster:
        {
        color : "hsl(194, 14%, 50%)",
        size : 10,
        range : 180,
        firerate : 75,
        shotspeed : 10,
        damage : 1,
        focus : "nearest",
        },
    trained_ball_buster:
        {
        color : "hsl(180, 14%, 40%)",
        size : 20,
        range : 150,
        firerate : 72,
        shotspeed : 11,
        damage : 2,
        focus : "nearest",
        },
    fast_ball_buster:
        {
        color : "hsl(194, 14%, 70%)",
        size : 15,
        range : 160,
        firerate : 53,
        shotspeed : 11,
        damage : 1,
        focus : "nearest",
        },
    normal_ball_crusher:
        {
        color : "hsl(194, 14%, 30%)",
        size : 10,
        range : 100,
        firerate : 100,
        shotspeed : 11,
        damage : 4,
        focus : "strongest",
        },
    trained_ball_crusher:
        {
        color : "hsl(194, 14%, 20%)",
        size : 15,
        range : 80,
        firerate : 110,
        shotspeed : 8,
        damage : 7,
        focus : "strongest",
        },
    pro_ball_crusher:
        {
        color : "hsl(194, 14%, 10%)",
        size : 20,
        range : 70,
        firerate : 150,
        shotspeed : 9,
        damage : 10,
        focus : "strongest",
        },
    normal_ball_smasher:
        {
        color : "hsl(0, 20%, 47%)",
        size : 25,
        range : 200,
        firerate : 8,
        shotspeed : 3,
        damage : 0.5,
        focus : "nearest",
        },
    holy_ball_smasher:
        {
        color : "hsl(0, 20%, 37%)",
        size : 30,
        range : 250,
        firerate : 4,
        shotspeed : 5,
        damage : 0.5,
        focus : "nearest",
        },
    normal_ball_refiner:
        {
        color : "hsl(60, 62%, 69%)",
        size : 10,
        range : 60,
        firerate : 150,
        shotspeed : 6,
        damage : 0.1,
        moneymulti: 2,
        focus : "nearest",
        },
    trained_ball_refiner:
        {
        color : "hsl(60, 62%, 49%)",
        size : 15,
        range : 70,
        firerate : 180,
        shotspeed : 7,
        damage : 0.2,
        moneymulti: 3,
        focus : "nearest",
        },
    tiny_ball_sniper:
        {
        color : "hsl(1, 52%, 38%)",
        size : 10,
        range : 270,
        firerate : 350,
        shotspeed : 20,
        damage : 5,
        homing:PI/120,
        focus : "strongest",
        },
    normal_ball_sniper:
        {
        color : "hsl(1, 52%, 28%)",
        size : 15,
        range : 330,
        firerate : 300,
        shotspeed : 22,
        damage : 15,
        homing:PI/90,
        focus : "strongest",
        },
    trained_ball_sniper:
        {
        color : "hsl(1, 52%, 20%)",
        size : 20,
        range : 450,
        firerate : 330,
        shotspeed : 35,
        damage : 18,
        homing:PI/70,
        focus : "strongest",
        },
    weak_ball_searcher:
        {
        color : "hsl(245, 35%, 70%)",
        size : 10,
        range : 180,
        firerate : 180,
        shotspeed : 6,
        damage : 2,
        homing:PI/60,
        focus : "fastest",
        },
    normal_ball_searcher:
        {
        color : "hsl(245, 35%, 50%)",
        size : 15,
        range : 220,
        firerate : 200,
        shotspeed : 7,
        damage : 4,
        homing:PI/30,
        focus : "fastest",
        },
    fast_ball_searcher:
        {
        color : "hsl(245, 35%, 70%)",
        size : 15,
        range : 220,
        firerate : 70,
        shotspeed : 7,
        damage : 2,
        homing:PI/40,
        focus : "fastest",
        },
    pro_ball_searcher:
        {
        color : "hsl(245, 35%, 30%)",
        size : 20,
        range : 240,
        firerate : 220,
        shotspeed : 10,
        damage : 10,
        homing:PI/10,
        focus : "fastest",
        },
    normal_ball_freezer:
    {
        color : "hsl(181, 35%, 75%)",
        size : 10,
        range : 130,
        firerate : 130,
        shotspeed : 10,
        damage : 1,
        freeze:1.5,
        focus : "fastest",
        },
    fast_ball_freezer:
    {
        color : "hsl(181, 35%, 85%)",
        size : 15,
        range : 130,
        firerate : 90,
        shotspeed : 11,
        damage : 1,
        freeze:2,
        focus : "fastest",
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
        focus : "fastest",
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
        focus : "strongest",
        },

}

const ENEMYTYPES = {

    normal_endless_original:{
        size : 10,
        speed : 1,
        health : 3,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 50%)",
        },
    slow_endless_original:{
        size : 11,
        speed : 0.5,
        health : 4,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 30%)",
        },
    fast_endless_original:{
        size : 9,
        speed : 1.5,
        health : 2,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 70%)",
        },


    normal_endless:{
        size : 10,
        speed : 1,
        health : 3,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 50%)",
        },
    slow_endless:{
        size : 11,
        speed : 0.5,
        health : 4,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 30%)",
        },
    fast_endless:{
        size : 9,
        speed : 1.5,
        health : 2,
        reward : 0.1,
        damage: 1,
        color : "hsl(255, 36%, 70%)",
        },



    normal_1:{
        size : 10,
        speed : 1,
        health : 3,
        reward : 0.1,
        damage: 1,
        color : "hsl(0, 36%, 50%)",
        },
    slow_1:{
        size : 11,
        speed : 0.5,
        health : 4,
        reward : 0.1,
        damage: 2,
        color : "hsl(0, 36%, 30%)",
        },
    fast_1:{
        size : 9,
        speed : 1.5,
        health : 2,
        reward : 0.1,
        damage: 1,
        color : "hsl(0, 36%, 70%)",
        },
    normal_2:{
        size : 11,
        speed : 1.1,
        health : 8,
        reward : 0.2,
        damage: 1,
        color : "hsl(20, 36%, 50%)",
        },
    slow_2:{
        size : 13,
        speed : 0.6,
        health : 10,
        reward : 0.2,
        damage: 2,
        color : "hsl(20, 36%, 30%)",
        },
    fast_2:{
        size : 9,
        speed : 1.6,
        health : 7,
        reward : 0.2,
        damage: 1,
        color : "hsl(20, 36%, 70%)",
        },
    normal_3:{
        size : 12,
        speed : 1.1,
        health : 14,
        reward : 0.3,
        damage: 2,
        color : "hsl(40, 36%, 50%)",
        },
    slow_3:{
        size : 15,
        speed : 0.6,
        health : 16,
        reward : 0.3,
        damage: 3,
        color : "hsl(40, 36%, 30%)",
        },
    fast_3:{
        size : 10,
        speed : 1.6,
        health : 12,
        reward : 0.3,
        damage: 2,
        color : "hsl(40, 36%, 70%)",
        },
    normal_4:{
        size : 15,
        speed : 1.1,
        health : 25,
        reward : 0.3,
        damage: 2,
        color : "hsl(60, 36%, 50%)",
        },
    slow_4:{
        size : 17,
        speed : 0.6,
        health : 35,
        reward : 0.3,
        damage: 3,
        color : "hsl(60, 36%, 30%)",
        },
    fast_4:{
        size : 12,
        speed : 1.6,
        health : 17,
        reward : 0.3,
        damage: 2,
        color : "hsl(60, 36%, 70%)",
        },
    boss_1:{
        size : 28,
        speed : 0.4,
        health : 300,
        reward : 5,
        damage: 5,
        color : "hsl(308, 24%, 23%)",
        permshowhealth : true,
        },
    normal_5:{
        size : 18,
        speed : 1.2,
        health : 30,
        reward : 0.4,
        damage: 3,
        color : "hsl(80, 36%, 50%)",
        },
    slow_5:{
        size : 20,
        speed : 0.5,
        health : 55,
        reward : 0.4,
        damage: 4,
        color : "hsl(80, 36%, 30%)",
        },
    fast_5:{
        size : 13,
        speed : 2,
        health : 25,
        reward : 0.4,
        damage: 3,
        color : "hsl(80, 36%, 70%)",
        },
    superfast_1:{
        size : 10,
        speed : 3,
        health : 23,
        reward : 0.3,
        damage: 3,
        color : "hsl(63, 36%, 80%)",
        },
    boss_2:{
        size : 35,
        speed : 0.4,
        health : 700,
        reward : 10,
        damage: 8,
        color : "hsl(28, 62%, 58%)",
        permshowhealth : true,
        },
    normal_6:{
        size : 22,
        speed : 1.5,
        health : 70,
        reward : 0.4,
        damage: 3,
        color : "hsl(100, 36%, 50%)",
        },
    slow_6:{
        size : 25,
        speed : 0.4,
        health : 90,
        reward : 0.4,
        damage: 4,
        color : "hsl(100, 36%, 30%)",
        },
    fast_6:{
        size : 14,
        speed : 2.3,
        health : 40,
        reward : 0.4,
        damage: 3,
        color : "hsl(100, 36%, 70%)",
        },
    superfast_2:{
        size : 10,
        speed : 3.4,
        health : 20,
        reward : 0.3,
        damage: 4,
        color : "hsl(63, 36%, 90%)",
        },
    sun:{
        size : 50,
        speed : 0.2,
        health : 1200,
        reward :20,
        damage: 10,
        color : "hsl(53, 45%, 86%)",
        permshowhealth : true,
        },
    normal_7:{
        size : 23,
        speed : 1.5,
        health : 100,
        reward : 0.5,
        damage: 4,
        color : "hsl(120, 36%, 50%)",
        },
    slow_7:{
        size : 26,
        speed : 0.4,
        health : 150,
        reward : 0.5,
        damage: 4,
        color : "hsl(120, 36%, 30%)",
        },
    fast_7:{
        size : 15,
        speed : 2.3,
        health : 70,
        reward : 0.5,
        damage: 4,
        color : "hsl(120, 36%, 70%)",
        },

}


// timer

const timer = {
    time:0,
    reset: function(set=0){timer.time = set},
    start: function(){timer.timer = setInterval(() => {
        timer.time += 100;
    }, 100);},
    stop: function(){clearInterval(timer.timer)},
    display: function(){
        timerhtml.value = time(timer.time);
    
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

        if(this.strokecolor !== "none"){ctx.strokeRect(this.x,this.y,this.width,this.height);}
        ctx.fillRect(this.x,this.y,this.width,this.height);

        
        
        ctx.fill()
        ctx.stroke(); 
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.shadowColor = "black";
        ctx.strokeStyle = "black;"


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
            this.placeable = true;
            this.alti = 1;

        
        }
        else if(this.type === "platform_level_1"){
            this.strokecolor = "black"
            this.fillcolor = "hsl(0, 0%, 30%)";
            this.shadowcolor = "black";
            this.opac = 1;
            this.placeable = true;
            this.alti = 1;
        
        }
        else if(this.type === "platform_level_2"){
            this.strokecolor = "black"
            this.fillcolor = "hsl(0, 0%, 50%)";
            this.shadowcolor = "black";
            this.opac = 1;
            this.placeable = true;
            this.alti = 2;

        
        }
        else if(this.type === "platform_level_3"){
            this.strokecolor = "black"
            this.fillcolor = "hsl(0, 0%, 70%";
            this.shadowcolor = "black";
            this.opac = 1;
            this.placeable = true;
            this.alti = 3;

        
        }
        else if(this.type === "lava"){
            this.strokecolor = "none"
            this.fillcolor = "#bf6a5d";
            this.shadowcolor = "#bf6a5d";
            this.opac = 1;
            this.placeable = false;
            this.alti = 10;

        
        }
        else if(this.type === "water"){
            this.strokecolor = "none"
            this.fillcolor = "#5dabbf";
            this.shadowcolor = "#5dabbf";
            this.opac = 1;
            this.placeable = false;
            this.alti = 0;
            this.resistance = 0.92;

        
        }
        else{
            this.strokecolor = "white"
            this.fillcolor = "pink";
            this.shadowcolor = "pink";
            this.opac = 1;
            this.placeable = false;
            this.alti = 0;

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
            makeparticle(this.x,this.y,"money",this.multiedreward.toFixed(2));
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
                makeparticle(this.x,this.y-this.size,"dmg",this.spike);
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
                    player.changehealth(- this.damage);
                    playSound("healthdown",{ volume: mastervolume });
                }
            }

        }
    }

    render(part = "enemy"){
        if(part === "enemy"){
            ctx.beginPath();
            ctx.shadowBlur = this.size;
            ctx.fillStyle = this.color;
            ctx.arc(this.x-this.size/100,this.y-this.size/100, this.size, 0,PI*2)
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        if(part === "info"){
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
                ctx.fillStyle = "whitesmoke";
                ctx.strokeRect(this.x+this.size*2,this.y-20,80+(10*this.type.length),120);
                ctx.fillRect(this.x+this.size*2,this.y-20,80+(10*this.type.length),120); 
                ctx.strokeText("name: "+this.type,this.x+this.size*2+20,this.y);
                ctx.strokeText("reward: "+this.multiedreward,this.x+this.size*2+20,this.y+20);
                ctx.strokeText("health: "+this.orighealth,this.x+this.size*2+20,this.y+40);
                ctx.strokeText("speed: "+this.totalspeed.toFixed(2),this.x+this.size*2+20,this.y+60)
                ctx.strokeText("damage: "+this.damage,this.x+this.size*2+20,this.y+80)
    
            }
        }

        
    }

    settypes(){
        this.size = ENEMYTYPES[this.type].size;
        
        this.speed = ENEMYTYPES[this.type].speed;
        this.health = ENEMYTYPES[this.type].health;
        this.reward = ENEMYTYPES[this.type].reward;
        this.color = ENEMYTYPES[this.type].color;
        this.damage = ENEMYTYPES[this.type].damage;
        this.permshowhealth = ENEMYTYPES[this.type].permshowhealth;

        this.orighealth  =this.health;
        if(this.permshowhealth){this.showhealth = true;}
        if(this.permshowhealth === undefined){this.permshowhealth = false;}

    }



} 

class tower{

constructor(x,y,type,alti){

    this.x = x;
    this.y = y;
    this.type = type;
    this.alti = alti;
    this.dir = 0;
    this.wstep = 0;
    this.focus = "furthest";
    this.settype();
    this.showinfo = false;
    this.g_offset = 2;
    this.g_offset_a = 0;

}

update(i){
    this.wstep += 1+Math.random();


    let bestenemy = null;
    switch(this.focus){
        case "nearest":
            let bestdistance = Infinity;
            ENEMIES.forEach((v,i)=>{
                let enemydistance = distance(v.x,this.x,v.y,this.y);
                if(enemydistance< bestdistance && enemydistance < this.range){
                    if(!this.shootcol(v)){
                        bestdistance = enemydistance; bestenemy = i;
                    }
                    
                }
            })    
            break;
        case "furthest":
            let smallestdistance = 0;
            ENEMIES.forEach((v,i)=>{
                let enemydistance = distance(v.x,this.x,v.y,this.y);
                if(enemydistance> smallestdistance && enemydistance < this.range){
                    if(!this.shootcol(v)){
                    smallestdistance = enemydistance; bestenemy = i;
                    }
                }
            })    
            break;
        case "fastest":
            let fastestspeed = 0;
            ENEMIES.forEach((v,i)=>{
                let enemydistance = distance(v.x,this.x,v.y,this.y);
                if(v.totalspeed> fastestspeed && enemydistance < this.range){
                    if(!this.shootcol(v)){
                    fastestspeed = v.totalspeed; bestenemy = i;}
                    }
            })    
            break;
        case "strongest":
            let strongesthealth = 0;
            ENEMIES.forEach((v,i)=>{
                let enemydistance = distance(v.x,this.x,v.y,this.y);
                if(v.health> strongesthealth && enemydistance < this.range){
                    if(!this.shootcol(v)){
                    strongesthealth = v.health; bestenemy = i;}
                    }
            })    
            break;
        case "weakest":
            let weakesthealth = Infinity;
            ENEMIES.forEach((v,i)=>{
                let enemydistance = distance(v.x,this.x,v.y,this.y);
                if(v.health< weakesthealth && enemydistance < this.range){
                    if(!this.shootcol(v)){
                    weakesthealth = v.health; bestenemy = i;}
                    }
            })    
            break;

    }
    


    if(bestenemy != null){
        this.dir = (Math.atan2((this.y-ENEMIES[bestenemy].y),(this.x-ENEMIES[bestenemy].x)))+PI;
        if(this.wstep > this.firerate){
            makebullet(this.x,this.y,this.dir,this.shotspeed,this.damage,this);
            playSound("shoot",{ volume: mastervolume });
            this.wstep = 0;
            if(this.g_offset <= 2){
                this.g_offset_a -= this.size-(this.size/1.5)
            }else{
                this.g_offset = 1
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

shootcol(e){

let col = false;

GAMEOBJECTS.forEach(v=>{
    if(v.alti > this.alti){
        if(linecol(this.x,this.y,e.x,e.y,v.x,v.y,v.x,v.y+v.height) || linecol(this.x,this.y,e.x,e.y,v.x,v.y,v.x+v.width,v.y) || linecol(this.x,this.y,e.x,e.y,v.x+v.width,v.y,v.x+v.width,v.y+v.height) || linecol(this.x,this.y,e.x,e.y,v.x,v.y+v.height,v.x+v.width,v.y+v.height)){
        col = true;
        }
    }
})

// ctx.beginPath();
// ctx.moveTo(this.x,this.y);
// ctx.lineTo(e.x,e.y);
// if(col){ctx.strokeStyle = "red"}else{ctx.strokeStyle = "black"}
// ctx.stroke();


return col;
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
        ctx.fillStyle = "whitesmoke";
        ctx.strokeRect(this.x+this.size*2,this.y-20,80+(10*this.type.length),120);
        ctx.fillRect(this.x+this.size*2,this.y-20,80+(10*this.type.length),120); 
        ctx.strokeText("name: "+this.type,this.x+this.size*2+20,this.y+0);
        ctx.strokeText("damage: "+this.damage,this.x+this.size*2+20,this.y+20);
        ctx.strokeText("firerate: "+this.firerate,this.x+this.size*2+20,this.y+40);
        ctx.strokeText("shotspeed: "+this.shotspeed,this.x+this.size*2+20,this.y+60);
        ctx.strokeText("focus: "+this.focus,this.x+this.size*2+20,this.y+80);
      
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
    this.focus = TOWERTYPES[this.type].focus;


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
        this.alti = parent.alti;
        this.x += Math.cos(this.dir)*parent.size;
        this.y += Math.sin(this.dir)*parent.size;
        

    }

    update(i){

        this.x += Math.cos(this.dir)*this.speed;
        this.y += Math.sin(this.dir)*this.speed;


        // homing
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

        // canvas limit col
        
        if( this.x > canvas.width-this.size || this.x < 0 ||  this.y > canvas.height-this.size || this.y < 0){
            BULLETS.splice(i,1);
        }


        // gm col
        GAMEOBJECTS.forEach(v=>{

            if(v.alti >this.alti){
                let collision = v.collision(this.x,this.y,this.x+this.size,this.y+this.size);
                if(collision.col){
                    BULLETS.splice(i,1);
                }
            }else if(v.resistance !== undefined){
                let collision = v.collision(this.x,this.y,this.x+this.size,this.y+this.size);
                if(collision.col){
                    this.speed *= 0.9
                }
            }

        })

        // speed death

        if(this.speed < 1){
            BULLETS.splice(i,1);
        }

        // enemy col

        ENEMIES.forEach(v=>{
            if(distance(v.x,this.x,v.y,this.y) < this.size+v.size){
                v.health -= this.damage;
                makeparticle(v.x,v.y-v.size,"dmg",this.damage);
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

    state:"waves",
    waveprogress:0,
    waveprogresshtml:document.getElementById("waveprogres"),

    piece:0,
    step:0,
    spawnrate:150,

    wave:0,
    wavestep:0,
    waverate:3,

    update: function(){
        if(spawnhandler.state === "waves" || spawnhandler.state === "endless_waves"){
             
            spawnhandler.step++;
            if(spawnhandler.step > spawnhandler.spawnrate){
                spawnhandler.step = 0;
                makeenemy(spawnhandler.modes[spawnhandler.state][spawnhandler.wave].pieces[spawnhandler.piece]);
                spawnhandler.piece ++;
                if(spawnhandler.piece > spawnhandler.modes[spawnhandler.state][spawnhandler.wave].pieces.length-1 ){spawnhandler.piece = 0;spawnhandler.wavestep++; }
                spawnhandler.updateprogres();
            }
    
            if(spawnhandler.wavestep >= spawnhandler.waverate){
                spawnhandler.wave ++;
                spawnhandler.step = -800;
                spawnhandler.wavestep = 0;
                if(spawnhandler.wave > spawnhandler.modes[spawnhandler.state].length-1){
                   
                    if(spawnhandler.state === "waves"){
                        localStorage.setItem("endlessmode",JSON.stringify({unlocked:true}));
                        let modebtn = document.getElementById("modebtn");
                        modebtn.classList.remove("locked");
                        let editbtn = document.getElementById("leveleditbtn");
                        editbtn.classList.remove("locked");
                        let addmapbtn = document.getElementById("addmapbtn");
                        addmapbtn.classList.remove("locked");
                        spawnhandler.endlessmode.locked = false;
                        togglePause(true);
                        toggleMenu("winning");
                    }else{
                        spawnhandler.wave = 0
                    }
                }
                spawnhandler.setvaltowave();
                spawnhandler.updateprogres();
                
                
                if( spawnhandler.state === "endless_waves"){
                    spawnhandler.endlessmode.increaseenemy();
                    spawnhandler.endlessmode.endlesswave++;
                    levelwave.value = "Wave: " + spawnhandler.endlessmode.endlesswave;
                }else{
                    levelwave.value = "Wave: " + spawnhandler.wave;
                }
            }

        }
    },

    setvaltowave: function(){
        spawnhandler.spawnrate = spawnhandler.modes[spawnhandler.state][spawnhandler.wave].wave_spawnrate;
        spawnhandler.waverate = spawnhandler.modes[spawnhandler.state][spawnhandler.wave].wave_waverate;
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
        spawnhandler.endlessmode.resetendlessenemy()
        spawnhandler.endlessmode.setincreasors("easy");
        spawnhandler.endlessmode.endlesswave=0;
        spawnhandler.updateprogres();


        if(!localStorage.getItem("endlessmode")){
            localStorage.setItem("endlessmode",JSON.stringify({unlocked:false}));
            let modebtn = document.getElementById("modebtn");
            modebtn.classList.add("locked");
            let editbtn = document.getElementById("leveleditbtn");
            editbtn.classList.add("locked");
            let addmapbtn = document.getElementById("addmapbtn");
            addmapbtn.classList.add("locked");
            spawnhandler.endlessmode.locked = true;
        
        }else{
            if(!JSON.parse(localStorage.getItem("endlessmode")).unlocked){
                let modebtn = document.getElementById("modebtn");
                modebtn.classList.add("locked");
                let editbtn = document.getElementById("leveleditbtn");
                editbtn.classList.add("locked");
                let addmapbtn = document.getElementById("addmapbtn");
                addmapbtn.classList.add("locked");
                spawnhandler.endlessmode.locked = true;
            }
        }
        
    },

    updateprogres(){
        let piecepercent = ( 1 / (spawnhandler.modes[spawnhandler.state][spawnhandler.wave].pieces.length  / (spawnhandler.piece+1)  )   )
        spawnhandler.waveprogress = Math.round(   100  /  ((spawnhandler.waverate)   /   (spawnhandler.wavestep+piecepercent)  ))
        spawnhandler.waveprogresshtml.value = spawnhandler.waveprogress;
    },

    changewavemode(btn){
        
        if(!spawnhandler.endlessmode.locked){
            if(spawnhandler.state === "waves"){
                togglePause(true); 
                toggleMenu('endlesssmenu'); 
            }else if(spawnhandler.state === "endless_waves"){
                hardreset();
                spawnhandler.updateprogres();
                spawnhandler.state = "waves";
                btn.innerHTML = "Endless Mode"
            }
        }else{
            togglePause(true);
            toggleMenu("endlesslocked");
        }
    },
    
    endlessmode:{

        increasors:{

        size : {v:0.1,o:"+"},
        speed : {v:0.1,o:"+"},
        health : {v:1,o:"+"},
        },
        endlesswave:0,
        locked:false,

        difficulty:"easy",

        setincreasors:function(newdif){
            spawnhandler.endlessmode.difficulty = newdif;
            let increasor =  spawnhandler.endlessmode.increasors;
            switch(newdif){
                case "easy":
                    increasor.size.v = 0.2;
                    increasor.speed.v = 0.1;
                    increasor.health.v = 1.5;
                    increasor.health.o = "+";
                    increasor.speed.o = "+";
                    increasor.size.o = "+";
                    break;
                case "normal":
                    increasor.size.v = 0.2;
                    increasor.speed.v = 0.05;
                    increasor.health.v = 1.3;
                    increasor.health.o = "*";
                    increasor.speed.o = "+";
                    increasor.size.o = "+";
                    break;
                case "hard":
                    increasor.size.v = 0.3;
                    increasor.speed.v = 1.03;
                    increasor.health.v = 1.5;
                    increasor.health.o = "*";
                    increasor.speed.o = "*";
                    increasor.size.o = "+";
                    break;
                case "impossible":
                    increasor.size.v = 0.3;
                    increasor.speed.v = 1.04;
                    increasor.health.v = 1.7;
                    increasor.health.o = "*";
                    increasor.speed.o = "*";
                    increasor.size.o = "+";
                    break;
                default:
                    console.log("what")
                    break;


            }



        },

        changedifficulty:function(newdif){
            hardreset();
            spawnhandler.updateprogres();
            spawnhandler.endlessmode.setincreasors(newdif);

            document.getElementById("modebtn").innerHTML = "Normal Waves Mode";
            spawnhandler.state = "endless_waves";

        },


        increaseenemy:function(){
            let increasor =  spawnhandler.endlessmode.increasors;

            if(increasor.size.o === "+"){
                ENEMYTYPES.normal_endless.size += increasor.size.v;
                ENEMYTYPES.slow_endless.size += increasor.size.v;
                ENEMYTYPES.fast_endless.size += increasor.size.v;
            }else if(increasor.size.o === "*" ){
                ENEMYTYPES.normal_endless.size *= increasor.size.v;
                ENEMYTYPES.slow_endless.size *= increasor.size.v;
                ENEMYTYPES.fast_endless.size *= increasor.size.v;
            }
            
            if(increasor.speed.o === "+"){
                ENEMYTYPES.normal_endless.speed += increasor.speed.v;
                ENEMYTYPES.slow_endless.speed += increasor.speed.v;
                ENEMYTYPES.fast_endless.speed += increasor.speed.v;
            }else if(increasor.speed.o === "*" ){
                ENEMYTYPES.normal_endless.speed *= increasor.speed.v;
                ENEMYTYPES.slow_endless.speed *= increasor.speed.v;
                ENEMYTYPES.fast_endless.speed *= increasor.speed.v;
            }
            
            if(increasor.health.o === "+"){
                ENEMYTYPES.normal_endless.health += increasor.health.v;
                ENEMYTYPES.slow_endless.health += increasor.health.v;
                ENEMYTYPES.fast_endless.health += increasor.health.v;
            }else if(increasor.health.o === "*" ){
                ENEMYTYPES.normal_endless.health *= increasor.health.v;
                ENEMYTYPES.slow_endless.health *= increasor.health.v;
                ENEMYTYPES.fast_endless.health *= increasor.health.v;
            }

        },


        resetendlessenemy: function(){

            ENEMYTYPES.normal_endless = {...ENEMYTYPES.normal_endless_original}
            ENEMYTYPES.fast_endless = {...ENEMYTYPES.fast_endless_original}
            ENEMYTYPES.slow_endless = {...ENEMYTYPES.slow_endless_original}
    
        },


    },


    modes:
    {

    endless_waves:[

        {
            wave_spawnrate: 120,
                wave_waverate:2,    
                pieces:[
                    "normal_endless",
                    "normal_endless",
                    "normal_endless",
                    "slow_endless",
                ]
        },

        {
            wave_spawnrate: 110,
                wave_waverate:2,    
                pieces:[
                    "normal_endless",
                    "slow_endless",
                    "fast_endless",
                    "normal_endless",
                    "slow_endless",
                ]
        },

        {
            wave_spawnrate: 80,
                wave_waverate:3,    
                pieces:[
                    "slow_endless",
                    "normal_endless",
                    "slow_endless",
                    "fast_endless",
                    "normal_endless",
                    "fast_endless",
                    "fast_endless",
                    "slow_endless",
                ]
        },

    ],
    
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
            wave_spawnrate: 60, // 5
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
            wave_spawnrate: 70, // 10
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
            wave_spawnrate: 70,
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
            wave_spawnrate: 9,
            wave_waverate:11,    
            pieces:[
                "normal_2",
                "normal_2",
                "normal_3",
                "normal_2",
                "normal_3",
                "fast_2",
                "fast_2",
            ]
        },

        {
            wave_spawnrate: 70,
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
            wave_spawnrate: 40,
            wave_waverate:2,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "superfast_1",
                "normal_5",
                "normal_5",
                "slow_5",
                "superfast_1",
            ]
        },

        {
            wave_spawnrate: 70, // 15
            wave_waverate:1,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_4",
                "fast_5",
                "fast_5",
                "fast_5",
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
            wave_spawnrate: 50,
            wave_waverate:5,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "fast_5",
                "normal_5",
                "boss_1",
                "normal_5",
                "slow_5",
                "superfast_1",
                "superfast_1",
            ]
        },

        {
            wave_spawnrate: 70,
            wave_waverate:3,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "normal_5",
                "slow_5",
                "slow_5",

                "boss_1",
                "normal_5",
                "normal_5",
                "superfast_1",

                "fast_5",
                "fast_5",
                "fast_5",
                "normal_5",
                "normal_5",
                "boss_1",
                "normal_5",
                "slow_5",
                "superfast_1",
                "superfast_1",
            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:2,    
            pieces:[
                "normal_5",
                "normal_5",
                "normal_5",
                "normal_6",
                "normal_6",
                "normal_6",

                "fast_5",
                "fast_6",
                "fast_6",
                "superfast_2",

            ]
        },

        {
            wave_spawnrate: 70,
            wave_waverate:3,    
            pieces:[
                "normal_6",
                "normal_6",
                "normal_6",
                "slow_6",
                "slow_6",
                "slow_6",
                "boss_1",

                "fast_6",
                "fast_6",
            ]
        },

        {
            wave_spawnrate: 60, // 20
            wave_waverate:3,    
            pieces:[
                "normal_6",
                "normal_6",
                "normal_6",
                "normal_7",
                "slow_6",
                "slow_6",
                "slow_6",
                "slow_6",
                "fast_6",
                "superfast_2",
                "fast_6",
            ]
        },

        {
            wave_spawnrate: 50,
            wave_waverate:3,    
            pieces:[
                "normal_6",
                "normal_6",
                "superfast_2",

                "normal_6",
                "normal_7",
                "normal_6",

                "boss_2",
                "normal_6",

                "normal_7",
                "superfast_2",

                "slow_6",
                "slow_6",
                "slow_6",
            ]
        },

        {
            wave_spawnrate: 100,
            wave_waverate:1,    
            pieces:[
                "normal_6",
                "normal_6",
                "normal_6",
                "sun",
                "normal_7",
                "slow_6",
                "slow_6",
                "slow_6",
                "fast_6",
                "superfast_2",
                "superfast_2",
                "fast_6",
            ]
        },

        {
            wave_spawnrate: 80,
            wave_waverate:2,    
            pieces:[
                "normal_6",
                "normal_6",
                "normal_6",
                "boss_2",
                "normal_7",
                "normal_6",
                "normal_6",
                "normal_6",
                "slow_6",
                "normal_7",
                "slow_6",
                "slow_6",
            ]
        },

        {
            wave_spawnrate: 60,
            wave_waverate:4,    
            pieces:[
                "normal_6",
                "normal_6",
                "slow_7",
                "normal_6",
                "normal_6",
                "slow_6",
                "slow_6",
                "slow_7",
                "boss_2",
                "slow_6",
                "slow_6",
                "fast_6",
                "slow_7",
                "superfast_2",
                "superfast_2",
            ]
        },

        {
            wave_spawnrate: 120, // 25
            wave_waverate:1,    
            pieces:[
                "normal_6",
                "boss_2",
                "slow_7",
                "sun",
                "slow_7",
                "slow_7",
                "normal_7",
                "boss_2",
                "superfast_2",
                "superfast_2",
            ]
        },


    ],

    }   


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

    health:20,
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
    etower:null,
    inputtype:"place",
    sprice:
    {
        tiny_ball_buster:{name:"Tiny Ball Buster",price:3,locked:false},
        normal_ball_buster:{name:"Normal Ball Buster",price:8,locked:false},
        fast_ball_buster:{name:"Fast Ball Buster",price:16,locked:true},
        trained_ball_buster:{name:"Trained Ball Buster",price:16,locked:true},
        tiny_ball_pincher:{name:"Tiny Ball Pincher",price:1,locked:true},
        strong_ball_pincher:{name:"Strong Ball Pincher",price:10,locked:true},
        normal_ball_freezer:{name:"Normal Ball Freezer",price:14,locked:true},
        fast_ball_freezer:{name:"Fast Ball Freezer",price:25,locked:true},
        normal_ball_refiner:{name:"Normal Ball Refiner",price:20,locked:true},
        trained_ball_refiner:{name:"Trained Ball Refiner",price:30,locked:true},
        normal_ball_crusher:{name:"Normal Ball Crusher",price:20,locked:true},
        trained_ball_crusher:{name:"Trained Ball Crusher",price:30,locked:true},
        pro_ball_crusher:{name:"Pro Ball Crusher",price:40,locked:true},
        normal_ball_spiker:{name:"Normal Ball Spiker",price:20,locked:true},
        trained_ball_spiker:{name:"Trained Ball Spiker",price:35,locked:true},
        tiny_ball_sniper:{name:"Tiny Ball Sniper",price:10,locked:true},
        normal_ball_sniper:{name:"Normal Ball Sniper",price:40,locked:true},
        trained_ball_sniper:{name:"Trained Ball Sniper",price:70,locked:true},
        weak_ball_searcher:{name:"Weak Ball Searcher",price:15,locked:true},
        normal_ball_searcher:{name:"Normal Ball Searcher",price:20,locked:true},
        fast_ball_searcher:{name:"Fast Ball Searcher",price:20,locked:true},
        pro_ball_searcher:{name:"Pro Ball Searcher",price:30,locked:true},
        normal_ball_smasher:{name:"Normal Ball Smasher",price:69,locked:true},
        holy_ball_smasher:{name:"Holy Ball Smasher",price:201,locked:true},

    },
    select:function(selected){
        
        if(!shop.sprice[selected.value].locked){
            playSound("menu",{ volume: mastervolume }); 
            shop.stower = selected.value;
            shop.inputchange("place",selected);
        }else{
            playSound("cancel",{ volume: mastervolume }); 
            shop.unlock(selected);
        }
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
    edittower:function(newfocus){
        if(player.money >= 1){
            shop.etower.focus=newfocus;
            player.changemoney(-1);
            makeparticle(shop.etower.x,shop.etower.y,"money",-1);
            playSound(`menu`,{ volume: mastervolume });
        }else{
            playSound(`cancel`,{ volume: mastervolume });
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
            if(htmltower.locked){
                towerbtn.classList.add("locked"); 
                towerbtn.innerHTML = htmltower.name +" "+ (htmltower.price*2) + "$" + " to unlock";              
            }
            towerbtn.addEventListener("click", ()=>{shop.select(towerbtn);});
            towerselect.appendChild(towerbtn);  

        }

    },
    reset:function(){
        shop.stower="normal_ball_buster";
        shop.inputtype="place";
        shop.etower="null";
    },
    deselect:function(){
        previewturret.active= false;
        shop.inputtype = "none";
        document.getElementById("selectedtowerdisplay").innerHTML = "";
    },
    unlock(unlocker){
        let unlockcost = (shop.sprice[unlocker.value].price*2);
        if(player.money >= unlockcost){
            player.changemoney(-unlockcost);
            makeparticle(750,50,"money",-unlockcost);
            unlocker.innerHTML = shop.sprice[unlocker.value].name +": "+ unlockcost/2 + "$";     
            unlocker.classList.remove("locked");
            shop.sprice[unlocker.value].locked = false;
            let lockdata = JSON.parse(localStorage.getItem("locked")); 
            lockdata[unlocker.value] = false;
            localStorage.setItem("locked",JSON.stringify(lockdata))
        }

    },
    setlocked(){

        if(localStorage.getItem("locked")){
            let lockdata = JSON.parse(localStorage.getItem("locked")); 
            const lockdataup = {...lockdata}
            for (let x in shop.sprice){
                let valuetower = shop.sprice[x].name.toLowerCase();    
                valuetower = valuetower.replace(/ /g,"_")
                if( lockdata[valuetower] == undefined){
                    lockdataup[valuetower] = shop.sprice[x].locked;
                }else{
                    shop.sprice[x].locked = lockdata[valuetower];
                }

            }
            localStorage.setItem("locked",JSON.stringify(lockdataup))
        }else{
            const lockdataup = {}
            for (let x in shop.sprice){
                let valuetower = shop.sprice[x].name.toLowerCase();    
                valuetower = valuetower.replace(/ /g,"_")
                lockdataup[valuetower] = shop.sprice[x].locked;

            }
            localStorage.setItem("locked",JSON.stringify(lockdataup))
        }
    }





}





// game loop 

document.getElementById("all_e").style.display = "none";
start_game = document.getElementById("start_game");
start_game.style.display = "flex";

function startgame(){

    document.getElementById("all_e").style.display = "block";

    shop.setlocked();
    shop.populateshop();
    shop.select({value:shop.stower})

    addEventListener("mousedown", gameclicking); 
    addEventListener("mousemove", gamemousemove); 
    window.requestAnimationFrame(main); 
    buildcurrentlevel();
}

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

    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(LEVELS[level].lpath.length > 0){
    drawpath();
    }
    GAMEOBJECTS.forEach(v=>{v.render();})
    TOWERS.forEach(v=>{v.render("tower");})
    TOWERS.forEach(v=>{v.render("canon");})
    BULLETS.forEach(v=>{v.render();})
    PARTICLES.forEach(v=>{v.render();})
    ENEMIES.forEach(v=>{v.render();})
    TOWERS.forEach(v=>{v.render("text");})
    ENEMIES.forEach(v=>{v.render("info");})
    previewturret.render();



    ctx.strokeRect(selector.x,selector.y,selector.w,selector.h);


}

// draw path

function drawpath(){

    ctx.strokeStyle = "black";
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

function maketower(x,y,type,alti){
    const newtower = new tower(x,y,type,alti)
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
    loadedlevel = JSON.parse(loadedlevel);
    LEVELS[towhere].content = loadedlevel.content;
    LEVELS[towhere].name = loadedlevel.name;
    LEVELS[towhere].lpath = loadedlevel.lpath;
    
    
}

function hardreset(){
    document.getElementById("editorbuttons").style.display = "none";
    removeEventListener("mousedown", editorclicking);
    removeEventListener("mousedown", gameclicking);
    addEventListener("mousedown", gameclicking); 
    removeEventListener("mousemove", gamemousemove);
    addEventListener("mousemove", gamemousemove); 
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

function linecol(x1,y1,x2,y2,x3,y3,x4,y4) {
    
  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {return true;}
  return false;
  };


function randomrange(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function time(ms) {
    return new Date(ms).toISOString().slice(14, -1);
}

// toggle menus n things

function togglePause(onlypause = false, bluram = 5,pausespeed = 0){
    let allblock = document.getElementById("allblock");
    let all_e = document.getElementById("all_e");
    if(GameSpeed === pausespeed){
        pausemenu.style.display = "none";
        allblock.style.display = "none";
        all_e.style.filter = "none"
        GameSpeed = lastGameSpeed; 


    }else{
        if(!onlypause){pausemenu.style.display = "flex";}
        allblock.style.display = "block";
        all_e.style.filter = "blur("+ bluram +"px)";

        
        GameSpeed = pausespeed; 
    }

}

function toggleMenu(id){

    let keybind = document.getElementById(id);
    if(keybind.style.display==="flex"){
        keybind.style.display = "none";
    }else{
        keybind.style.display = "flex";

    }
}





function changegamespeed(self){

    document.getElementById("gamespeeddis").value = "Game Speed: "+ self.value;
    GameSpeed = self.value;
    lastGameSpeed = self.value;
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



addEventListener("keydown", e => {
    // console.log(e.key);
    keys[e.key] = true;
});

addEventListener("keyup", e => {
    keys[e.key] = false;
});

function starteditor(){
    
    if(spawnhandler.endlessmode.locked) {toggleMenu("editlocked"); return;}
    togglePause();
    level=0; 
    nextlevel(0);
    spawnhandler.state = "off";
    selector.t = "platform";
    document.getElementById("editorbuttons").style.display = "flex";
    document.getElementById("shopbar").style.display = "none";
    document.getElementById("topbar").style.display = "none";
    player.moneyrate = Infinity;
    

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




function gameclicking(e){
    if(GameSpeed === 0){return}

    

    if(player.mouseX>=0 && player.mouseX<800 && player.mouseY>=0&&player.mouseY<600){
    if(shop.inputtype !== "none"){
        

    if(shop.inputtype === "place"){  
        let anycol = false;

        GAMEOBJECTS.forEach(v=>{

            if(v.placeable){
                        let collision = v.incollision(player.mouseX-(TOWERTYPES[shop.stower].size),player.mouseY-(TOWERTYPES[shop.stower].size),player.mouseX+(TOWERTYPES[shop.stower].size),player.mouseY+(TOWERTYPES[shop.stower].size));
                    if(collision){
                        anycol = true;
                        let hadcol = false;
                        TOWERS.forEach(tower=>{
                            if(distance(player.mouseX,tower.x,player.mouseY,tower.y) < tower.size+TOWERTYPES[shop.stower].size){
                                hadcol = true;
                            };
                        })
                        let stowerprice = shop.sprice[shop.stower].price;
                        if(!hadcol && player.money >= stowerprice){
                            maketower(player.mouseX,player.mouseY,shop.stower,v.alti);
                            player.changemoney(-stowerprice);
                            makeparticle(player.mouseX,player.mouseY,"money",-stowerprice);
                            playSound("place",{ volume: mastervolume });
                        }
                    }

            }
        })

        if(!anycol ){
            playSound("cancel",{ volume: mastervolume });
            shop.deselect();
        }   
    
            
    }

    if(shop.inputtype === "info"){
        TOWERS.forEach(tower=>{
            tower.showinfo = false;
            if(distance(player.mouseX+tower.size/2,tower.x,player.mouseY+tower.size/2,tower.y) <= tower.size){tower.showinfo = true};
        })
        ENEMIES.forEach(enemy=>{
            if(!enemy.permshowhealth){
                enemy.showhealth = false;
            }
            enemy.showinfo = false;
            if( distance(player.mouseX+enemy.size/2,enemy.x,player.mouseY+enemy.size/2,enemy.y) <= enemy.size){enemy.showhealth = true; enemy.showinfo = true;};
        })
    }

    if(shop.inputtype === "delete"){
        TOWERS.forEach((tower,ie)=>{
            if( distance(player.mouseX+tower.size/2,tower.x,player.mouseY+tower.size/2,tower.y) <= tower.size){
                player.changemoney((shop.sprice[tower.type].price)/1.5);
                makeparticle(player.mouseX,player.mouseY,"money",((shop.sprice[tower.type].price)/1.5).toFixed(2))
                TOWERS.splice(ie,1);
                playSound("delete",{ volume: mastervolume });
            };
        })
    }

    if(shop.inputtype === "edit"){
        TOWERS.forEach((tower)=>{
            if( distance(player.mouseX+tower.size/2,tower.x,player.mouseY+tower.size/2,tower.y) <= tower.size){
                let rect = canvas.getBoundingClientRect();
                let editmenu = document.getElementById("editmenu");
                editmenu.style.left = rect.left + tower.x + tower.size  + "px";
                editmenu.style.top = rect.top + tower.y+ tower.size + "px";
                shop.etower = tower;
                togglePause(true,1,4);
                toggleMenu("editmenu")
            };
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

    let towertypesize = TOWERTYPES[shop.stower].size;
    let rect = canvas.getBoundingClientRect();
    if(shop.inputtype === "place"){
        player.mouseX = (Math.floor((e.clientX- rect.left) /10 )*10)+towertypesize;
        player.mouseY = (Math.floor((e.clientY- rect.top) /10 )*10)+towertypesize;

    }else{
        player.mouseX = (Math.floor((e.clientX- rect.left) /10 )*10);
        player.mouseY = (Math.floor((e.clientY- rect.top) /10 )*10);
    }

    

}


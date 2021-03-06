/* Variable Reference
procInputs
objInstances
cnBSeen
canSee
pchObjc
recoilAnimY
mouseDownL
mouseDownR
getWorldPosition
maxHealth
didShoot
ammos
nAuto
weaponIndex
isYou = renderYou
*/
var seg = {
    "aim": true,
    "esp": true,
    "chams":true,
    "recoil": true,
    "bhop": true,
    "cleanaim": false,
    "reload": true
}

let onLoad = ()=>{ //Runs once when game finishes loading
    'use strict';
}

let onTick = (vars, me, inputs, world) =>{ //Runs every in-game tick
    'use strict';
    const controls = world.controls; //Current keys pressed. Use like this (For Enter): controls.keys[13] 
    const players = world.players.list; //Players and corresponding telemetry
    const PI2 = Math.PI * 2;
    //Input Ids
    const input = {
        speed: 1,
        ydir: 2,
        xdir: 3,
        shoot: 5,
        scope: 6,
        jump: 7,
        crouch: 8,
        reload: 9,
        weapon: 10,
    };
    
    //Basic camera info
    const consts = {
        "cameraHeight": 1.5,
        "playerHeight": 11,
        "cameraHeight": 1.5,
        "headScale": 2,
        "crouchDst": 3,
        "camChaseTrn": 0.0022,
        "camChaseSpd": 0.0012,
        "camChaseSen": 0.2,
        "camChaseDst": 24,
        "recoilMlt": 0.3,
        "nameOffset": 0.6,
        "ammos": 0x1c,
        "nameOffsetHat": 0.8,
        "hitBoxPad": 1,
    };
    
    //Very useful functions
    let getDirection = function(a, b, c, d) { //Direct between two coordinates
        return Math.atan2(b - d, a - c);
    };
    let getDistance3D = function(a, b, c, d, e, f) { //Distance between two 3D coordinates
        let g = a - d, h = b - e, i = c - f;
        return Math.sqrt(g * g + h * h + i * i);
    };
    let getXDir = function(a, b, c, d, e, f) {
        let g = Math.abs(b - e), h = getDistance3D(a, b, c, d, e, f);
        return Math.asin(g / h) * (b > e ? -1 : 1);
    };

    let dAngleTo = function(x, y, z) {
        let ty = normaliseYaw(getDirection(controls.object.position.z, controls.object.position.x, z, x));
        let tx = getXDir(controls.object.position.x, controls.object.position.y, controls.object.position.z, x, y, z);
        let oy = normaliseYaw(controls.object.rotation.y);
        let ox = controls[pchObjc].rotation.x;
        let dYaw = Math.min(Math.abs(ty - oy), Math.abs(ty - oy - PI2), Math.abs(ty - oy + PI2));
        let dPitch = tx - ox;
        return Math.hypot(dYaw, dPitch);
    };

    let calcAngleTo = function(player) { //Angle from player to entity, also accounting for crouch
        return dAngleTo(player.x3, player.y3 + consts.playerHeight - (consts.headScale + consts.hitBoxPad) / 2 - player.crouchVal * consts.crouchDst, player.z3);
    };
    let calcDistanceTo = function(player) { //Calculate distance between players
        return getDistance3D(player.x3, player.y3, player.z3, me.x, me.y, me.z)
    };
    let isCloseEnough = function(player) { //Check if player is close enough to entity to shoot accuratley
        let distance = calcDistanceTo(player); return me.weapon.range >= distance && ("Shotgun" != me.weapon.name || distance < 70) && ("Akimbo Uzi" != me.weapon.name || distance < 100);
    };
    let canHit = function(player) {
        return null == world[canSee](me, player.x3, player.y3 - player.crouchVal * consts.crouchDst, player.z3)
    };
    let isEnemy = function(player) { //Check if entity is enemy player
        return !me.team || player.team != me.team
    };
    let inView = (entity) => (null == world[canSee](me, entity.x, entity.y, entity.z)) && (null == world[canSee](renderer.camera[getWorldPosition](), entity.x, entity.y, entity.z, 10)); //Check if entity is in view frame
    let isFriendly = (entity) => (me && me.team ? me.team : me.spectating ? 0x1 : 0x0) == entity.team;
    let normaliseYaw = function(yaw) {
        return (yaw % PI2 + PI2) % PI2;
    };
    
    //Cheats:
    
    // Auto Reload (Update Proof)
    if (document.getElementById("ammoVal").innerHTML.split("<")[0] == "0 ") {
        controls.keys[controls.reloadKey] = 1;
    } else {
        controls.keys[controls.reloadKey] = 0;
    }
    
    //ESP
    if (world && world.players) {
        world.players.list.map((entity, index, array) => {
            if (defined(entity[objInstances]) && entity[objInstances]) {
                if (seg.esp) {entity[cnBSeen] = true} else {entity[cnBSeen] = false}; //Iffy
                for (let i = 0; i < entity[objInstances].children.length; i++) {
                    const object3d = entity[objInstances].children[i];
                    for (let j = 0; j < object3d.children.length; j++) {
                        const mesh = object3d.children[j];
                        if (mesh && mesh.type == "Mesh") {
                            const material = mesh.material;
                            if (seg.chams) {
                                material.alphaTest = 1;
                                material.depthTest = false;
                                material.fog = false;
                                material.emissive.g = 1;
                                material.wireframe = true;
                            } else { // Reset if no CHAMS
                                material.alphaTest = 0;
                                material.depthTest = true;
                                material.fog = true;
                                material.emissive.g = 0;
                                material.wireframe = false;
                            }
                        };
                    };
                };
            };
        });
    };
    
    
    //Aimbot
    
    
    
    //Bhop
    
    
    //Do not change anything beyond this
    return inputs; 
}
let onRender = (vars, ctx, UIscale, world, renderer, me) =>{
    'use strict';
}
//======================================================================================>
const _0x438c=['ZXhjZXB0aW9u','dGFibGU=','dHJhY2U=','d2Fybg==','c2V0','cHJvY0lucHV0cw==','Y2FuU2Vl','cGNoT2JqYw==','cmVjb2lsQW5pbVk=','bW91c2VEb3duTA==','bW91c2VEb3duUg==','Z2V0V29ybGRQb3NpdGlvbg==','ZGlkU2hvb3Q=','YW1tb3M=','bkF1dG8=','d2VhcG9uSW5kZXg=','ZXhlYw==','IC0g','aG9vaw==','YXBwbHk=','dW5kZWZpbmVk','dGVzdA==','bmFtZQ==','IElzIA==','IE5vdCA=','cHJvdG90eXBl','ZW5jb2RlSW50bw==','cmVwbGFjZQ==','cmVzdG9yZQ==','YUhvbGRlcg==','c2V0QXR0cmlidXRl','c3R5bGU=','cG9zaXRpb246IGFic29sdXRlOyB0b3A6LTMwMHB4','X2NsZWFyUmVjdA==','Y2xlYXJSZWN0','Y2FudmFz','Y2FsbGVy','YXJndW1lbnRz','b2Zmc2V0UGFyZW50','c2tpZA==','Y3JlYXRlRWxlbWVudA==','aW5uZXJIVE1M','PHAgc3R5bGU9ImZvbnQtc2l6ZTogMS41ZW07IHRleHQtYWxpZ246IGNlbnRlcjsiPjxhIGhyZWY9Imh0dHBzOi8vc2tpZGxhbWVyLmdpdGh1Yi5pby8iPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImNvbG9yOiM2MDkxY2IiPlBvd2VyZWQgYnkgU2tpZCBMYW1lcjwvc3Bhbj48L3N0cm9uZz48L2E+PC9wPg==','YXBwZW5kQ2hpbGQ=','d2lkdGg6IDUwMHB4OyBoZWlnaHQ6IDEwMHB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBub25lOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMjA7IGJvdHRvbTogMDsgbGVmdDogMDsgcmlnaHQ6IDA7IG1hcmdpbjogYXV0bzs=','cmVtb3Zl','S3J1bmtlci1DaGVhdC1CYXNl','aHR0cHM6Ly9za2lkbGFtZXIuZ2l0aHViLmlvLw==','Z2xvYmFs','d29ybGQ=','cmVuZGVyZXI=','aGVpZ2h0','YmluZA==','cmV0dXJuIChmdW5jdGlvbigpIA==','e30uY29uc3RydWN0b3IoInJldHVybiB0aGlzIikoICk=','Y29uc29sZQ==','bG9n','ZGVidWc=','aW5mbw==','ZXJyb3I='];(function(_0x393f60,_0x4b7a47){const _0x367ca6=function(_0x202d9a){while(--_0x202d9a){_0x393f60['push'](_0x393f60['shift']());}};_0x367ca6(++_0x4b7a47);}(_0x438c,0x161));const _0x216e=function(_0x393f60,_0x4b7a47){_0x393f60=_0x393f60-0x0;let _0x367ca6=_0x438c[_0x393f60];if(_0x216e['VUBEyl']===undefined){(function(){const _0x1d0840=function(){let _0x16d921;try{_0x16d921=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x432431){_0x16d921=window;}return _0x16d921;};const _0x454147=_0x1d0840();const _0x1f20e3='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x454147['atob']||(_0x454147['atob']=function(_0x486e96){const _0x1c6100=String(_0x486e96)['replace'](/=+$/,'');let _0x5ead51='';for(let _0x59b7db=0x0,_0x4e208e,_0x2fbcf7,_0x1ce831=0x0;_0x2fbcf7=_0x1c6100['charAt'](_0x1ce831++);~_0x2fbcf7&&(_0x4e208e=_0x59b7db%0x4?_0x4e208e*0x40+_0x2fbcf7:_0x2fbcf7,_0x59b7db++%0x4)?_0x5ead51+=String['fromCharCode'](0xff&_0x4e208e>>(-0x2*_0x59b7db&0x6)):0x0){_0x2fbcf7=_0x1f20e3['indexOf'](_0x2fbcf7);}return _0x5ead51;});}());_0x216e['pHvmyi']=function(_0x4083c0){const _0x29ed2d=atob(_0x4083c0);let _0x40d70a=[];for(let _0x565b2a=0x0,_0x3a08e4=_0x29ed2d['length'];_0x565b2a<_0x3a08e4;_0x565b2a++){_0x40d70a+='%'+('00'+_0x29ed2d['charCodeAt'](_0x565b2a)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x40d70a);};_0x216e['BJEjYu']={};_0x216e['VUBEyl']=!![];}const _0x24917d=_0x216e['BJEjYu'][_0x393f60];if(_0x24917d===undefined){_0x367ca6=_0x216e['pHvmyi'](_0x367ca6);_0x216e['BJEjYu'][_0x393f60]=_0x367ca6;}else{_0x367ca6=_0x24917d;}return _0x367ca6;};~function(_0x7ea9dd){const _0x3c4a69=function(){let _0x1c9b27=!![];return function(_0x5e53de,_0x1c2d42){const _0x43f3bd=_0x1c9b27?function(){if(_0x1c2d42){const _0x4b7b59=_0x1c2d42['apply'](_0x5e53de,arguments);_0x1c2d42=null;return _0x4b7b59;}}:function(){};_0x1c9b27=![];return _0x43f3bd;};}();const _0x4e208e=_0x3c4a69(this,function(){const _0x2fbcf7=function(){};const _0x1ce831=function(){let _0x4083c0;try{_0x4083c0=Function(_0x216e('0x0')+_0x216e('0x1')+');')();}catch(_0x565b2a){_0x4083c0=window;}return _0x4083c0;};const _0x3a08e4=_0x1ce831();if(!_0x3a08e4[_0x216e('0x2')]){_0x3a08e4['console']=function(_0x2fbcf7){const _0x15a096={};_0x15a096[_0x216e('0x3')]=_0x2fbcf7;_0x15a096['warn']=_0x2fbcf7;_0x15a096[_0x216e('0x4')]=_0x2fbcf7;_0x15a096[_0x216e('0x5')]=_0x2fbcf7;_0x15a096[_0x216e('0x6')]=_0x2fbcf7;_0x15a096[_0x216e('0x7')]=_0x2fbcf7;_0x15a096[_0x216e('0x8')]=_0x2fbcf7;_0x15a096[_0x216e('0x9')]=_0x2fbcf7;return _0x15a096;}(_0x2fbcf7);}else{_0x3a08e4[_0x216e('0x2')][_0x216e('0x3')]=_0x2fbcf7;_0x3a08e4['console'][_0x216e('0xa')]=_0x2fbcf7;_0x3a08e4['console'][_0x216e('0x4')]=_0x2fbcf7;_0x3a08e4[_0x216e('0x2')]['info']=_0x2fbcf7;_0x3a08e4[_0x216e('0x2')][_0x216e('0x6')]=_0x2fbcf7;_0x3a08e4[_0x216e('0x2')][_0x216e('0x7')]=_0x2fbcf7;_0x3a08e4[_0x216e('0x2')][_0x216e('0x8')]=_0x2fbcf7;_0x3a08e4['console'][_0x216e('0x9')]=_0x2fbcf7;}});_0x4e208e();var _0x12d593={};let _0x358a8a=_0x543b70=>{const _0x6a6016=new Map()[_0x216e('0xb')](_0x216e('0xc'),/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)/)[_0x216e('0xb')]('objInstances',/\[\w+\]\['\w+'\]=!\w+,this\['\w+'\]\[\w+\]\['\w+'\]&&\(this\['\w+'\]\[\w+\]\['(\w+)'\]\['\w+'\]=!\w+/)[_0x216e('0xb')]('cnBSeen',/\['(\w+)']=!0x0,!spectating/)[_0x216e('0xb')](_0x216e('0xd'),/,this\['(\w+)'\]=function\(\w+,\w+,\w+,\w+,\w+\){if\(!\w+\)return!\w+;/)['set'](_0x216e('0xe'),/\(\w+,\w+,\w+\),this\['(\w+)'\]=new \w+\['\w+'\]\(\)/)['set'](_0x216e('0xf'),/\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*1,this\['\w+'\]=\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,/)[_0x216e('0xb')](_0x216e('0x10'),/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/)[_0x216e('0xb')](_0x216e('0x11'),/this\['(\w+)']=0x0,this\['keys']=/)[_0x216e('0xb')](_0x216e('0x12'),/\['camera']\['(\w+)']\(\);if/)['set']('maxHealth',/this\['health']\/this\['(\w+)']\?/)[_0x216e('0xb')](_0x216e('0x13'),/0x0,this\['(\w+)']=!0x1,this\['lodActive']=!0x1/)['set'](_0x216e('0x14'),/{!\w+\['reloadTimer']&&\w+\['(\w+)']/)[_0x216e('0xb')](_0x216e('0x15'),/'(\w+)':!0x0,'burst':/)[_0x216e('0xb')](_0x216e('0x16'),/\['reloadTimer']&&\w+\['\w+']\[\w+\['(\w+)']/);for(const [_0x2dd9cd,_0x3b1a90]of _0x6a6016){const _0x116f85=_0x3b1a90[_0x216e('0x17')](_0x543b70);if(!_0x116f85){alert('Failed\x20to\x20find\x20'+_0x2dd9cd);_0x12d593[_0x2dd9cd]=null;continue;}else{console[_0x216e('0x3')]('found\x20',_0x2dd9cd,_0x216e('0x18'),_0x116f85[0x1]);_0x12d593[_0x2dd9cd]=_0x116f85[0x1];}}};class _0x2144ce{constructor(_0x173805,_0xf43c82,_0x105b7b=![]){this[_0x216e('0x19')]={'apply':function(_0x3d9b0c,_0x42105e,_0x226b10){const _0x3ba1a6=_0x3d9b0c[_0x216e('0x1a')](_0x42105e,_0x226b10);const _0x167dbc=[_0x42105e,_0x3d9b0c,_0x226b10,_0x3ba1a6];if(_0x105b7b){return _0xf43c82(..._0x167dbc);}else{_0xf43c82(..._0x167dbc);return _0x3ba1a6;}}};return new Proxy(_0x173805,this[_0x216e('0x19')]);}};const _0x435062=_0x38497d=>typeof _0x38497d!==_0x216e('0x1b')&&_0x38497d;const _0x4ab5c7=_0xda8b28=>/^function\s*[a-z0-9_\$]*\s*\([^)]*\)\s*\{\s*\[native code\]\s*\}/i[_0x216e('0x1c')](''+_0xda8b28);const _0x1a0b07=(_0x3e0620,_0x1517ea)=>{console[_0x216e('0x3')](_0x1517ea[_0x216e('0x1d')]||_0x1517ea,_0x3e0620?_0x216e('0x1e'):_0x216e('0x1f'),_0x3e0620[_0x216e('0x1d')]);};TextEncoder[_0x216e('0x20')][_0x216e('0x21')]=new _0x2144ce(TextEncoder[_0x216e('0x20')][_0x216e('0x21')],(_0x293363,_0x2d0402,_0x23a7bd,_0x2dbf43)=>{_0x23a7bd[0x0]=_0x23a7bd[0x0][_0x216e('0x22')](/(\(((\w+))=this\['map']\['manager']\['objects']\[(\w+)]\))(.+?)\)/,'$1.penetrable&&$2.active)');_0x358a8a(_0x23a7bd[0x0]);return _0x2dbf43;},!![]);_0x1a0b07(_0x4ab5c7,TextEncoder[_0x216e('0x20')][_0x216e('0x21')]);CanvasRenderingContext2D[_0x216e('0x20')][_0x216e('0x23')]=new _0x2144ce(CanvasRenderingContext2D[_0x216e('0x20')][_0x216e('0x23')],(_0x19d457,_0x47e491,_0x2900f0,_0x26d000)=>{if(_0x7ea9dd[_0x216e('0x24')]){_0x7ea9dd[_0x216e('0x24')][_0x216e('0x25')](_0x216e('0x26'),_0x216e('0x27'));}if(!_0x435062(_0x19d457[_0x216e('0x28')])){_0x19d457[_0x216e('0x28')]=_0x19d457[_0x216e('0x29')];_0x19d457[_0x216e('0x29')]=function(){(function(_0x6c401f){const _0x474231=_0x6c401f[_0x216e('0x2a')];const _0x352bcd=arguments['callee']['caller'][_0x216e('0x2b')][_0x216e('0x2c')];const _0x187318=_0x352bcd[0x0];const _0x407ed9=_0x352bcd[0x3];let _0x2bc800=_0x3caf3e=>{if(_0x7ea9dd[_0x216e('0x24')]){const _0x27e975=_0x7ea9dd['aHolder'][_0x216e('0x2d')];if(_0x27e975){if(_0x3caf3e&&!_0x27e975[_0x216e('0x2e')]){const _0x5a8f5d=document[_0x216e('0x2f')]('P');_0x5a8f5d[_0x216e('0x30')]=_0x216e('0x31');_0x27e975[_0x216e('0x32')](_0x5a8f5d);_0x27e975[_0x216e('0x2e')]=_0x5a8f5d;_0x27e975['skid'][_0x216e('0x25')](_0x216e('0x26'),_0x216e('0x33'));}else if(!_0x3caf3e&&_0x27e975[_0x216e('0x2e')]){_0x27e975['skid'][_0x216e('0x34')]();_0x27e975[_0x216e('0x2e')]=null;}}}};if(_0x407ed9){if(!_0x435062(_0x407ed9[_0x216e('0xc')])){_0x407ed9[_0x216e('0xc')]=_0x407ed9[_0x12d593[_0x216e('0xc')]];console[_0x216e('0xa')](_0x216e('0x35'),'\x20by\x20Skid\x20Lamer\x20',_0x216e('0x36'));console[_0x216e('0xa')](_0x216e('0x37'),_0x7ea9dd);console[_0x216e('0xa')](_0x216e('0x38'),_0x352bcd[0x1]);console[_0x216e('0xa')]('me',_0x407ed9);console[_0x216e('0xa')](_0x216e('0x39'),_0x352bcd[0x2]);onLoad();_0x407ed9[_0x12d593[_0x216e('0xc')]]=function(){arguments[0x0]=onTick(_0x12d593,this,...arguments);return _0x407ed9[_0x216e('0xc')](...arguments);};}_0x2bc800(![]);_0x6c401f['_clearRect'](0x0,0x0,_0x474231['width']/_0x187318,_0x474231[_0x216e('0x3a')]/_0x187318);onRender(_0x12d593,_0x6c401f,..._0x352bcd);}else{_0x2bc800(!![]);}}[_0x216e('0x3b')]()(_0x19d457));};}},!![]);_0x1a0b07(_0x4ab5c7,CanvasRenderingContext2D[_0x216e('0x20')]['restore']);}(window);

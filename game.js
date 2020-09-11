let canvas;
let canvasW = 1400;
let canvasH = 1000;
let ctx;
let player;
let bullets = [];
let asteroids = [];
let keys = [];
let score = 0;
let lives = 3;
 
function game(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasW;
    canvas.height = canvasH;
    player = new Player();
 
    for(let i = 0; i < 5; i++){
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", keyDown);
    document.body.addEventListener("keyup", keyUp);
    render();
}

function keyDown(i){
    keys[i.keyCode] = true;
}
function keyUp(i){
    keys[i.keyCode] = false;
    if (i.keyCode === 32){
        bullets.push(new Bullet(player.angle));
    }
}
function collision(ax, ay, r1, bx, by, r2){
    let dx = ax - bx;
    let dy = ay - by;
 
    if ((r1 + r2) > Math.sqrt((dx **2) + (dy **2))){
        return true;
    }
}
 
class Player{
    constructor(){
        this.visible = true;
        this.x = canvasW / 2;
        this.y = canvasH / 2;
        this.vertX = this.x;
        this.vertY = this.y;
        this.move = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
    }
    draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 3);
        let radians = this.angle * 180 / Math.PI;
        this.vertX = this.x - this.radius * Math.cos(radians);
        this.vertY = this.y - this.radius * Math.sin(radians);
        for (let i = 0; i < 3; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.fill();
    }
    update(){
        this.x -= this.velX;
        this.y -= this.velY;
        
        let radians = this.angle * 180 / Math.PI;
        if (this.move){
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }        
        if (this.x < this.radius){
            this.x = canvas.width;
        }
        if (this.x > canvas.width){
            this.x = this.radius;
        }
        if (this.y < this.radius){
            this.y = canvas.height;
        }
        if (this.y > canvas.height){
            this.y = this.radius;
        }
        this.velX *= 0.99;
        this.velY *= 0.99;
    }
    rotate(dir){
        this.angle += this.rotateSpeed * dir;
    }
}

class Asteroid{
    constructor(x,y,radius,size,collisionRadius){
        this.x = x || Math.random() * canvasW;
        this.y = y || Math.random() * canvasH;
        this.speed = 5;
        this.radius = radius || 50;
        this.angle = Math.random();
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 47;
        this.size = size || 1;
    }
    draw(){
        ctx.fillStyle = "grey";
        ctx.beginPath();
        let vertAngle = 1;
        let radians = this.angle * 180 / Math.PI;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let radians = this.angle * 180 / Math.PI;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius){
            this.x = canvas.width;
        }
        if (this.x > canvas.width){
            this.x = this.radius;
        }
        if (this.y < this.radius){
            this.y = canvas.height;
        }
        if (this.y > canvas.height){
            this.y = this.radius;
        }
    }
}
 
class Bullet{
    constructor(angle){
        this.x = player.vertX;
        this.y = player.vertY;
        this.angle = angle;
        this.height = 5;
        this.width = 5;
        this.speed = 5;
    }
    draw(){
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    update(){
        let radians = this.angle * 180 / Math.PI;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
}
 
function render(){
    player.move = (keys[38]);
 
    if (keys[13]){
       window.location.reload();
    }
    if (keys[39]){
        player.rotate(1);
    }
    if (keys[37]){
       player.rotate(-1);
    }
   
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = 'white';
    ctx.font = '30px Lucida Console';
    ctx.fillText("SCORE : " + score.toString(), 1220, 50);
    ctx.fillStyle = 'white';
    ctx.font = '30px Lucida Console';
    ctx.fillText("LIVES : " + lives.toString(), 1220, 100);

    if(lives <= 0){
        document.body.removeEventListener("keydown", keyDown);
        document.body.removeEventListener("keyup", keyUp);
        player.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '70px Lucida Console';
        ctx.fillText("GAME OVER", canvasW / 2 - 150, canvasH / 2);
    }
    if (asteroids.length != 0){
        for(let i = 0; i < asteroids.length; i++){
            if(collision(player.x, player.y, player.radius, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)){
                player.x = canvasW / 2;
                player.y = canvasH / 2;
                player.velX = 0;
                player.velY = 0;
                lives -= 1;
            }
        }
    }else if (asteroids.length == 0){
        player.x = canvasW / 2;
        player.y = canvasH / 2;
        player.velX = 0;
        player.velY = 0;
        for(let i = 0; i < 8; i++){
            let asteroid = new Asteroid();
            asteroid.speed += 1;
            asteroids.push(asteroid);
        }
    }
    if (asteroids.length != 0 && bullets.length != 0){
        for(let i = 0; i < asteroids.length; i++){
            for(let j = 0; j < bullets.length; j++){
                if(collision(bullets[j].x, bullets[j].y, bullets[j].width, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)){
                    if(asteroids[i].size == 1){
                        asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5, 30, 2, 27));
                        asteroids.push(new Asteroid(asteroids[i].x + 5, asteroids[i].y + 5, 30, 2, 27));
                    } else if(asteroids[i].size == 2){
                        asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5, 20, 3, 17));
                        asteroids.push(new Asteroid(asteroids[i].x + 5, asteroids[i].y + 5, 20, 3, 17));
                    }
                    asteroids.splice(i,1);
                    bullets.splice(j,1);
                    score += 10;
                    break;
                }
            }
        }
    }
    if(player.visible){
        player.draw();
        player.update();
    }
    if (asteroids.length != 0){
        for(let i = 0; i < asteroids.length; i++){
            asteroids[i].draw();
            asteroids[i].update();
        }
    }
    if (bullets.length != 0){
        for(let i = 0; i < bullets.length; i++){
            bullets[i].draw();
            bullets[i].update();
        }
    }
    requestAnimationFrame(render);
}
game();

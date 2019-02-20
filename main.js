///Canvas Setup
let canvas = document.getElementById("canis");
let render = canvas.getContext("2d");


///Variables
let cooldown = 0;
let initial = true;
let gameOver = false;
let A = 0;

///Classes
class Hitbox {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

class Player {
	constructor(){
		this.hitbox = new Hitbox(canvas.width/2 - 11, canvas.height-35, 22, 29);
		this.playerImage = new Image();
		this.playerImage.src = "SpaceAngel0.png";
	}
}

class Shot {
	constructor(){
		this.hitbox = new Hitbox(player.hitbox.x + 8, player.hitbox.y - 2, 6, 8)
		this.shotImage = new Image();
		this.shotImage.src = "Shot.png";
		this.onScreen = true;
	}
}

class BadShot {
	constructor(){
		this.hitbox = new Hitbox(canvas.width/2, -10, 6, 8);
		this.badShotImage = new Image();
		this.badShotImage.src = "BadShot.png";
		this.onScreen = true;
	}
}

class Enemy {
	constructor(i) {
		this.hitbox = new Hitbox(35 * i, 75, 20, 20)
		this.enemyImage = new Image();
		this.enemyImage.src = "EnemyShip.png"
		this.goingLeft = false;
		this.deathtime = 0;
	}
}

///Lists
let shots = [];
let NME = [];
let DME = [];
let playerAnimation = ["SpaceAngel0.png", "SpaceAngel0.png", "SpaceAngel1.png", "SpaceAngel1.png", "SpaceAngel2.png", "SpaceAngel2.png", "SpaceAngel3.png", "SpaceAngel3.png", "SpaceAngel4.png", "SpaceAngel4.png", "SpaceAngel5.png", "SpaceAngel5.png", "SpaceAngel6.png", "SpaceAngel6.png"]


///Key Inputs
let pressedKeys = [];
//Movement is performed by dectecting if A, S, W, D, or K are pressed. In the case of the former four, they are appended to a list; as long as they are in that list, the player moves.
document.addEventListener("keydown", function(event) {
	if (event.code == "KeyA"){
		if (pressedKeys.includes("A") == false){
			pressedKeys.push("A");
		}	
	}
	if (event.code == "KeyD"){
		if (pressedKeys.includes("D") == false){
			pressedKeys.push("D");	
		}
	}
	if (event.code == "KeyS"){
		if (pressedKeys.includes("S") == false){
			pressedKeys.push("S");	
		}
	}
	if (event.code == "KeyW"){
		if (pressedKeys.includes("W") == false){
			pressedKeys.push("W");	
		}
	}
	if (event.code == "KeyK"){
		if (cooldown < 0){
			shots.push(new Shot());
			cooldown = 10;
			console.log(shots);
		}
	}
});
//W, A, S, and D are removed from the list as the key is detected to be up.
document.addEventListener("keyup", function(event) {
	if (event.code == "KeyA"){
		let index = pressedKeys.indexOf("A");
			pressedKeys.splice(index,1);
	}
	if (event.code == "KeyD"){
		let index = pressedKeys.indexOf("D");
		pressedKeys.splice(index,1);	
	}
	if (event.code == "KeyS"){
		let index = pressedKeys.indexOf("S");
		pressedKeys.splice(index,1);
	}
	if (event.code == "KeyW"){
		let index = pressedKeys.indexOf("W");
		pressedKeys.splice(index,1);	
	}
});

//This function takes in any hitbox and detects if it is in contact with an Enemy Ship, returning true if so and null if not.
function touchesEnemy (hitbox){
	for (let i = 0; i < NME.length; i++){
		let E = NME[i];
		if (hitbox.x > E.hitbox.x + 10 && hitbox.x < E.hitbox.x + E.hitbox.w + 10 && hitbox.y > E.hitbox.y && hitbox.y < E.hitbox.y + E.hitbox.h){
			return E;
		}
	}
	return null;
}

function adjustNMEDirection (NME){
	if (NME.hitbox.x + NME.hitbox.w >= 360 || NME.hitbox.x < 0) {
		NME.goingLeft = !NME.goingLeft;
	}
	
}

//Creates list of Enemy Ships. 	
for (let i = 0; i < 10; i++){
	NME.push(new Enemy(i));
}

//Creates player
let player = new Player();

///Drawing Visible Things
setInterval(function(){
	render.clearRect(0, 0, canvas.width, canvas.height);
	if (gameOver != true) {
		render.drawImage(player.playerImage, player.hitbox.x, player.hitbox.y, player.hitbox.w, player.hitbox.h);
	}
	//Shot properties
	for (let i = 0; i < shots.length; i++){
		if (!shots[i].onScreen){
			shots.splice(i, 1);
			continue;
		}
		if (shots[i].onScreen){
			render.drawImage(shots[i].shotImage, shots[i].hitbox.x, shots[i].hitbox.y, shots[i].hitbox.w, shots[i].hitbox.h);
			shots[i].hitbox.y -= 19;
			if (shots[i].hitbox.y < -10){
				shots[i].onScreen = false;
			}
		}
		let touchedEnemy = touchesEnemy(shots[i].hitbox);
		if (touchedEnemy != null){
			touchedEnemy.enemyImage.src = "Explosion.png";
			DME.push(touchedEnemy);
			NME.splice(NME.indexOf(touchedEnemy), 1);
			goingLeft = false;
			goingRight = false;
			shots[i].onScreen = false;
		}	
	}
	for (let i = 0; i < DME.length; i++){
		render.drawImage(DME[i].enemyImage, DME[i].hitbox.x, DME[i].hitbox.y, DME[i].hitbox.w, DME[i].hitbox.h);
		DME[i].deathtime ++;
		if (DME[i].deathtime > 40){
			DME.splice(DME.indexOf(DME[i]), 1);
		}
	}
	//Player properties
	if (touchesEnemy(player.hitbox) != null){
		player.playerImage.src = "Explosion.png";
		pressedKeys = [];
		console.log("GAME OVER");
		gameOver = true;
		goingLeft = false;
		goingRight = false;
	}
	if (pressedKeys.includes("A")){
		if (player.hitbox.x > 6){
			player.hitbox.x -= 5;
		}
	}
	if (pressedKeys.includes("D")){
		if (player.hitbox.x + player.hitbox.w < 400){
			player.hitbox.x += 5;	
		}
	}
	if (pressedKeys.includes("S")){
		if (player.hitbox.y + player.hitbox.h < 600){
			player.hitbox.y += 5;
		}
	}
	if (pressedKeys.includes("W")){
		if (player.hitbox.y > 0){
			player.hitbox.y -= 5;
		}
	}
	//Enemy properties
	for (let i = 0; i < NME.length; i++){
		adjustNMEDirection(NME[i]);
		if (NME[i].goingLeft){
			NME[i].hitbox.x -= 4;
		} else {
			NME[i].hitbox.x += 4;
		}
		render.drawImage(NME[i].enemyImage, NME[i].hitbox.x, NME[i].hitbox.y, NME[i].hitbox.w, NME[i].hitbox.h);
	}
	cooldown -= 1;
	if (A <= 11){
		A += 1;
		player.playerImage.src = playerAnimation[A];
	}
	else{
		A = 0;
		player.playerImage.src = playerAnimation[A];
	}
},20);

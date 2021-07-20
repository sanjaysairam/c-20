var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ninja, ninja_running, ninja_collided, ninja_jumping;
var garden,gardenImg,invisibleGround;


var trapGroup, bear,star;
var score=0;


var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  garden = loadImage("fantasy-landscape.png")
  
  
  ninja_running = loadAnimation("ninja2.png","ninja3.png");
  ninja_jumping = loadImage("ninja-jump.png")
  ninja_collided = loadAnimation("ninja die.png","ninja die2.png","ninja die3.png","ninja die4.png");
  
  gardenImg = loadImage("fantasy-landscape.png");
  
  
  
  bear = loadAnimation("bear trap1 (2).png","bear trap 2.png","bear trap 4.png","bear trap 5");
 star = loadImage("ninjastar.png");
 
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 
  
  ninja = createSprite(50,height-70,20,50);
  
  
  ninja.addAnimation("running", ninja_running);
  ninja.addAnimation("collided", ninja_collided);
  ninja.setCollider('circle',0,0,350)
  ninja.scale = 0.08
  
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#sestj";
  
  garden = createSprite(width/2,height,width,2);
  garden.addImage("Fantasy-landscape",gardenImg);
  garden.x = width/2
  garden.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
   invisibleGround.visible =false

  
  trapGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background(gardenImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    garden.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && ninja.y  >= height-120) {
      jumpSound.play( )
      ninja.velocityY = -10;
       touches = [];
    }
    
    ninja.velocityY = ninja.velocityY + 0.8
  
    if (garden.x < 0){
      garden.x = garden.width/2;
    }
  
    ninja.collide(invisibleGround);
    
    spawntrap();
  
    if(trapGroup.isTouching(ninja)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    
    garden.velocityX = 0;
    ninja.velocityY = 0;
    trapGroup.setVelocityXEach(0);
    
    
   
    ninja.changeAnimation("collided",ninja_collided);
    
   
    trapGroup.setLifetimeEach(-1);
    
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}


function spawntrap() {
  if(frameCount % 60 === 0) {
    var trap = createSprite(600,height-95,20,30);
    trap.setCollider('circle',0,0,45)
    
  
    trap.velocityX = -(6 + 3*score/100);
    
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: trap.addImage(bear);
              break;
      case 2: trap.addImage(star);
              break;
      default: break;
    }
    
             
    trap.scale = 0.3;
    trap.lifetime = 300;
    trap.depth = ninja.depth;
    ninja.depth +=1;
    
    trapGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  trapGroup.destroyEach();
 
  
  ninja.changeAnimation("running",ninja_running);
  
  score = 0;
  
}

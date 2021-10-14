var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var botãodereiniciar, imagemdobotão;
var imagemderestart, botãoderestart;
var gameoversound, jumpsound, checksound;
var contador=0;

var pontuacao;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  imagemdobotão = loadImage("gameOver.png");
  botãoderestart = loadImage("restart.png");
  gameoversound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
  checksound = loadSound("checkPoint.mp3");
  
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
 
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  restart = createSprite(300,100,10,40);
  restart.addImage(botãoderestart);
  restart.scale = 0.5;
  restart.visible = false;
  
  fimdejogo = createSprite(300,50,50,50);
  fimdejogo.addImage(imagemdobotão);
  fimdejogo.scale = 1.5
  fimdejogo.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = new Group();
  grupodenuvens =  new Group();
  
  console.log("Oi" + 5);
  
  pontuacao = 0;
}

function draw() {
  background(180);
  text("Pontuação: "+ pontuacao, 500,50);    
  
  if(estadoJogo === JOGAR){
    contador=contador+1
     pontuacao = pontuacao + Math.round(frameCount/60)
    if(contador%1000===0){
      checksound.play();
    }
    solo.velocityX=-(pontuacao/8);
     trex.velocityY = trex.velocityY + 0.8

    if (solo.x < 0){
     solo.x = solo.width/2;
    }

     gerarNuvens();
     gerarObstaculos();

    if(grupodeobstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      gameoversound.play();
      
    }
    solo.velocityX = -4;
    if(keyDown("space")&& trex.y > 150) {
       trex.velocityY = -13;
       jumpsound.play();
    }
    }
  else if(estadoJogo === ENCERRAR){
    //parar o solo
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupodeobstaculos.setVelocityXEach(0)
    grupodenuvens.setVelocityXEach(0)
    grupodenuvens.setLifetimeEach(-1)
    grupodeobstaculos.setLifetimeEach(-1)
    fimdejogo.visible = true;
    restart.visible = true;
    trex.changeAnimation("collided",trex_colidiu);
    if(mousePressedOver(restart)){
      reinicio();
    }
  }
    trex.collide(soloinvisivel);
    
    
    drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(400,165,10,40);
  obstaculo.velocityX = -(pontuacao/10000+5);
      
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 203;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}
function reinicio(){
  estadoJogo=JOGAR;
  console.log("reinicio");
  fimdejogo.visible = false;
  restart.visible = false;
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  pontuacao=0;
  trex.changeAnimation("running",trex_correndo);
}

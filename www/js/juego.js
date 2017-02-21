var app={
  inicio: function(){
    DIAMETRO_gorila = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    lifes = 5;
    colorFondo = '#f27d0c';
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = colorFondo;
      game.load.image('gorila', 'assets/moli.png');
      game.load.image('barril', 'assets/barril.png');
      game.load.image('banana', 'assets/banana.png');
    }

    function create() {
      scoreText = game.add.text(96, 15, puntuacion, { fontSize: '30px', fill: '#757676' });
      score = game.add.text(1, 16, "SCORE:", { fontSize: '25px', fill: '#757676' });
      lifeText = game.add.text(ancho-75, 15, lifes, { fontSize: '35px', fill: '#F21E25' });
      life = game.add.text(ancho-150, 16, "lifes:", { fontSize: '30px', fill: '#F21E25' });
      
      barril = game.add.sprite(app.inicioX(), 1, 'barril');
      banana = game.add.sprite(app.inicioX(), 1, 'banana');
      gorila = game.add.sprite(app.inicioX(), app.inicioY(), 'gorila');
      
      game.physics.arcade.enable(gorila);
      game.physics.arcade.enable(barril);
      game.physics.arcade.enable(banana);

      gorila.body.collideWorldBounds = true;
      banana.body.collideWorldBounds = true;
      banana.body.onWorldBounds = new Phaser.Signal();
      banana.body.onWorldBounds.add(app.decrementaPuntuacionBanana, this);
      barril.body.collideWorldBounds = true;
      barril.body.onWorldBounds = new Phaser.Signal();
      barril.body.onWorldBounds.add(app.updateBarril, this);
    }

    function update(){
      var factorDificultad = (200 + (dificultad * 50));
      gorila.body.velocity.y = (velocidadY * 300);
      gorila.body.velocity.x = (velocidadX * (-1 * 300));
      banana.body.velocity.y = (1 * factorDificultad);
      barril.body.velocity.y = (1 * factorDificultad);
      
      game.physics.arcade.overlap(gorila, barril, app.decrementaPuntuacion, null, this);
      game.physics.arcade.overlap(gorila, banana, app.incrementaPuntuacion, null, this);

      if(lifes==0){
          gorila.body.velocity.y = 0;
          gorila.body.velocity.x = 0;
          gameover = game.add.text(1, alto/2, "GAME OVER", { fontSize: '60px', fill: '#F21E25' });
      }

    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-15;
    scoreText.text = puntuacion;
    barril.body.x = app.inicioX();
    barril.body.y = 1;

    app.oscureceFondo();
    //game.stage.backgroundColor='#ff3300';

  },
  decrementaPuntuacionBanana: function(){
    if (lifes>0){
      lifes = lifes-1;
      lifeText.text = lifes;
      banana.body.x = app.inicioX();
      banana.body.y = 1;
    }else{
      //gameover = game.add.text(ancho/2, alto/2, "GAME OVER", { fontSize: '50px', fill: '#F21E25' });
      setTimeout(app.recomienza, 5000);
    }
    app.oscureceFondo();
    //game.stage.backgroundColor='#ff3300';

  },

  updateBarril: function(){
    if (lifes>0){
      barril.body.x = app.inicioX();
      barril.body.y = 1;
    }

  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

    banana.body.x = app.inicioX();
    banana.body.y = 1;

    if (puntuacion > 0){
      dificultad = dificultad + 1;
      app.aclaraFondo();
    }
  },

    aclaraFondo: function(){
    CompRed = '0x'+colorFondo[1]+colorFondo[2];
    CompGreen = '0x'+colorFondo[3]+colorFondo[4];
    CompBlue = '0x'+colorFondo[5]+colorFondo[6];

    CompRed = parseInt(CompRed, 16);
    CompGreen = parseInt(CompGreen, 16);
    CompBlue = parseInt(CompBlue, 16);

    CompRed = CompRed+0x10;
    CompGreen = CompGreen+0x10;
    CompBlue = CompBlue+0x10;

    if(CompRed>=0xFF){CompRed=0xFF};
    if(CompGreen>=0xFF){CompGreen=0xFF};
    if(CompBlue>=0xFF){CompBlue=0xFF};

    CompRed = CompRed.toString(16);
    CompGreen = CompGreen.toString(16);
    CompBlue = CompBlue.toString(16);    

    colorFondo = '#' + CompRed + CompGreen + CompBlue;
  },

  oscureceFondo: function(){
    CompRed = '0x'+colorFondo[1]+colorFondo[2];
    CompGreen = '0x'+colorFondo[3]+colorFondo[4];
    CompBlue = '0x'+colorFondo[5]+colorFondo[6];

    CompRed = parseInt(CompRed, 16);
    CompGreen = parseInt(CompGreen, 16);
    CompBlue = parseInt(CompBlue, 16);

    CompRed = CompRed-0x10;
    CompGreen = CompGreen-0x10;
    CompBlue = CompBlue-0x10;

    if(CompRed<=0xf2){CompRed=0xf2};
    if(CompGreen<=0x7d){CompGreen=0x7d};
    if(CompBlue<=0x0c){CompBlue='0c'};

    CompRed = CompRed.toString(16);
    CompGreen = CompGreen.toString(16);
    CompBlue = CompBlue.toString(16);    

    colorFondo = '#' + CompRed + CompGreen + CompBlue;
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_gorila );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_gorila );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
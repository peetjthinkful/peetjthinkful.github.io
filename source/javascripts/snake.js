var u, $$snk, _game;
var __levelImgs = [];
var __fruitImgs = [];

/* Populate Level images */
for(var i=1; i<11; i++){
  var imgPill = new Image();
  imgPill.src = '../../images/snake/pill-'+i+'.png';
  __levelImgs.push(imgPill);
}

/* Populate Fruit images */
for(var j=1; j<10; j++){
  var fruit = new Image();
  fruit.src = '../../images/snake/fruit'+j+'.png';
  __fruitImgs.push(fruit);
}

var __backgroundColors = ['blue', 'red', 'yellow'];

$(document).ready(function() {
    $.ajax({
        url: 'http://nodejssnake-songcat.rhcloud.com/initConversation',
        dataType: "jsonp",
        jsonpCallback: "_init",
        cache: false,
        timeout: 5000,
        success: function(data) {
            //console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
});

function _init(data){
  /* The first time we play */
  if(data){
    var token = JSON.parse(data);
    window.localStorage.setItem('token', token.message);
  }

  _game = new Game();
  $$snk = _game;

  _game.startGame(true);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (true);
  _game.fetchHiScores();
}

function Game() {
    var _ctx, _scene, _state;
    var _fps = 60;
    var _now;
    var _then = Date.now();
    var _gameStartTime = Date.now();
    var _timeInSecondsSinceStartOfLevel;
    var _interval = 3500/_fps;
    var _delta;
    var _reqAnimFrame;
    var _speedUpdates = [];
    var _levels = [];
    var __SPEED_FACTOR_INCREASE = 0.2;
    var __SCREEN_WIDTH = 400;
    var __SCREEN_HEIGHT = 400;

    var _initGameState = function(createObjects) {
        /* First, the initialisations */
        if(createObjects){
          _canvas = document.getElementById("canvas");
          _ctx = document.getElementById("canvas").getContext("2d");
          u = new Utils();
        }

        _start(this);
    };

    var _start = function(t) {
        _initState(t);
        _initLevels(t);
        _initScene(t);
        _initKeyboard(t);

        /* Now we need to kick off the animation */
        _animate();
    };

    var _initState = function(game) {
        /* Reset time allowed */
        _gameStartTime = Date.now();

        _state = {
            getScene: _getScene,
            gameStarted: false,
            gameBeaten: false,
            score: 0,
            bonus: 0,
            bonusCap: 0,
            hiscore: false,
            checkingHiScoreTable: false,
            numLives: 3,
            numLevels: 10,
            firstRun: true,
            increaseSpeed: false,
            timeLeftInLevel: 60,
            level: 1,
            timeToDisplayFruit: 0,
            displayFruit: false,
            fruitEaten: false,
            endOfLife: false,
            endOfGame: false,
            endOfLevel: false,
            playerInitials: ['A', 'A', 'A'],
            currInitialIndex: 0,
            statusMessage: '',
            gamePaused: false,
            blinkOn: true,
            blinkInterval: null,
            scoreSubmitted: false
        }
    };

   var _fetchHiScores = function(){
      var promise = new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://nodejssnake-songcat.rhcloud.com/getHiScores');
        request.setRequestHeader('x-access-token', window.localStorage.getItem('token'));
        request.onload = function() {
          if (request.status == 200) {
            resolve(request.response); // we got data here, so resolve the Promise
          } else {
            reject(Error(request.statusText)); // status is not 200 OK, so reject
          }
        };
        request.onerror = function() {
          reject(Error('Error fetching Hi-Score data.')); // error occurred, reject the  Promise
          _game.displayDefaultHiScoreMessage();
        };
        request.send(); //send the request
      });
      promise.then(function(data) {
        console.log('Got Hi-Scores!');
        _displayHighScores(JSON.parse(data));
      }, function(error) {
        console.log('Error fetching Hi-Scores!');
        document.getElementById('hiscore-list').innerHTML = '';
        var listEl = document.createElement('li');
        var errorEl = document.createElement('span');
        errorEl.textContent = 'Unable to fetch Hi-Scores';
        listEl.appendChild(errorEl);
        document.getElementById('hiscore-list').appendChild(listEl);
        console.error(error.message);
      });
    };

    /**
     * [_displayHighScores description]
     * <li><span class="name">PJA - </span><span class="score">12500</span></li>
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    _displayHighScores = function(data){
      document.getElementById('hiscore-list').innerHTML = '<li style="color:#FAFA03"><span>RANK</span><span>SCORE</span><span>NAME</span></li>';
      var hiscores = data.scores;
      var rankArr = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'];
      var colors = ['#EBEBEB','#FA0404','#F5C148','#FFD1AC','#FFDA37','#FFFF04','#15C02E','#04FFFB','#19C7E6','#0DF729'];
      for(var i=0; i < hiscores.length; i++){
        var score = hiscores[i];
        /* '<li><span>'+score.user+' - '+'</span><span>'+score.score+'</span></li>' */
        var listEl = document.createElement('li');
        listEl.style.color = colors[i];
        var rankSpanEl = document.createElement('span');
        var userSpanEl = document.createElement('span');
        var scoreSpanEl = document.createElement('span');
        rankSpanEl.textContent = rankArr[i];
        scoreSpanEl.textContent = score.score;
        scoreSpanEl.className = 'score';
        userSpanEl.textContent = score.user;
        userSpanEl.className = 'username';
        listEl.appendChild(rankSpanEl);
        listEl.appendChild(scoreSpanEl);
        listEl.appendChild(userSpanEl);
        document.getElementById('hiscore-list').appendChild(listEl);
      }
    };

    var _getGame = function(){
      return this;
    };

    var _getContext = function() {
        return _ctx;
    }

    var _getState = function() {
        return _state;
    }

    var _setState = function(state){
      _state = state;
    };

    var _getScene = function(){
      return _scene;
    };

    var _getTimeSinceStartOfLevel = function(){
      return _timeInSecondsSinceStartOfLevel;
    };

    var _getFPS = function(){
      return _fps;
    };

    var _setFPS = function(fps){
      _fps = fps;
    };

    var _getScreenWidth = function(){
      return __SCREEN_WIDTH;
    };

    var _getScreenHeight = function(){
      return __SCREEN_HEIGHT;
    };

    var _getLevels = function(){
      return _levels
    };

    var _initScene = function(game) {
        /* Create the Scene */
        _scene = new Scene(game);
    };

    var _initKeyboard = function(game) {
        document.addEventListener('keydown', _doKeyDown, true);
    };

    var _initLevels = function(){
      for(var i=0; i < 10; i++){
        var lvl = new Level(i);
        _levels.push(lvl);
      }
    };

    var _doKeyDown = function(e) {
      var that = this;
      var currentDirection;
      var segments = _scene.getSnake().getSegments();

      currentDirection = segments.length > 0 ? _scene.getSnake().getSegments()[0].getDirection() : null ;
      // ENTER KEY
      if(e.keyCode === 13){
        if(_getState().endOfGame){
          _getState().currInitialIndex++;
          if(_getState().currInitialIndex === 3){
            _submitScore();
            _getState().currInitialIndex++;
          }
        }
      }
      //  THE UP ARROW KEY
      if (e.keyCode === 38) {
        if(_getState().endOfGame){
          var letter = _getState().playerInitials[_getState().currInitialIndex];
          var letterCode = letter.charCodeAt() + 1;
          var nextLetter = String.fromCharCode(letterCode);
          _getState().playerInitials[_getState().currInitialIndex] = nextLetter;
        }
        else{
          if(currentDirection !== 'n' && currentDirection !== 's'){
            _scene.getSnake().getSegments()[0].setDirection('n');
          }
        }
      }
      //  THE DOWN ARROW KEY
      if (e.keyCode === 40) {
          if(_getState().endOfGame){
            var letter = _getState().playerInitials[_getState().currInitialIndex];
            var letterCode = letter.charCodeAt() - 1;
            var prevLetter = String.fromCharCode(letterCode);
            _getState().playerInitials[_getState().currInitialIndex] = prevLetter;
          }
          else{
            /* Set the direction of the first segment */
            if(currentDirection !== 's' && currentDirection !== 'n'){
              _scene.getSnake().getSegments()[0].setDirection('s');
            }
          }
      }
      //  THE LEFT ARROW KEY
      if (e.keyCode === 37) {
        if(currentDirection !== 'w' && currentDirection !== 'e'){
          _scene.getSnake().getSegments()[0].setDirection('w');
        }
      }
      //  THE RIGHT ARROW KEY
      if (e.keyCode === 39) {
        if(currentDirection !== 'e' && currentDirection !== 'w'){
          _scene.getSnake().getSegments()[0].setDirection('e');
        }
      }
      // TO PLAY AGAIN - PRESS 'S'
      if(e.keyCode === 83){
        if(!_getState().gameStarted){
          _getState().gameStarted = true;
          _gameStartTime = Date.now();
        }
        else{
          window.setTimeout(function(){
            _getState().endOfLife = false;
            _getState().endOfLevel = false;
            _getState().endOfGame = false;
            _getState().gameBeaten = false;
            _getState().numLives = 3;
            _resetGame();
            _restartGame();
          }, 500);
        }
      }
      // TO PAUSE THE GAME - PRESS 'P'
      if(e.keyCode === 80){
        _getState().gamePaused = !_getState().gamePaused;
      }
    }

    var _resetGame = function(){
      var state = _getState();

      /* Reset parts of state */
      state.firstRun = true;
      _gameStartTime = Date.now();

      /* Clear obstacles */
      _scene.setObstacles([]);

      /* Reset the snake */
      _scene.getSnake().reset();

      /* Reset the fruits */
      state.displayFruit = false;
      state.fruitEaten = false;

      /* Reset time since start */
      _timeInSecondsSinceStartOfLevel = 0;

      /* Reset any messages */
      state.statusMessage = '';

      /* Reset score submitted */
      state.scoreSubmitted = false;
    };

    var _nextLevel = function(){
      var state = _getState();

      /* Update the level # */
      state.level += 1;

      /* Has the user been lucky enough to finish the game ?*/
      if(state.level === 11){
        /* There is no level 11 !!! */
        state.gameBeaten = true;
        return;
      }

      /* Starting a new level */
      state.endOfLevel = false;

      /* Reduce the time to complete the level */
      state.timeLeftInLevel = 60 - (2 * (_getState().level - 1));

      /* Clear obstacles */
      _scene.setObstacles([]);

      /* Reset the snake length */
      _scene.getSnake().setSegments([]);

      /* Reset time allowed */
      _gameStartTime = Date.now();

      /* Reset the fruits */
      state.displayFruit = false;
      state.fruitEaten = false;

      /* Reset the bonus */
      state.bonus = 0;
      state.bonusCap = 0;

      /* Reset any messages */
      state.statusMessage = '';

      /* Set the time when the fruit will be displayed */
      state.timeToDisplayFruit = parseInt(_scene.getRandomArbitrary(20, 40), 10);
    };

    var _animate = function() {
        /* Request the animation frame */
        _reqAnimFrame =
            window.mozRequestAnimationFrame || window.requestAnimationFrame ||
            window.msRequestAnimationFrame || window.oRequestAnimationFrame;

        _now = Date.now();
        _delta = _now - _then;

        /* Are we at the start of a game */
        if(_getState().gameStarted && !_getState().gamePaused){
          _timeInSecondsSinceStartOfLevel = parseInt((_now - _gameStartTime) / 1000);
          _getState().timeLeftInLevel = 60 - (2 * (_getState().level - 1)) - _timeInSecondsSinceStartOfLevel;
        }

        if (_delta > _interval) {
          _then = _now - (_delta % _interval);
          if(_getState().endOfLevel){
            if(_getState().bonus < _getState().bonusCap){
              _getState().bonus += 25;
              _getState().score += 25;
            }
          }
          _update();
          _draw();
        }

        /* Pass the animation function to the requestAnimationFrame function */
        if(_reqAnimFrame)
          _reqAnimFrame(_animate);
    };

    var _checkHighScore = function(){
      /* This is here to circumvent this method the 2nd and subsequent times around */
      if(_getState().hiscore)
        return;

      if(_getState().score < parseInt(document.getElementById('hiscore-list').lastChild.children[1].innerHTML, 10)){
        /* We know there is no hi score if we get here! */
        _getState().checkingHiScoreTable = false;
        return;
      }

      /* Firstly check the current high score table */
      if (window.Promise) {
        var promise = new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', 'http://nodejssnake-songcat.rhcloud.com/getHiScores');
          request.setRequestHeader('x-access-token', window.localStorage.getItem('token'));
          request.onload = function() {
            if (request.status == 200) {
              resolve(request.response); // we got data here, so resolve the Promise
            } else {
              reject(Error(request.statusText)); // status is not 200 OK, so reject
            }
          };
          request.onerror = function() {
            reject(Error('Error fetching data.')); // error occurred, reject the  Promise
            _getState().statusMessage = 'Unable to fetch Hi-Scores. Please try again later!';
            _getState().checkingHiScoreTable = false;
          };
          request.send(); //send the request
        });

        promise.then(function(data) {
          /* Check hi-scores to see if we have entered the top 10 */
          var jsonData = JSON.parse(data);
          var hiscores = jsonData.scores;
          for(var i=0; i < hiscores.length; i++){
            var scoreObj = hiscores[i];
            if(_getState().score > scoreObj.score){
              _getState().hiscore = true;
              _getState().blinkInterval = setInterval(function(){
                _getState().blinkOn = !_getState().blinkOn;
              },500);
              break;
            }
          }
          _getState().checkingHiScoreTable = false;
        }, function(error) {
          console.log(error.message);
        });
      } else {
        console.log('Promise not available');
      }
    };

    var _submitScore = function(){
      if (window.Promise) {
        var sc = _getState().score;
        var pl = _getState().playerInitials.join('');
        var promise = new Promise(function(resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('POST', 'http://nodejssnake-songcat.rhcloud.com/submitHiScore');
          request.setRequestHeader('x-access-token', window.localStorage.getItem('token'));
          request.onload = function() {
            if (request.status == 200) {
              resolve(request.response); // we got data here, so resolve the Promise
            } else {
              reject(Error(request.statusText)); // status is not 200 OK, so reject
            }
          };
          request.onerror = function() {
            reject(Error('Error posting data.')); // error occurred, reject the  Promise
            _getState().statusMessage = 'Unable to post score. Please try again later!';
          };
          request.send('score='+sc+'&user='+pl+'&date='+Date.now()); //send the request
        });

        promise.then(function(data) {
          if(data.posted){
            /* Nothing ! ??*/
          }
        }, function(error) {
          console.log('Promise rejected.');
          console.log(error.message);
        });
      } else {
        console.log('Promise not available');
      }
    };

    var _stopGame = function(){
      console.log('@@@ END @@@');
      window.cancelAnimationFrame(_reqAnimFrame);
      _reqAnimFrame = undefined;
    };

    var _restartGame = function(){
      _fetchHiScores();
      _animate();
    };

    var _loseALife = function(){
      /* This is not approriate for that little gap between lives */
      if(_getState().endOfLevel || _getState().endOfGame)
        return;

      /* Update Number of lives */
      _getState().numLives -= 1;

      /* Play die sound */
      var sndSnakeDie = new buzz.sound('../../sounds/snake-die.wav');
      sndSnakeDie.play();

      /* Stop the game if the player has lost all lives */
      if(_getState().numLives === 0){
        console.log('@@@ YOU\'VE USED UP YOUR LIVES! YOU\'RE DEAD!!! @@@');
        _getState().endOfGame = true;
        _getState().endOfLife = true;
        _getState().endOfLevel = true;
        _getState().checkingHiScoreTable = true;

        /* Check hi-score but give it some time to stop screens flashing by! */
        window.setTimeout(function(){
          _checkHighScore();
        }, 1000);
      }
      else{
        _getState().endOfLife = true;
        window.setTimeout(_doRestartLevel, 2500);
      }
    };

    var _doRestartLevel = function(){
      console.info('Restarting Snake...');
      _getState().endOfLife = false;
      _resetGame();
      _restartGame();
    };

    var _doRestartGame = function(){
      console.info('Restarting Snake...');

      _setState({
          getScene: _getScene,
          gameStarted: false,
          score: 0,
          bonus: 0,
          bonusCap: 0,
          hiscore: false,
          checkingHiScoreTable: false,
          numLives: 3,
          firstRun: true,
          increaseSpeed: false,
          timeLeftInLevel: 60,
          level: 1,
          timeToDisplayFruit: 0,
          displayFruit: false,
          fruitEaten: false,
          endOfLife: false,
          endOfGame: false,
          endOfLevel: false,
          playerInitials: ['A', 'A', 'A'],
          currInitialIndex: 0,
          statusMessage: '',
          gamePaused: false,
          blinkOn: true,
          blinkInterval: null,
          scoreSubmitted: false
      })

      /* Set up the conversation */
      _initGameState(false);

      /* Fetch hi-scores again */
      _fetchHiScores();

      /* Now call restart */
      _doRestartLevel();
    };

    var _update = function() {
      var snake = _getState().getScene().getSnake();
      var offset, direction;

      /* If game beaten, check hi-score */
      if(_getState().gameBeaten && _getState().checkingHiScoreTable){
        window.setTimeout(function(){
          _checkHighScore();
          _getState().checkingHiScoreTable = false;
          _getState().endOfGame = true;
          return;
        }, 1000);
      }

      /* If score has been submitted, restart the game */
      if(_getState().scoreSubmitted){
        _getState().scoreSubmitted = false;

        window.setTimeout(function(){
          _getState().endOfLife = false;
          _getState().endOfLevel = false;
          _getState().endOfGame = false;
          _getState().gameBeaten = false;
          _getState().gameStarted = false;
          _getState().numLives = 3;
          _getState().score = 0;
          _getState().timeLeftInLevel = 60;
          _getState().currInitialIndex = 0;
          _getState().playerInitials = ['A', 'A', 'A'],
          _getState().level = 1;
          _getState().hiscore = false;
          _resetGame();
          _restartGame();
        }, 500);
      }

      /* Are we at the end of the game? */
      if(_getState().endOfGame){
        return;
      }

      /* We may be between lives, if so don't bother updating state */
      if(_getState().endOfLife){
        return;
      }

      /* Have we run out of time */
      if(_getState().timeLeftInLevel === 0){
        _loseALife();
        return;
      }

      /* Have we completed the level ? */
      if(_getState().endOfLevel){
        return;
      }

      /* Display the fruit at the right time */
      var fruitWindow = _getState().timeLeftInLevel + _getState().timeToDisplayFruit
      if(!_getState().fruitEaten && fruitWindow > 60 && fruitWindow < 65 && !_getState().gamePaused){
        _getState().displayFruit = true;
      }
      else{
        _getState().displayFruit = false;
      }

      /* First check that we have segments...!*/
      if(snake.getSegments().length > 0 && !_getState().gamePaused){
        var segments = snake.getSegments();
        for(var i=0; i < segments.length; i++){
          var segment = segments[i];
          /* Store the old position of the segment */
          var oldPos = {};
          oldPos.left = segment.getPosition().left;
          oldPos.top = segment.getPosition().top;
          segment.setOldPos(oldPos);

          if(i===0){
            offset = _calculateOffset(segment.getDirection());
            segment.setPosition( { left: segment.getPosition().left + offset.left , top: segment.getPosition().top + offset.top } );
          }
          else{
            /* Use the old position of the previous segment to position 'this' segment */
            segment.setPosition({ left: segments[i-1].getOldPos().left, top: segments[i-1].getOldPos().top } );
          }

          /* Perform a collision check if we are dealing with the first segment */
          if( i === 0){
            var borderCollision = _isCollidedWithBorder(segment.getPosition());
            if(borderCollision){
              _loseALife();
            }
            var pillIndex = _isCollidedWithPill(segment);
            if(pillIndex !== undefined){
              _eatPill(pillIndex);
            }
            var fruitCollided = _isCollidedWithFruit(segment);
            if(fruitCollided){
              _eatFruit();
            }
          }
        }
      }
    };

    var _eatFruit = function(){
      var sndEatFruit = new buzz.sound('../../sounds/eat-fruit.wav');
      sndEatFruit.play();
      _getState().fruitEaten = true;
      _getState().score += 100 * Math.pow(2, _getState().level);
    };

    var _eatPill = function(index){
      /* Remove the obstacle at the index */
      var obstacles = _getScene().getObstacles();
      obstacles.splice(index, 1);

      /* Play eat pill sound !! */
      var sndEatPill = new buzz.sound('../../sounds/pong.wav', { volume: 25 });
      sndEatPill.play();

      /* Make snakey longer */
      _addSegmentToSnake();

      /* Update score */
      _getState().score += 50;

      /* Check if we are at the end of the level */
      if(obstacles.length === 0){
        _getState().endOfLevel = true;
        _getState().bonusCap = 50 * _getState().timeLeftInLevel;
        window.setTimeout(_nextLevel, 3500);
      }
    };

    var _isCollidedWithBorder = function(pos){
      return pos.left >= 395 || pos.left <= 0 || pos.top <= 20 || pos.top >= 395 ;
    };

    var _isCollidedWithPill = function(segment){
      var result;
      var obstacles = _getScene().getObstacles();
      var segmentRect = segment.getRect();
      for (var i = obstacles.length - 1; i >= 0; i--) {
        var pillToTest = obstacles[i];
        if(_getScene().doesRectOverlap(segmentRect, pillToTest.rectToTest)){
          result = i;
          break;
        }
      };
      return result;
    };

    var _isCollidedWithFruit = function(segment){
      var result = false;
      var segmentRect = segment.getRect();
      var fruitRect = new Rect(194, 194, 12, 12);
      if(_getState().displayFruit && _getScene().doesRectOverlap(segmentRect, fruitRect)){
        result = true;
      }
      return result;
    };

    var _addSegmentToSnake = function(){
      var snake = _getState().getScene().getSnake();
      var segments = snake.getSegments();
      var segmentDirection = segments[segments.length - 1].getDirection();
      var segmentNew = new Segment(
        segments.length,
        segmentDirection,
        segments.length+1,
        snake,
        {
          left: segments[segments.length - 1].getPosition().left + _getOffsetOfNewSegment(segmentDirection).left,
          top: segments[segments.length - 1].getPosition().top + _getOffsetOfNewSegment(segmentDirection).top
        }
      );
      segments.push(segmentNew);
    };

    var _getOffsetOfNewSegment = function(segmentCurrentDirection){
      //console.log('Segment Direction: '+segmentCurrentDirection);
      if(segmentCurrentDirection === 'n'){
        return { left: 0, top: -5 } ;
      }
      else if(segmentCurrentDirection === 'e'){
        return { left: -5, top: 0 } ;
      }
      else if(segmentCurrentDirection === 's'){
        return { left: -5, top: 0 } ;
      }
      else if(segmentCurrentDirection === 'w'){
        return { left: 0, top: 5 } ;
      }
      else{
        console.error('ERROR:: ');
      }
    };

    var _calculateOffset = function(currentDirection){
      var result;
      if(currentDirection === 'n'){
        result = { top: -5, left: 0 };
      }
      else if(currentDirection === 'e'){
        result = { top: 0, left: 5 };
      }
      else if(currentDirection === 's'){
        result = { top: 5, left: 0 };
      }
      else if(currentDirection === 'w'){
        result = { top: 0, left: -5 };
      }
      else{
        throw new Error('ERROR currentDirection not set: currentDirection = '+currentDirection);
      }
      return result;
    }

    var _draw = function() {
        /* First clear the Scene */
        _ctx.clearRect(0, 0, 400, 400);

        /* Draw the Scene */
        _scene.draw();
    }

    return {
        getContext: _getContext,
        getGame: _getGame,
        getState: _getState,
        getScene: _getScene,
        getTimeSinceStartOfLevel: _getTimeSinceStartOfLevel,
        getScreenWidth: _getScreenWidth,
        getScreenHeight: _getScreenHeight,
        getLevels: _getLevels,
        start: _start,
        startGame: _initGameState,
        stopGame: _stopGame,
        update: _update,
        animate: _animate,
        fetchHiScores: _fetchHiScores,
        draw: _draw
    }
}

function Scene(game) {
    var _game = game;
    var _obstacles = [];
    var _NUMBER_OF_OBSTACLES = 9;
    var _OBSTACLE_WIDTH = 10;
    var _OBSTACLE_HEIGHT = 10;
    var _BACKGROUND_BORDER_COLOR = "#990000";
    var _snake = new Snake(_game);

    var _getGame = function() {
        return _game;
    };

    var _getSnake = function() {
        return _snake;
    };

    var _getGameState = function() {
        return _game.getState();
    };

    var _getObstacles = function() {
        return _obstacles;
    };

    var _setObstacles = function(oArr){
      _obstacles = oArr;
    }

    var _drawPill = function(row, col){
      /*
        (0,0), xLower = 20, xHigher = 80, yLower = 20, yHigher = 80
        (0,1)
      */
      var xLower = ((col % 4)*100) + 20;
      var xHigher = (((col % 4) + 1)*100) - 20;
      var yLower = ((row % 4)*100) + 20
      var yHigher = (((row % 4) + 1)*100) - 20;
      var point = _generateXY(xLower, xHigher, yLower, yHigher);
      //var img = new Image();
      //img.src = _game.getLevels()[_getGameState().level-1].getImgs();
      img = _game.getLevels()[_getGameState().level-1].getImg();
      return {
              image: img,
              location: point,
              rect: new Rect(point.x, point.y, 12, 12),
              rectToTest: new Rect(point.x+2, point.y+2, 8, 8)
            };
    };

    var _generateXY = function(x1, x2, y1, y2) {
        var x, y;
        x = _getRandomArbitrary(x1, x2);
        y = _getRandomArbitrary(y1, y2);
        //console.log('x:'+x+', y:'+y);
        return {
            x: x,
            y: y
        };
    };

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    var _getRandomArbitrary = function(min, max) {
        return Math.random() * (max - min) + min;
    }

    var _doesPointIntersectsWithASingleObstacle = function(point) {
        var result = false;
        var testRects = _getGameState().getScene().getObstacles();

        for (var i = testRects.length - 1; i >= 0; i--) {
            var r = testRects[i];
            if (point.x > r.left && point.x < (r.left + r.width) &&
                point.y > r.top && point.y < (r.top + r.height)) {
                result = true;
                break;
            }
        };
        return result;
    };

    var _rectOverlap = function(r1, r2){
      var xOverlap = _valueInRange(r1.left, r2.left, r2.left + r2.width) || _valueInRange(r2.left, r1.left, r1.left + r1.width);
      var yOverlap = _valueInRange(r1.top, r2.top, r2.top + r2.height) || _valueInRange(r2.top, r1.top, r1.top + r1.height);
      return xOverlap && yOverlap;
    };

    var _valueInRange = function(value, min, max){
      return (value <= max) && (value >= min);
    }

    var _draw = function() {
        var rect;
        var ctx = _getGame().getContext();
        var state = _getGameState();
        /* Set the stroke color, accepts valid css rules */
        ctx.strokeStyle = _BACKGROUND_BORDER_COLOR;

        /* Draw header */
        ctx.beginPath();
        ctx.rect(0, 0, 400, 20);
        ctx.fillStyle = '#333';
        ctx.fill();

        /* Check whether the game has been started */
        if(!state.gameStarted){
          var img = new Image();
          img.src = '../../images/snake/snake.png';
          _getGame().getContext().drawImage(img, 50, 50);
          ctx.font = '14pt Courier';
          ctx.fillStyle = "#000000";
          ctx.fillText('Press \'S\' to Start Game!', 70, 210);
          ctx.font = '10pt Courier';
          ctx.fillText('\u00A9 PJ Games', 280, 145);
          ctx.fillStyle = '#ff0000';
          ctx.fillText('Consume each item of food to grow bigger.', 35, 290);
          ctx.fillText('Watch out for the fruit on each level.', 35, 310);
          ctx.fillText('10 Levels to complete.', 35, 330);
          ctx.fillText('60 seconds (or less) to complete a level.', 35, 350);
          ctx.fillText('Collect bonus points for finishing early!', 35, 370);

          /* Don't draw anything else */
          return;
        }
        /* Now check whether the game is paused */
        if(state.gamePaused){
          ctx.font = '14pt Courier';
          ctx.fillStyle = "#000000";
          ctx.fillText('Game Paused. Press \'P\' to continue', 70, 210);
          return;
        }
        if((state.endOfGame || state.gameBeaten) && !state.hiscore){ /* Haven't got hi-score yet */
          ctx.font = '14pt Calibri';
          ctx.fillStyle = "#ff0000";
          if(state.gameBeaten){
            ctx.fillText('YOU BEAT SNAKE !', 120, 170);
            state.checkingHiScoreTable = true;
          }
          else{
            ctx.fillText('GAME OVER !', 140, 170);
          }
          ctx.font = '11pt Calibri';
          ctx.fillStyle = "#000000";
          ctx.fillText('YOU SCORED: '+state.score, 135, 195);
          ctx.fillText('Press \'S\' to play again', 125, 220);
          if(state.checkingHiScoreTable){
            ctx.fillText('Checking Hi-Score table...', 125, 245);
          }
          if(!state.checkingHiScoreTable && state.statusMessage){
            ctx.fillText(state.statusMessage, 100                                                                                                                                                               , 245);
          }
          return;
        }
        if((state.endOfGame || state.gameBeaten) && state.hiscore){
          var initials = state.playerInitials;
          ctx.font = '14pt Calibri';
          ctx.fillStyle = "#ff0000";
          ctx.fillText('ENTER YOUR INITIALS !', 118, 170);
          ctx.fillText('Use \u2191, \u2193 & ENTER', 128, 195);
          ctx.font = '24pt Calibri';
          ctx.fillStyle = "#000000";
          ctx.fillText(state.playerInitials[0]+' '+state.playerInitials[1]+' '+state.playerInitials[2],162, 245);
          ctx.font = '28pt Calibri';
          var p1 = state.currInitialIndex === 0 && !state.blinkOn ? ' ' : '_' ;
          var p2 = state.currInitialIndex === 1 && !state.blinkOn ? ' ' : '_' ;
          var p3 = state.currInitialIndex === 2 && !state.blinkOn ? ' ' : '_' ;
          ctx.fillText(p1.concat(' '), 162, 248);
          ctx.fillText(p2.concat(' '), 188, 248);
          ctx.fillText(p3, 215, 248);
          ctx.font = '12pt Calibri';
          if(state.currInitialIndex === 3){
            ctx.fillText('Submitting score...', 142, 300);
          }
          else if(state.currInitialIndex === 4){
            ctx.fillText('Score submitted!', 142, 300);
            state.scoreSubmitted = true;
          }
          return;
        }
        if(state.endOfLife){
          ctx.font = '11pt Calibri';;
          ctx.fillStyle = "#666666";
          var livesText = state.numLives > 1 ? 'LIVES' : 'LIFE' ;
          ctx.fillText('YOU DIED. YOU HAVE '+state.numLives+' '+livesText+' LEFT !!!', 100, 190);
          return;
        }
        if(state.endOfLevel && state.level <= 10){
          ctx.font = '11pt Calibri';
          ctx.fillStyle = "#666666";
          ctx.fillText('LEVEL '.concat(state.level), 170, 190);
          ctx.font = '18pt Calibri';
          ctx.fillStyle = "#F1722E";
          ctx.fillText('BONUS = ' + state.bonus, 130, 220);
          return;
        }

        /* Update the level, score & time left */
        ctx.font = '11pt Calibri';
        ctx.fillStyle = "#fffeee";
        ctx.fillText('L'+state.level, 5, 15);
        ctx.fillText('SCORE: '+state.score, 165, 15);
        ctx.fillText('TIME LEFT: '+state.timeLeftInLevel, 310, 15);

        /* Draw the lives */
        //console.log('Num lives left = '+state.numLives);
        for (var i = state.numLives - 1; i >= 0; i--) {
          ctx.beginPath();
          ctx.arc(((i+1)*10)+25, 10, 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#00ee00';
          ctx.fill();
        };

        /* Create the obstacles */
        if(_obstacles.length === 0){
          /* Divide the screen into equal parts */
          var numRows = _game.getScreenHeight() / 100;
          var numCols = _game.getScreenWidth() / 100
          for(var i=0; i < numRows; i++){
            for(var j=0; j < numCols; j++){
              var pill = _drawPill(i, j);
              _obstacles.push(pill);
            }
          }
        }

        for (var j=0; j < _obstacles.length; j++) {
            var pill = state.getScene().getObstacles()[j];
            _getGame().getContext().drawImage(pill.image, pill.location.x, pill.location.y);
        };

        /* Draw the fruit */
        if(state.displayFruit){
          var img = __fruitImgs[state.level-1];
          _getGame().getContext().drawImage(img, 194, 194);
        }

        _snake.draw();

        /* The second and subsequent draws will not compute new obstacle positions */
        state.firstRun = false;
    };

    return {
        draw: _draw,
        getObstacles: _getObstacles,
        setObstacles: _setObstacles,
        getGame: _getGame,
        getSnake: _getSnake,
        getRandomArbitrary: _getRandomArbitrary,
        doesRectOverlap: _rectOverlap
    }
}

function Snake(game) {
    /* Pointer to Game object */
    var _game = game;

    /* Segment array */
    var _segments = [];

    /* The constant width of a single segment */
    var _segmentWidth = 5;

    /* Snake length will be the number of segments of the snake */
    var _snakeLength = 5;

    /* Snake height is a fixed number that will never change */
    var _snakeHeight = 5;

    /* The speed of the snake */
    var _speed = 1;

    /* The maximum speed of the snake */
    var _maxSpeed = 3;

    /* initPos is the initial position of the snake when the game starts */
    var _initPos = {
        left: 5,
        top: 5
    };

    /* Position of the snake */
    var _position = _initPos;

    /* Initialise the snake */
    var _init = function() {
        /* Do something !! */
    };

    var _getPosition = function(){
      return _position;
    };

    var _getGame = function() {
        return _game;
    };

    var _getSnakeLength = function() {
        return _snakeLength;
    };

    var _getSnakeHeight = function(){
      return _snakeHeight;
    };

    var _getSnakeHead = function(){
      return _segments[0];
    };

    var _getSegments = function(){
      return _segments;
    };

    var _setSegments = function(s){
      _segments = s;
    };

    var _getSpeed = function(){
      return _speed;
    };

    var _setSpeed = function(s){
      _speed = s;
    };

    var _getMaxSpeed = function(){
      return _maxSpeed;
    };

    /**
     * Determines whether the snake is in the middle of a turn
     * @return {Boolean} true = the snake is turning
     */
    var _isTurning = function(){
      var test = 'nesw'
      /* Check the number of directions. If more than 1 then return true */
      for (var i = _getSegments().length - 1; i >= 0; i--) {
        var seg = _getSegments()[i];
        test = test.replace(seg.getDirection(), '');
      };
      return test.length < 3 ? true : false ;
    };

    var _increaseSpeed = function(amount){
      _speed += amount;
    };

    /* Draw the snake on the screen */
    var _draw = function(left, top, width, height) {

        /* Draw each segment */
        if (_segments.length === 0) {
            console.info('Creating segments for first time...');
            /* Create segment array */
            for (var i = 0; i < 5; i++) {
                var segment = new Segment(i, 'e', 5, this);
                _segments.push(segment);
            }
         }

        for(var j=0; j < _segments.length; j++){
          var segment = _segments[j];
          segment.draw();
        }
    };

    var _reset = function(){
      _position = _initPos;
      _snakeLength = 5;
      _segments = [];
      _speed = 1;
    };

    /* Do the initialisation. This will only really happen once ever */
    _init();

    return {
        getPosition: _getPosition,
        getGame: _getGame,
        getSnakeLength: _getSnakeLength,
        getSnakeHeight: _getSnakeHeight,
        getSnakeHead: _getSnakeHead,
        getSegments: _getSegments,
        setSegments: _setSegments,
        getIsTurning: _isTurning,
        getSpeed: _getSpeed,
        getMaxSpeed: _getMaxSpeed,
        increaseSpeed: _increaseSpeed,
        draw: _draw,
        reset: _reset
    }
}

function Segment(index, direction, snakeLength, parent, pos){
  var NORTH = "n";
  var EAST = "e";
  var SOUTH = "s";
  var WEST = "w";

  var _index = index;
  var _parent = parent;
  var _isHead = index === 0 ? true : false ;
  var _direction = direction;
  var _prevSeg = index > 0 ? index - 1 : 0 ;
  var _nextSeg = index === snakeLength ? null : index + 1 ;
  var _position = {} ;
  var _size = { width: 5, height: 5 };
  var _prevPos;
  var _oldPos;

  /* Initialise position. If not passed in this is the position at the start */
  if(pos){
    _position = pos;
  }
  else{
    _position.left = 5 + ((4 - _index) * 5);
    _position.top = 25;
  }

  /**
   * Add getters and setters here
   */
   var _getIndex = function(){
    return _index;
   };

  var _getParent = function(){
   return _parent;
  };

  var _getIsHead = function(){
   return _isHead;
  };

  var _getDirection = function(){
   return _direction;
  };

  var _setDirection = function(d){
    _direction = d;
  }

  var _getPrevSeg = function(){
   return _prevSeg;
  };

  var _getNextSeg = function(){
   return _nextSeg;
  };

  var _getPosition = function(){
   return _position;
  };

  var _setPosition = function(pos){
    _position.left = pos.left;
    _position.top = pos.top;
  };

  var _getSize = function(){
   return _size;
  };

  var _getRect = function(){
    return new Rect(_position.left, _position.top, _size.width, _size.height);
  }

  var _getPrevPos = function(){
    return _prevPos;
  };

  var _setPrevPos = function(pos){
    _prevPos = pos;
  };

  var _getOldPos = function(){
    return _oldPos;
  };

  var _setOldPos = function(p){
    _oldPos = p;
  };

  /**
   * Very simply we draw the segment at it's current position
   */
  var _draw = function(){
    var pos = _position;
    var size = _size;
    var rect = new Rect(pos.left, pos.top, size.width, size.height);
    var ctx = _parent.getGame().getContext();

    ctx.fillStyle = '#ee0000';
    ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
  };

  var _toString = function(){
    return 'Segment: index='+this.getIndex()+', direction='+this.getDirection()+', pos='+JSON.stringify(this.getPosition());
  };

  return {
    draw: _draw,
    getIndex: _getIndex,
    getParent: _getParent,
    getIsHead: _getIsHead,
    getDirection: _getDirection,
    setDirection: _setDirection,
    getPrevSeg: _getPrevSeg,
    getNextSeg: _getNextSeg,
    getPosition: _getPosition,
    setPosition: _setPosition,
    getSize: _getSize,
    getPrevPos: _getPrevPos,
    setPrevPos: _setPrevPos,
    getOldPos: _getOldPos,
    setOldPos: _setOldPos,
    getRect: _getRect,
    toString: _toString
  }
};

function Level(index){
  var _levelNumber = index;
  var _img = __levelImgs[index];
  var _numImages = 16 + index;

  var _getLevelNumber = function(){
    return _levelNumber;
  };

  var _getImg = function(){
    return _img;
  };

  var _getNumImages = function(){
    return _numImages;
  }

  return{
    getLevelNumber: _getLevelNumber,
    getImg: _getImg,
    getNumImages: _getNumImages
  }
};

function Rect(l, t, w, h) {
    var _left = l,
        _top = t,
        _width = w,
        _height = h;

    return {
        left: _left,
        top: _top,
        width: _width,
        height: _height
    }
};

function Utils(){

  /* At any time dump the whole Game State */
  this.dumpState = function(){
    //sconsole.dir(_game.getState());
  };
};

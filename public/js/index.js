/*
 * TODO
 *   1. Remove excess spaces between letters
 *   2. Multiple lines
 *   3. Don't empty between messages, but transition as is
 *   4. Experiment with CSS classes
 */

var TestObject = function() {

  var _this = this;

  _this.name = 'oscar';

  _this.tellName = function() {
    console.log(_this.name);
  };
};

var _ticker = {
  BOX_SIZE: 25,
  NUM_ROWS_PER_CHAR: 5,
  NUM_COLS_PER_CHAR: 4,
  NUM_ROWS_PER_SPACE: 1,
  NUM_COLS_PER_SPACE: 1,
  FRAMES_PER_ANIMATE: 120, // 4 seconds (30 fps)
  FRAMES_PER_REST: 150, // 5 seconds (30 fps)
  animationFrameId: null,
  currentFrame: 0,
  tiles: [],
  currentTile: 0,
  hasShownArray: null,
  state: {
    REST: 0,
    ANIMATE: 1,
    current: 0
  }
};

_ticker.createDivs = function() {

  // find the number of rows and columns the display will hold
  var numAvailableRows = Math.floor(window.innerHeight / _ticker.BOX_SIZE);
  var numAvailableCols = Math.floor(window.innerWidth / _ticker.BOX_SIZE);

  console.log('display has ' + numAvailableRows + ' rows and ' + numAvailableCols + ' cols');

  // for each row and column
  for (var row = 0; row < numAvailableRows; row++) {
    for (var col = 0; col < numAvailableCols; col++) {

      // checkerboard coloring
      var colorClass = 'white';
      // if ((row + col) % 2 === 1) {
      //   colorClass = 'black';
      // }

      // create element and append to body
      var jElement = $('<div id="r' + row + 'c' + col + '" class="box ' + colorClass + '" style="top: ' + (row * _ticker.BOX_SIZE) + 'px; left: ' + (col * _ticker.BOX_SIZE) + 'px;"></div>');
      $('body').append(jElement);
    }
  }
};

_ticker.swapColor = function(elementSelector, toBlack) {

  if (toBlack === true) {
    $(elementSelector).addClass('turn-black');
  } else {
    $(elementSelector).addClass('turn-white');
  }

  setTimeout(function(innerElementSelector, innerToBlack) {

    if (innerToBlack === true) {
      $(innerElementSelector)
        .addClass('black')
        .removeClass('white')
        .removeClass('turn-black');
    } else {
      $(innerElementSelector)
        .addClass('white')
        .removeClass('black')
        .removeClass('turn-white');
    }
  }, 1000, elementSelector, toBlack);
};

var hasShownArray = [];

_ticker.animationFrame = function(event) {

  _ticker.currentFrame++;

  switch (_ticker.state.current) {

    case _ticker.state.REST:

      // if we've reached the end of the rest
      if (_ticker.currentFrame === _ticker.FRAMES_PER_REST) {

        // reset to white
        $('div.box').removeClass('black').addClass('white');

        // flag next animation state and reset variables
        _ticker.state.current = _ticker.state.ANIMATE;
        _ticker.currentFrame = 0;
      }

      break;

    case _ticker.state.ANIMATE:

      var numShownThisFrame = 0;

      var percentToEnd = _ticker.currentFrame / _ticker.FRAMES_PER_ANIMATE;
      var percentageToBeat = Math.sin((Math.PI / 2) * percentToEnd);

      for (var charIndex = 0; charIndex < _ticker.tiles[_ticker.currentTile].length; charIndex++) {

        // console.log('charIndex = ' + charIndex);

        var tileArray = _ticker.getTileArray(_ticker.tiles[_ticker.currentTile].charAt(charIndex));

        // push a shown array for this character
        if (hasShownArray[charIndex] === undefined) {
          hasShownArray.push(new Array());
        }

        // for each row and column in the current tile
        for (var row = 0; row < tileArray.length; row++) {

          // console.log('row = ' + row);

          // push a shown array for each row in this character
          if (hasShownArray[charIndex][row] === undefined) {
            hasShownArray[charIndex].push(new Array());
          }

          for (var col = 0; col < tileArray[row].length; col++) {

            // console.log('col = ' + col);

            // push a shown array for each col of this row of this character
            if (hasShownArray[charIndex][row][col] === undefined) {
              hasShownArray[charIndex][row].push(0);
            }

            // skip if we've already dealt with this tile
            if (hasShownArray[charIndex][row][col] === 1) {
              continue;
            }

            // if we should show
            if (Math.random() < percentageToBeat) {

              var toBlack = true;
              if (tileArray[row][col] === 0) {
                toBlack = false;
              }

              var calcRow = row + 1; // + 1 for border
              var calcCol = col + (charIndex * _ticker.NUM_COLS_PER_CHAR) + (charIndex * _ticker.NUM_COLS_PER_SPACE) + 1; // + 1 for border
              var jElement = $('#r' + calcRow + 'c' + calcCol);

              if (toBlack === true) {
                if (jElement.hasClass('white')) {
                  _ticker.swapColor('#r' + calcRow + 'c' + calcCol, toBlack);
                }
              } else {
                if (jElement.hasClass('black')) {
                  _ticker.swapColor('#r' + calcRow + 'c' + calcCol, toBlack);
                }
              }

              hasShownArray[charIndex][row][col] = 1;
              numShownThisFrame++;
            }
          }
        }

        // console.log('num shown in frame ' + _ticker.currentFrame + ' = ' + numShownThisFrame);

      }

      // if we're done with this animation
      if (_ticker.currentFrame === _ticker.FRAMES_PER_ANIMATE) {

        // increment current tile
        _ticker.currentTile++;

        // flag rest state and reset variables
        _ticker.state.current = _ticker.state.REST;
        _ticker.currentFrame = 0;
        hasShownArray = [];
      }

      break;
  }

  // request next animation frame if there are tiles to be shown
  if (_ticker.currentTile === _ticker.tiles.length) {
    _ticker.animationFrameId = null;
  } else {
  _ticker.animationFrameId = requestAnimationFrame(_ticker.animationFrame);
  }
};

_ticker.getTileArray = function(character) {
  
  var tileArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  switch(character) {
    case 'A':
    case 'a':
      tileArray = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1]
      ];
      break;
    case 'B':
    case 'b':
      tileArray = [
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
      ];
      break;
    case 'C':
    case 'c':
      tileArray = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 1, 1]
      ];
      break;
    case 'D':
    case 'd':
      tileArray = [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 0]
      ];
      break;
    case 'E':
    case 'e':
      tileArray = [
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0]
      ];
      break;
    case 'F':
    case 'f':
      tileArray = [
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
      ];
      break;
    case 'G':
    case 'g':
      tileArray = [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
      ];
      break;
    case 'H':
    case 'h':
      tileArray = [
        [1, 0, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 1, 0]
      ];
      break;
    case 'I':
    case 'i':
      tileArray = [
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0]
      ];
      break;
    case 'J':
    case 'j':
      tileArray = [
        [1, 1, 1, 1],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 0]
      ];
      break;
    case 'K':
    case 'k':
      tileArray = [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
      ];
      break;
    case 'L':
    case 'l':
      tileArray = [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0]
      ];
      break;
    case 'M':
    case 'm':
      tileArray = [
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ];
      break;
    case 'N':
    case 'n':
      tileArray = [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1]
      ];
      break;
    case 'O':
    case 'o':
      tileArray = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]
      ];
      break;
    case 'P':
    case 'p':
      tileArray = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
      ];
      break;
    case 'Q':
    case 'q':
      tileArray = [
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 1]
      ];
      break;
    case 'R':
    case 'r':
      tileArray = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
        [1, 0, 1, 0],
        [1, 0, 1, 0]
      ];
      break;
    case 'S':
    case 's':
      tileArray = [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1]
      ];
      break;
    case 'T':
    case 't':
      tileArray = [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ];
      break;
    case 'U':
    case 'u':
      tileArray = [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
      ];
      break;
    case 'V':
    case 'v':
      tileArray = [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [0, 1, 0]
      ];
      break;
    case 'W':
    case 'w':
      tileArray = [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1]
      ];
      break;
    case 'X':
    case 'x':
      tileArray = [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
      ];
      break;
    case 'Y':
    case 'y':
      tileArray = [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
      ];
      break;
    case 'Z':
    case 'z':
      tileArray = [
        [1, 1, 1],
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1]
      ];
      break;
    case ' ':
      tileArray = [
        [0],
        [0],
        [0],
        [0],
        [0]
      ];
      break;
    case '.':
      tileArray = [
        [0],
        [0],
        [0],
        [0],
        [1]
      ];
      break;
  }

  return tileArray;
}

_ticker.play = function() {

  _ticker.state.current = _ticker.state.ANIMATE;
  _ticker.animationFrameId = requestAnimationFrame(_ticker.animationFrame);
}

_ticker.addMessage = function(message) {
  _ticker.tiles.push(message);
}

$(document).ready(function() {

  // console.log('document ready');

  _ticker.createDivs();

  _ticker.addMessage('OSCAR');
  _ticker.addMessage('prom.');
  _ticker.addMessage('test space');

  _ticker.play();
});


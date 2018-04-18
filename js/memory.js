/**
 * Memory
 * 
 * @author   Matthias Morin <matthias.morin@gmail.com>
 * @version  1.0.1
 */

// Declare cards array
var arPictures = ['camel', 'chick', 'cow', 'dog', 'elephant', 'fish', 'lamb', 'owl', 'pig', 'rabbit', 'reindeer', 'turtle'];

// Duplicates array with itself
var arPictures = arPictures.concat(arPictures);

// Defines $grid as a global jQuery object
$grid = $('#grid');

// Starts new game on button click
$('#start').click(function (e) {
    e.preventDefault();
    newGame();
});

/**
 * Apply unselectable css to target object
 *
 * @param  {object} objTarget target jQuery object
 * @return {boolean}           false
 */
function makeUnselectable(objTarget) {

    objTarget
        .addClass('unselectable')      // All these attributes are inheritable
        .attr('unselectable', 'on')    // For IE9 - This property is not inherited, needs to be placed onto everything
        .attr('draggable', 'false')    // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
        .on('dragstart', function () { // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS
            return false;
        }); 

    // Apply non-inheritable properties to the child elements
    objTarget
        .find('*')
        .attr('draggable', 'false')
        .attr('unselectable', 'on');
};

/**
 * GameOver Check
 */
function checkGameOver() {

    if (!$grid.children().hasClass('face-down')) {
        alert('Congratulations !!!');
    }
}

/**
 * Checks if other face up card has matching image
 *
 * @param  {object} $Card Card jQuery object
 */
function checkMatch($Card) {

    if ($Card.attr('style') == gstrFirstCard) {
        // Cards are matching
        // Changes card color
        $('.face-up').addClass('matched');
        $('.matched').removeClass('face-up');
        // Check if game is finished
        checkGameOver();
        nextTry();
    }
    else {
        // Cards do not match
        // Waits one second and resets new
        window.setTimeout(function () {
            nextTry();
        }, 1000);
    }
}

/**
 * Spawns card on game mat
 *
 * @param  {object} $Card      jQuery Card
 * @param  {string} strPicture Picture
 */
function drawCard($Card, strPicture) {

    $Card = $('<div>');
    $Card.addClass('card');
    $Card.addClass('face-down');
    // $Card.addClass(strPicture);

    // Sets card background image
    $Card.css({
        "background-image": "url('img/" + strPicture + ".png')",
    });

    makeUnselectable($Card);

    $grid.append($Card);
    $Card.on('mousedown', function () {
        if (!$Card.hasClass('unclickable') && $Card.hasClass('face-down')) {
            fnFlip($Card);
        }
    });
}

/**
 * Flips a card
 *
 * @param  {object} $Card jQuery Card
 */
function fnFlip($Card) {

    // Clicked card is showed face-up and made unclickable
    $Card.removeClass('face-down');
    $Card.addClass('face-up');
    $Card.addClass('unclickable');

    if (gblnIsFirst == true) {
        // If is flipped first
        // Records image into global variable
        gstrFirstCard = $Card.attr('style');
        // Sets IsFirst boolean to false
        gblnIsFirst = false;
    }
    else {
        // If is flipped second
        // Makes all cards unclickable
        $('.card').addClass('unclickable');
        // Checks if cards match
        checkMatch($Card);
    }

}

/**
 * Init fresh new game
 */
function newGame() {

    // Empties mat
    $grid.empty();

    // Resets game variables
    gblnIsFirst = true;
    gstrFirstCard = '';

    // Shuffles cards
    arPictures = shuffle(arPictures);

    // Spawns cards on the mat
    var intPictureCount = arPictures.length
    for (i = 0; i < intPictureCount; i++) {
        // Each card needs a unique name for reference
        gintCardIndex = i;
        drawCard(gintCardIndex, arPictures[i]);
    }
}

/**
 * Prepares mat for next try
 */
function nextTry() {

    // Flips all face-up cards face-down
    $('.face-up').addClass('face-down');
    $('.face-up').removeClass('face-up');
    // Makes all cards clickable again
    $('.card').removeClass('unclickable');
    // Resets variables for next try
    gblnIsFirst = true;
    gstrFirstCard = '';
}

/**
 * Shuffles array elements
 *
 * @param  {array} arArray array
 * @return {array}         Shuffled array
 */
function shuffle(arArray) {

    var intCurrentIndex = arArray.length, intTemp, intRandomIndex;

    // While there remain elements to shuffle...
    while (0 !== intCurrentIndex) {

        // Pick a remaining element...
        intRandomIndex = Math.floor(Math.random() * intCurrentIndex);
        intCurrentIndex -= 1;

        // And swap it with the current element.
        intTemp = arArray[intCurrentIndex];
        arArray[intCurrentIndex] = arArray[intRandomIndex];
        arArray[intRandomIndex] = intTemp;
    }

    return arArray;
}

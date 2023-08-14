console.log("HELLO DECK OF CARDS!");
const baseUrl = 'https://deckofcardsapi.com/api';
let myDeck;
let $draw1CardBtn = $('#draw_1_Card_Btn')
let $draw2CardsBtn = $('#draw_2_Cards_Btn')



/**
 * Represents a deck of cards.
 * @constructor
 * @class
 * @property {string}  deckId - The ID of the deck in the Deck of Cards API.
 * @property {boolean} isShuffled - boolean to check if our deck is shuffled or not.
 * @property {integer} numRemaining - integer of cards that are still yet to be drawn from the deck.
 */

class Deck {


    constructor() {
        this.deckId       = null;
        this.isShuffled   = null;
        this.numRemaining = null;
    }

    /**
     * Initializes the deck by requesting a new deck from the DC API.
     * @async
     * @method
     * @throws {Error} Throws an error if there's a problem initializing the deck.
     */
    async init() {
        console.log("Initializing.....");
        try {



            let res = await axios.get(`${baseUrl}/deck/new/`);
            console.log("New Deck Json:",res);
            this.deckId = res.data.deck_id;
            this.isShuffled = res.data.shuffled;
            this.numRemaining = res.data.remaining;



        } catch (error) {
            console.error("REJECTED!!\nError initializing deck:", error);
        }
    }

    getDeckId(){
        return this.deckId;
    }
    
    getIsShuffled(){
        return this.isShuffled;
    }

    getNumRemaining(){
        return this.numRemaining;
    }

    // IN THE FUTURE: FUNCTION TO SORT THE CARDS IN OUR DECK, until then use shuffle or start a new deck

    /**
     * Shuffles the deck using the current deck ID.
     * @async
     * @method
     * @throws {Error} Throws an error if there's a problem shuffling the deck.
     */
    async shuffle() {
        console.log("Shuffling.....");
        try {
            let res = await axios.get(`${baseUrl}/deck/${this.deckId}/shuffle/`);
            console.log("Shuffled Deck Json:",res);
            this.isShuffled = true
        } catch (error) {
            console.error("REJECTED!!\nError shuffling deck:", error);
        }
    }

    /**
     * Draws one or more cards from the deck using the current deck ID.
     * 
     * @async
     * @method
     * @param {number} [amount=1] - The number of cards to draw from the deck. Default is 1.
     * @throws {Error} Throws an error if there's a problem drawing cards from the deck.
     * @returns {Array} An array of drawn card objects.
     */
    async draw(amount = 1) {
        console.log("Drawing.....");
        try {
            let res = await axios.get(`${baseUrl}/deck/${this.deckId}/draw/?count=${amount}`);
            console.log("Deck Draw Json:", res);

            // update our # of cards left.
            this.numRemaining = res.data.remaining;
            
            let cards = res.data.cards;
            console.log("Cards:",cards);
            
            return cards;
        } catch (error) {
            console.error("REJECTED!!\nError drawing cards:", error);
        }
    }

    
}

// INITIALIZE THE DECK FOR THIS SESSION
myDeck = new Deck()
myDeck.init()

// TODO: CHECK IF WE HAVE A DECK ID IN LOCAL STORAGE AND GRAB THE DECK WE WERE USING........

/*
PART 2.1
Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”.

We need to check if we have a deckId already saved in local storage. 
if not well call this api url to create a new deck a new deck will be stored for some time in their server, while we keep the deck id.
*/

// Listen for button click to draw a card
$draw1CardBtn.on('click',async function(){

    try {
        // check if our deck has a deck id , if not, init to get id.
        if (!myDeck.deckId) {
            console.error('Deck ID is missing.');
            myDeck = new Deck()
            myDeck.init()
            console.log("Created a new deck for you:", myDeck);
        }
        // once we have the deck id we can shuffle it.
        if(!myDeck.isShuffled){
            console.log("Deck is not shuffled.");
            await myDeck.shuffle()
        }
        // once we shuffle the deck we can tehn draw a card from it.
        let cards = await myDeck.draw()
        cards.forEach((card) => {
            console.log(`Card Drawn: ${card.value} of ${card.suit}`);
        });

    } catch (error) {
        console.error("Error in drawing one card thorugh the draw once button:", error);
    }
});


/*
Part 2.2
Make a request to the deck of cards API to request a single card from a newly shuffled deck.
Once you have the card, make a request to the same API to get one more card from the same deck.
Once you have both cards, console.log the values and suits of both cards.
 */


$draw2CardsBtn.on('click', async function(){
    try {
        // check if our deck has a deck id , if not, init to get id.
        if (!myDeck.deckId) {
            console.error('Deck ID is missing.');
            myDeck = new Deck()
            myDeck.init()
            console.log("Created a new deck for you:", myDeck);
        }
        // once we have the deck id we can shuffle it.
        if(!myDeck.isShuffled){
            console.log("Deck is not shuffled.");
            await myDeck.shuffle()
        }
        // once we shuffle the deck we can then draw the cards from it.
        let cards = await myDeck.draw(2)
        cards.forEach((card) => {
            console.log(`Card Drawn: ${card.value} of ${card.suit}`);
        });

    } catch (error) {
        console.error("Error in drawing two cards thorugh the draw twice button:", error);
    }
});

// $('#draw_2_Cards_Btn').on('click', function(){
//     if (!deckId) {
//         console.error('Deck ID is missing.');
//         return;
//     }
    
//     // once we have the deck id we can then call draw a card.
//     // set this to the value of cards you want per draw, default has been one
//     const numbOfCards = 1
//     drawCardUrl =`${baseUrl}/deck/${deckId}/draw/?count=${numbOfCards}`
//     // Draw a card from the deck
//     axios.get(drawCardUrl)
//         .then(drawnCardResJson => {
//             console.log("RESOLVED! Heres Your Draw Card Json:", drawnCardResJson);

//             let card = drawnCardResJson.data.cards[0];
//             console.log(`Drawn Card: ${card.value} of ${card.suit}`);
//             return axios.get(drawCardUrl)
//         }).then(drawnCardResJson => {
//             console.log("RESOLVED! Heres Your Draw Card Json:", drawnCardResJson);

//             card = drawnCardResJson.data.cards[0];
//             console.log(`Drawn Card: ${card.value} of ${card.suit}`);
//         })
//         .catch(error => {
//             console.error('REJECTED!! ERROR:', error);
//         });

// });


/*
Part 2.3
Build an HTML page that lets you draw cards from a deck.
When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card.
Every time you click the button, display a new card, until there are no cards left in the deck.
 */

// Listen for button click to draw a card
// $('#anim_Draw_Card_Btn').on('click', function(){
//     if (!deckId) {
//         console.error('Deck ID is missing.');
//         return;
//     }
    
//     // once we have the deck id we can then call draw a card.
//     const numbOfCards = 1
//     const drawCardUrl =`${baseUrl}/deck/${deckId}/draw/?count=${numbOfCards}`

//     // Draw a card from the deck
//     axios.get(drawCardUrl)
//         .then(drawnCardResJson => {
//             console.log("RESOLVED! Heres Your Draw Card Json:", drawnCardResJson);

//             // if no cards left after this....
//             const remaining = drawnCardResJson.data.remaining
//             if( remaining === 0){
//                 $('#anim_Draw_Card_Btn').remove()
//             }

//             const card = drawnCardResJson.data.cards[0];
//             // function from nums.js
//             const getRandomIntShimmy = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;
//             const getRandomDeg = (min = -360, max = 360) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
//             let yShimmy = getRandomIntShimmy(-16,13) 
//             let xShimmy = getRandomIntShimmy(-52,25) 
//             let degRotate = getRandomDeg(-35,35)
//             // console.log(`shimmy it by: (${xShimmy}, ${yShimmy}) `)
//             // console.log("Rotate By:", degRotate);
//             // console.log(`Drawn Card: ${card.value} of ${card.suit}`);
//             $('#cards_pile')
//             .append(
//                 `<div class="card-wrapper" 
//                     style="transform: rotate(${degRotate}deg);">
//                     <img class="card" 
//                         style="transform: translate(${xShimmy}px, ${yShimmy}px);
//                         "src="${card.image}" 
//                         alt="img of a card">
//                 </div>`
//                 );
            
//         })
//         .catch(error => {
//             console.error('REJECTED!! ERROR:', error);
//         });

// });


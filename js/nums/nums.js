console.log("HELLO NUMBERS!");

const baseUrl = "http://numbersapi.com";
const $favNumForm = $("#fav-number-form");
const $favNumInput = $("#favNum");
const $getRandomFactsBtn = $("#getRandomFactsBtn");
const $numFactListElement = $("#nums-fact-list");

/*------------------VVDOM Helper FunctionsVV---------------------------*/

/**
 * This function will append data to my documents html number trivia fact list
 * @param {*} data - Any kind of data that could be turned into string
 */
function appendToFactList(data) {
	$numFactListElement.append(`<li>${data}</li>`);
}
/**
 * This function will clear the fact list and append to it the array of data its passed
 * @param {array} data - An array of data to iterate through and add to fact list as list item elements
 */
function reBulletFactList(dataArr) {
	$numFactListElement.empty();
	dataArr.forEach((element) => {
		appendToFactList(element);
	});
}
/*------------------^^DOM Helper Functions^^---------------------------*/

/**
PART 1.1
Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number.
(Make sure you get back JSON by including the json query key, specific to this API. Details.
 */

let favNum = 0;
console.log(`Current favorite #: ${favNum}`);

async function getOneFact(num) {
	// console.log(`Getting a fact about #${num}`);

	try {
		// grab data from response returned by axios, then rename it to fact
		let { data: fact } = await axios.get(`${baseUrl}/${num}?json`);
		console.log("Fact!:", fact.text);

		// Pick one of two a) add to the list or b) replace the contents of the list
		// TODO: Decide how to implement a better way to read delivered trivia... scrolling?
		appendToFactList(fact.text); // a) add to the list
		// reBulletFactList([fact.text]); //b) replace the contents of the list
	} catch (error) {
		// console.error("Name:",error.name);
		// console.error("Code:",error.code);
		// console.error("message:",error.message);
		// console.error("Request:",error.request);
		// console.error("Response:",error.response);

		console.error("Full On Error!!:\n", error);
		// return;
	}
}
// getOneFact(favNum);

/**
PART 1.2
Figure out how to get data on multiple numbers in a single request.
Make that request and when you get the data back, put all of the number facts on the page.
 */

/**
 * Retrieve facts about multiple numbers from the Numbers API.
 * This function will take in an array of numbers and by default will retrieve a single fact from each.
 * Then it will put the facts on the page.
 *
 * @param {Array} numsArr - An array of numbers for which to retrieve facts.
 * @param {Number} [fpn=1] - Number of facts to retrieve per number.
 */
async function getMultipleFacts(numsArr, fpn = 1) {
	try {
		let responses = [];

		for (let i = 0; i < numsArr.length; i++) {
			for (let numOfFacts = 0; numOfFacts < fpn; numOfFacts++) {
				let res = axios.get(`${baseUrl}/${numsArr[i]}?json`);
				responses.push(res);
			}
		}

		responses = await Promise.all(responses);
		// console.log("responses:", responses);

		let responsesData = responses.map((res) => res.data);
		// console.log("responsesData:", responsesData);

		let numberFacts = responsesData.map((data) => data.text);
		// console.log("numberFacts:", numberFacts);

		reBulletFactList(numberFacts);
	} catch (error) {
		// console.error("Name:",error.name);
		// console.error("Code:",error.code);
		// console.error("message:",error.message);
		// console.error("Request:",error.request);
		// console.error("Response:",error.response);

		console.error("Full On Error!!:\n", error);
		// return;
	}
}

// function callback for if you wish get a random number 0-100
const getRandomInt = (min = 0, max = 100) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// button listener to get one fatc from a random pick of numbers
$getRandomFactsBtn.on("click", function () {
	// console.log(this);
	$numFactListElement.empty();
	getOneFact(getRandomInt());
	getOneFact(getRandomInt());
	getOneFact(getRandomInt());
	getOneFact(getRandomInt());
});

// part 1.3
// Use the API to get 4 facts on your favorite number.
// Once you have them all, put them on the page.
// It’s okay if some of the facts are repeats.

// pick your favorite number or any number really
$favNumForm.on("submit", function (event) {
	event.preventDefault();
	favNum = $favNumInput.val();
    getMultipleFacts([favNum], 4)
});

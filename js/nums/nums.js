console.log("HELLO NUMBERS!");
const baseUrl = "http://numbersapi.com";

/**
 * This function will append data to my fact list
 * @param {*} data - Any kind of data thatcould be turned into string
 */
function appendToFactList(data){
    $("#nums-fact-list").append(`<li>${data}</li>`);
}
/**
 * This function will clear the fact list and append to it the array of data its passed
 * @param {array} data - An array of data to iterate through and add to fact list as list item elements
 */
function reBulletFactList(dataArr){
    $("#nums-fact-list").empty();
    dataArr.forEach(element => {
        appendToFactList(element)
    })
	// $("#nums-fact-list").append(`<li>${fact.text}</li>`);
}

/**
 * PART 1.1
 * Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number.
 * (Make sure you get back JSON by including the json query key, specific to this API. Details.
 */

let favNum = 0;
console.log(`Current favorite #: ${favNum}`);

async function getOneFact(num) {
	console.log(`Getting a fact about #${num}`);

	try {
		// grab data from response returned by axios, then rename it to fact
		let { data: fact } = await axios.get(`${baseUrl}/${num}?json`);
		console.log("Fact!:", fact.text);
		$("#nums-fact-list").empty();
		$("#nums-fact-list").append(`<li>${fact.text}</li>`);
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
 * PART 1.2
 * Figure out how to get data on multiple numbers in a single request.
 * Make that request and when you get the data back, put all of the number facts on the page.
 */

// function callback for if you wish get a random number 0-100
const getRandomInt = (min = 0, max = 100) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
// make a list of numbers or use the random list of numbers
let numListPromises = [];

/**
 * Retrieve facts about multiple numbers from the Numbers API.
 * This function will take in an array of numbers and by default will retrieve a single fact from each.
 * Then it will put the facts on the page.
 *
 * @param {Array} numsArr - An array of numbers for which to retrieve facts.
 * @param {Number} [amountOfFactsPerNumber=1] - Number of facts to retrieve for each number.
 */
async function getMultipleFacts(numsArr, amountOfFactsPerNumber = 1) {
    let result = ""

    try{

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

// let baseURL = "https://pokeapi.co/api/v2/pokemon";
// let pokemon = await Promise.all([
//   axios.get(`${baseURL}/1/`),
//   axios.get(`${baseURL}/2/`),
//   axios.get(`${baseURL}/3/`)
// ]);
// console.log("AxiosV2");
// console.log(`The first pokemon is ${pokemon[0].data.name}`);
// console.log(`The second pokemon is ${pokemon[1].data.name}`);
// console.log(`The third pokemon is ${pokemon[2].data.name}`);

// button listener to get more fatcs
$("#getRandomFactsBtn").on("click", function () {
	numListPromises = [];

	// for loop to push 3 num api get promises into the nums list
	for (let i = 0; i < 3; i++) {
		numListPromises.push(
			// pick between a) sequence or b) a random list
			// axios.get(baseUrl + `/${i}?json`) // a) sequence
			axios.get(baseUrl + `/${getRandomInt()}?json`) // b) random list
		);
	}

	Promise.all(numListPromises)
		.then((numApiResponses) => {
			$("#nums-fact-list").empty();

			numApiResponses.forEach((res) => {
				const randFact = `Rand Fact: ${res.data.text}`;
				$("#nums-fact-list").append(`<li>${randFact}</li>`);
			});
		})
		.catch((error) => {
			console.error("REJECTED!!\nERROR:", error);
		});
});

// part 1.3
// Use the API to get 4 facts on your favorite number.
// Once you have them all, put them on the page.
// It’s okay if some of the facts are repeats.
// pick your favorite number or any number really

$("#fav-number-form").on("submit", function (event) {
	event.preventDefault(); // Prevent default form submission behavior

	// Get the entered favorite number
	favNum = $("#favNum").val();
	const $warningMessage = $("#warning-message");
	// Check if favNum is empty or not

	if (favNum.trim() === "") {
		$warningMessage.text("Please enter a number.");
		return;
	} else {
		// Clear the warning message if input is valid
		$warningMessage.text("");
	}

	console.log(`Your selected favorite number: ${favNum}`);

	numListPromises = [];

	// for loop to push 4 fav num api get promises into the nums list
	for (let i = 0; i < 4; i++) {
		numListPromises.push(axios.get(baseUrl + `/${favNum}?json`));
	}

	Promise.all(numListPromises)
		.then((numApiResponses) => {
			// uncomment if you want the list to refresh
			$("#nums-fact-list").empty();
			$("#nums-fact-list").append(
				`<p> -- Heres some trivia about # ${favNum} --</p>`
			);
			numApiResponses.forEach((res) => {
				const randFact = `${res.data.text}`;
				$("#nums-fact-list").append(`<li>${randFact}</li>`);
			});
		})
		.catch((error) => {
			console.error("REJECTED!!\nERROR:", error);
		});
});

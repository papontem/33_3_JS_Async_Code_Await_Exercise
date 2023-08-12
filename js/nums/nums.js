const baseUrl = "http://numbersapi.com";

console.log("HELLO NUMBERS!");

// PART 1.1
// Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number.
// (Make sure you get back JSON by including the json query key, specific to this API. Details.

let favNum = 0;
console.log(`Current favorite #: ${favNum}`);

async function getFact(num) {
	console.log(`Getting a fact about #${num}`);

	// let { data: fact } = await axios.get(`${baseUrl}/l${num}?json`);
	// console.log("Fact!:", fact.text);
	// $('#nums-fact-list').empty();
	// $('#nums-fact-list').append(`<li>${fact.text}</li>`);

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

		console.error("Full On Error!!:\n",error);
		
        return;
	}
}
getFact(4);

// PART 1.2
// Figure out how to get data on multiple numbers in a single request.
// Make that request and when you get the data back, put all of the number facts on the page.

// function callback for if you wish get a random number 0-100
const getRandomInt = (min = 0, max = 100) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
// make a list of numbers or use the random list of numbers
let numListPromises = [];

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

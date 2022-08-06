// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
let categories = [];
let categoryIDs = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
  const response = await axios({
    url: `https://jservice.io/api/categories?count=50`,
    method: 'GET',
    
  });
  console.log(response)

  let newResponse = [];
 
  let modifiedArr = response.data.map(function(element){
    if(element.clues_count > 6) {
      newResponse.push(element)
    }
    else return;
    
});

  // I found the sampleSize code on stackoverflow.com
  NUM_CATEGORIES = _.sampleSize(newResponse, [(n = 6)]);

  for (let num of NUM_CATEGORIES) {
    let categoryID = num.id;
    categoryIDs.push(categoryID);
  }
  console.log()
  for (let catId of categoryIDs) {
    await getCategory(catId);
  }
  $('#jeopardy').remove;
 fillTable();
  return categoryIDs;
}
//getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
  // pulling details from the API by the catId
  
  const catResponse = await axios({
    url: `https://jservice.io/api/category?id=${catId}`,
    method: 'GET',
  });
 
//   category.clues/length < 5 do something

  let category = catResponse.data;

  categories.push({
    title: category.title.toUpperCase(),
    id: category.id,
    clues: [category.clues],
  

  });
 console.log(categories)

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
  let table = `<h1>Jeopardy!</h1>`;

  // adding the restart button
  table += `<button id="reset">Reset Game</button>`;

  table += `<table id="jeopardy"><thead><tr>`;
  console.log(categories)

  // headings of table
  for (let header of categories) {
    //console.log(header.title);
    table += `<th>${header.title}</th>`;
  }
  table += `</tr>`;
  table += `</thead>`;

  table += `<tbody>`;

  let prize = 200;

  // rows of table
  for (let i = 0; i < 5; i++) {
    table += `<tr>`;

    // clues for each category
    for (let j = 0; j <= 5; j++) {
     console.log(categories[j].clues[0][i].answer)
if(categories[j].length < 6) {

    setupAndStart()
}
        else { table += `<td><div class="card"><div class="reveal">$${prize}</div><div class="question" style="display: none;">${categories[j].clues[0][i].question}</div><div class="answer" style="display: none;">${categories[j].clues[0][i].answer}</div></div></td>`;}
     
        
    }

    table += `</tr>`;
    prize += 200;
  }

  table += `</tbody>`;

  table += `</table>`;

  table += `<div class="overlay"></div>`;

  let element = document.getElementsByTagName('body')[0];
  element.innerHTML = table;

  hideLoadingView();
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  // I have functions below that are handling the flipping of the cards
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
  $('body').addClass('loading');
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView(catIDs) {
  $('body').removeClass('loading');
  getCategory(catIDs);
}

// my two jQuery loading spinner functions above were taken from https://www.tutorialrepublic.com/faq/how-to-show-loading-spinner-in-jquery.php

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */
async function setupAndStart() {
    showLoadingView();
    let catIDs = await getCategoryIds();
    

  if(catIDs) {
    hideLoadingView(catsID)
 
  }



   

}

/** On click of start / restart button, set up game. */
$('body').append(`<h1>Jeopardy!</h1>`);
$('body').append('<input type="submit" id="startGame" value="Start Game">');
$('body').append('<div class="overlay"></div>');

$(document).on('click', '#startGame', function () {
  setupAndStart();
  $('#startGame').hide();
});

$(document).on('click', '#reset', function () {
  categories = [];
  categoryIDs = [];
  setupAndStart();
});

/** On page load, add event handler for clicking clues */
$(document).on('click', '.reveal', function () {
  $(this).hide();
  $(this).next('.question').show();
});
$(document).on('click', '.question', function () {
  $(this).hide();
  $(this).next('.answer').show();
});
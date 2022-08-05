const gameHeight = 5;
const columntemplate = $('#template').clone();
const gameTemplate = $('#game').clone();

function buildGameField(height) {
	let i = 0;
	while (i < height) {
		$('#main-container > .row').append($(columntemplate).clone());
		i++;
	}
}

async function getCategories(categoryAmount = 6, offset = Math.floor(Math.random() * 100)) {
	const params = { count: categoryAmount, offset: offset };
	let res = await axios.get('http://jservice.io/api/categories', { params });
	return res.data;
}

async function setIds() {
	let gameCategories = await getCategories();
	for (let i = 0; i < gameCategories.length; i++) {
		$('.category').get(i).innerText = gameCategories[i].title;
		$('.category').get(i).setAttribute('data-id', `${gameCategories[i].id}`);
		let category = $('.category').get(i);
		let id = $(category).attr('data-id');
		let clue = $('.clues').get(i);
		$(clue).children().attr('data-id', id);
	}
}

async function getClues() {
	$('.category').map(async function(idx, el) {
		let params = { category: $(this).data().id };
		let res = await axios.get('http://jservice.io/api/clues', { params });
		setClues(res.data, $(this).data().id);
	});
}
async function setClues(data, categoryId) {
	data.map((clue, idx) => {
		if (idx >= gameHeight) {
			return;
		}
		let back = $(`.main-container[data-id=${categoryId}]`).find('.back');
		let answer = $(`.main-container[data-id=${categoryId}]`).find('.front .answer');
		$(back).get(idx).innerHTML = clue.question;
		$(answer).get(idx).innerHTML = clue.answer;
	});
}

function flipCard(event) {
	if (event.target.classList[0] === 'front' || event.target.tagName == 'SPAN') {
		$(this).addClass('flip-card');
	} else {
		$(this).removeClass('flip-card');
		$(this).find('.answer').css('display', 'block');
		$(this).find('.front span').text('');
		setTimeout(() => {
			$(this).addClass('flip-card');
			$(this).find('.answer').css('display', 'none');
			$(this).find('.back').css('color', 'blue');
		}, 5000);
	}
}

async function restartGame() {
	$('body').empty();
	$('body').append($(gameTemplate));
	$('.row').on('click', '.card', flipCard);
	$('#restart').on('click', restartGame);
	init();
}

async function init() {
	buildGameField(gameHeight);
	await setIds();
	getClues();
}

init();

$('.row').on('click', '.card', flipCard);
$('#restart').on('click', restartGame);
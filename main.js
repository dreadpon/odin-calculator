let maxDecimalPlaces = Math.pow(10, 9);
let equation = [];




let refreshDisplay = function () {
	let text = '';
	for (let i of equation) {
		if (i.type === 'number') text += i.val;
		if (i.type === 'action') {
			switch (i.val) {
				case 'addition': {
					text += ' + '
					break;
				}
				case 'subtraction': {
					text += ' - '
					break;
				}
				case 'multiplication': {
					text += ' × '
					break;
				}
				case 'division': {
					text += ' ÷ '
					break;
				}
			}
		}
	}

	calculator_screen.textContent = text;
}


let evalEquation = function () {
	if (!isPossibleToEval()) {
		console.log('Impossible to eval!');
		return false;
	}

	let numOne = parseFloat(equation[0].val);
	let numTwo = parseFloat(equation[2].val);
	let result = 'ERROR'
	switch (equation[1].val) {
		case 'addition': {
			result = numOne + numTwo;
			break;
		}
		case 'subtraction': {
			result = numOne - numTwo;
			break;
		}
		case 'multiplication': {
			result = numOne * numTwo;
			break;
		}
		case 'division': {
			if (numTwo == 0.0) {
				triggerZero();
				clearEquation();
				return false;
			}
			result = numOne / numTwo;
			break;
		}
	} 

	console.log(calculator_screen.textContent + ' = ' + result);
	equation = [{type: 'number', val: String(Math.round(result * maxDecimalPlaces) / maxDecimalPlaces)}];
	refreshDisplay();
	return true;
}

let triggerZero = function () {
	if (!zeroEl.paused) return;
	calculator_wrapper.classList.add('zeroed');
	zeroEl.parentElement.classList.add('active');
	zeroEl.currentTime = 0;
	zeroEl.play();
}

let stopZero = function () {
	calculator_wrapper.classList.remove('zeroed');
	zeroEl.parentElement.classList.remove('active');
	zeroEl.pause();
}

let nice = function () {
	niceEl.currentTime = 0;
	niceEl.play();
}

let eraseEquation = function () {
	let lastObject = lastEquationObject();
	if (lastObject != null) {
		if (lastObject.type === 'number') {
			lastObject.val = lastObject.val.substring(0, lastObject.val.length - 1);
			if (equation.length === 1 && lastObject.val.length <= 0) {
				lastObject.val = '0';
			}
		}
		if (lastObject.type != 'number' || lastObject.val.length <= 0) { 
			equation.pop();
		}
		refreshDisplay();
	}
}

let clearEquation = function () {
	equation = [{type: 'number', val: '0'}];
	refreshDisplay();
}

let addEquationNumber = function (number = '') { 
	let lastObject = createNumberIfPossible('', true);
	if (lastObject.val.length - lastObject.val.indexOf('.') >= 10) return;
	if (lastObject.val.length >= 18) return;
	if (lastObject.val === '0') {
		lastObject.val = '';
	}
	lastObject.val += number;
	if (lastObject.val.substring(lastObject.val.length - 2, lastObject.val.length) === '69') {
		nice();
	}
	refreshDisplay();
}

let addEquationFloatingPoint = function () { 
	let lastObject = createNumberIfPossible('0', true);
	if (!lastObject.val.includes('.')) {
		lastObject.val += '.'
		refreshDisplay();
	}
}

let negateNumber = function () { 
	let lastObject = lastEquationObject();
	if (lastObject === null || lastObject.val.length <= 0 || lastObject.val === '0') return;
	if (lastObject.val.includes('-')) {
		lastObject.val = lastObject.val.substring(1, lastObject.val.length);
	}
	else {
		lastObject.val = '-'.concat(lastObject.val);
	}
	refreshDisplay();
}

let addEquationAction = function (action) { 
	if (hasAction()) {
		if (!evalEquation()) return;
	}

	let lastObject = createNumberIfPossible('0', true);
	if (lastObject.type === 'number') {
		equation.push({type: 'action', val: action});
		refreshDisplay();
	}
}




let createNumberIfPossible = function (number = '', returnLast = false) {
	let lastObject = lastEquationObject();
	if (lastObject === null || lastObject.type === 'action') {
		let newObject = {type: 'number', val: number};
		equation.push(newObject);
		return newObject;
	}
	if (returnLast && lastObject !== null) return lastObject;
	return null;
}


let lastEquationObject = function() {
	if (equation.length <= 0) return null;
	return equation[equation.length - 1];
}


let hasAction = function() {
	for (object of equation) {
		if (object.type === 'action') {
			return true;
		}
	}
	return false;
}

let isPossibleToEval = function () {
	if (equation.length !== 3) return false;
	if (	equation[0].type !== 'number' 
		|| 	equation[1].type !== 'action' 
		|| 	equation[2].type !== 'number') return false;
	return true;
}





let clickedNumber = function (number) {
	addEquationNumber(number)
}

let clickedAction = function (action) {
	switch (action) {
		case 'addition':
		case 'subtraction':
		case 'multiplication':
		case 'division': {
			addEquationAction(action);
			break;
		}
		case 'backspace': {
			eraseEquation();
			break;
		}
		case 'clear': {
			clearEquation();
			break;
		}
		case 'eval': {
			evalEquation();
			break;
		}
	}
}

let clickedMisc = function (misc) {
	switch (misc) {
		case 'float': {
			addEquationFloatingPoint();
			break;
		}
		case 'negate': {
			negateNumber();
			break;
		}
	}
}


let keyDown = function (e) {
	console.log(e.key);
	switch (e.key) {
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9': {
			clickedNumber(e.key);
			break;
		}
		case '+': {
			clickedAction('addition');
			break;
		}
		case '-': {
			clickedAction('subtraction');
			break;
		}
		case '*': {
			clickedAction('multiplication');
			break;
		}
		case '/': {
			clickedAction('division');
			break;
		}
		case 'Backspace':
		case 'Delete': {
			clickedAction('backspace');
			break;
		}
		case 'Escape':
		case 'c':
		case 'C': {
			clickedAction('clear');
			break;
		}
		case '+':
		case 'Enter': {
			clickedAction('eval');
			break;
		}
		case '~':
		case '_': {
			clickedMisc('negate');
			break;
		}
		case '.':
		case ',': {
			clickedMisc('float');
			break;
		}
	}
}




let calculator_screen = document.querySelector('.calculator-screen > span');
let niceEl = document.querySelector('#nice');
let zeroEl = document.querySelector("#zero");
let calculator_wrapper = document.querySelector('.calculator-wrapper');

zeroEl.addEventListener('ended', stopZero);

window.addEventListener('keydown', keyDown);

document.querySelector("#number-0").addEventListener('click', clickedNumber.bind(this, '0'));
document.querySelector("#number-1").addEventListener('click', clickedNumber.bind(this, '1'));
document.querySelector("#number-2").addEventListener('click', clickedNumber.bind(this, '2'));
document.querySelector("#number-3").addEventListener('click', clickedNumber.bind(this, '3'));
document.querySelector("#number-4").addEventListener('click', clickedNumber.bind(this, '4'));
document.querySelector("#number-5").addEventListener('click', clickedNumber.bind(this, '5'));
document.querySelector("#number-6").addEventListener('click', clickedNumber.bind(this, '6'));
document.querySelector("#number-7").addEventListener('click', clickedNumber.bind(this, '7'));
document.querySelector("#number-8").addEventListener('click', clickedNumber.bind(this, '8'));
document.querySelector("#number-9").addEventListener('click', clickedNumber.bind(this, '9'));
document.querySelector("#action-division").addEventListener('click', clickedAction.bind(this, 'division'));
document.querySelector("#action-multiplication").addEventListener('click', clickedAction.bind(this, 'multiplication'));
document.querySelector("#action-subtraction").addEventListener('click', clickedAction.bind(this, 'subtraction'));
document.querySelector("#action-addition").addEventListener('click', clickedAction.bind(this, 'addition'));
document.querySelector("#action-backspace").addEventListener('click', clickedAction.bind(this, 'backspace'));
document.querySelector("#action-clear").addEventListener('click', clickedAction.bind(this, 'clear'));
document.querySelector("#action-eval").addEventListener('click', clickedAction.bind(this, 'eval'));
document.querySelector("#misc-float").addEventListener('click', clickedMisc.bind(this, 'float'));
document.querySelector("#misc-negate").addEventListener('click', clickedMisc.bind(this, 'negate'));

clearEquation();
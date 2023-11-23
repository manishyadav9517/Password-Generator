const inputSlider = document.querySelector("[data-LengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/";

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider(); //password ki length  ko UI pe reflect krbta hai
//set strength color to gray
setIndicator("#ccc");
//set password Length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "%  100%";
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  //shadow
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9); //give rndom integer between 0-9
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); //convert num into string
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum); //to calculate length
}

function calcStrength() {
  //
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  //isse state pta chl jygi ki checked hai ya nahi
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  //condition hai ki kb kauna clr show krna hai
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); //it return the promise write something to the clipboard
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //fisher yates method
  //finding rndom j
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i indx and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      //hr bar count check hga ki kitn check hua kitna uncheck
      checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  //remove old pwd
  password = "";
  //let's put the stuff mentioned by checkboxes

  //  if(uppercaseCheck.checked){
  //    password+=generateUpperCase();
  //  }

  //  if(lowercaseCheck.checked){
  //    password+=generateLowerCase();
  //  }

  //  if(numbersCheck.checked){
  //    password+=generateRandomNumber();
  //  }

  //  if(symbolsCheck.checked){
  //    password+=generateSymbol();
  //  }

  let funArr = [];
  if (uppercaseCheck.checked) funArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funArr.push(generateLowerCase);

  if (numbersCheck.checked) funArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funArr.push(generateUpperCase);

  if (uppercaseCheck.checked) funArr.push(generateSymbol);

  //neccessary adsn
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  //remianing
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRndInteger(0, funArr.length);
    password += funArr[randIndex]();
  }
  //shuffle the password

  password = shufflePassword(Array.from(password));

  //show in UI
  passwordDisplay.value = password;

  //calculating strength

  calcStrength();
});

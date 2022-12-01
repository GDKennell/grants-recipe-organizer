import { isDecimal } from "./stringHelpers";

var NumberStrings = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  thirteen: "13",
  fourteen: "14",
  fifteen: "15",
  sixteen: "16",
  seventeen: "17",
  eighteen: "18",
  nineteen: "19",
  twenty: "20",
  thirty: "30",
  forty: "40",
  fifty: "50",
  sixty: "60",
  seventy: "70",
  eighty: "80",
  ninety: "90",
};

function wordToNumber(word) {
  const lowerWord = word.toLocaleLowerCase();
  if (!(lowerWord in NumberStrings)) {
    return word;
  }
  return NumberStrings[lowerWord];
}

export function wordsToNumbers(str) {
  const words = str.split(" ");
  return words.map(wordToNumber).join(" ");
}

function unicodeFractionsToRegularFractions(strIn) {
  var str = strIn;
  const unicodes = ["¼", "½", "⅐", "⅔", "⅖", "¾", "⅙", "⅞", "⅒", "⅑"];
  var hasUnicode = false;
  for (const char of unicodes) {
    if (strIn.indexOf(char) != -1) {
      hasUnicode = true;
      break;
    }
  }
  if (!hasUnicode) {
    return strIn;
  }

  var unicodeToString = {};
  unicodes.forEach((char) => {
    const normalized = char.normalize("NFKD");
    const operands = normalized.split("⁄");
    const num = parseInt(operands[0]);
    const denom = parseInt(operands[1]);
    unicodeToString[char] = " " + num + "/" + denom;
  });
  for (const char of unicodes) {
    str = str.replace(char, unicodeToString[char]);
  }
  return str;
}

export function convertFractionsToDecimals(strIn) {
  const str = unicodeFractionsToRegularFractions(strIn);
  const slashIndex = str.indexOf("/");
  if (
    slashIndex == -1 ||
    slashIndex == 0 ||
    !isDecimal(str[slashIndex - 1]) ||
    slashIndex == str.length - 1 ||
    !isDecimal(str[slashIndex + 1])
  ) {
    return str;
  }
  var numeratorStartIndex = slashIndex - 1;
  while (numeratorStartIndex >= 0 && isDecimal(str[numeratorStartIndex])) {
    numeratorStartIndex--;
  }
  numeratorStartIndex++;

  var denomEndIndex = slashIndex + 1;
  while (denomEndIndex < str.length && isDecimal(str[denomEndIndex])) {
    denomEndIndex++;
  }

  const numString = str.substring(numeratorStartIndex, slashIndex);
  const denomString = str.substring(slashIndex + 1, denomEndIndex);
  // console.log(str + " ; found " + numString + " / " + denomString);
  var fraction = parseFloat(numString) / parseFloat(denomString);
  var wholeNumStart = numeratorStartIndex - 2;
  while (wholeNumStart >= 0 && isDecimal(str[wholeNumStart])) {
    wholeNumStart--;
  }
  if (wholeNumStart < numeratorStartIndex - 2) {
    const wholeNumStr = str.substring(wholeNumStart + 1, numeratorStartIndex);
    fraction += parseFloat(wholeNumStr);
    numeratorStartIndex = wholeNumStart + 1;
  }
  return (
    str.substring(0, numeratorStartIndex) +
    fraction.toFixed(2) +
    str.substring(denomEndIndex)
  );
}

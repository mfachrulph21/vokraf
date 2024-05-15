function customRound(number) {
  if (isNaN(number)) {
    return 0;
  }

  const decimal = number - Math.floor(number);

  if (decimal >= 0.5) {
    return Math.ceil(number);
  } else {
    return Math.floor(number);
  }
}

module.exports = customRound;

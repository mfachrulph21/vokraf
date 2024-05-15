function notNullValidator(input) {
  let validator;
  if (input == undefined) {
    validator = false;
  } else {
    validator = !input.trim() ? false : true;
  }

  return validator;
}

function isAlphabetValidator(input) {
  const validator = !/^[A-Za-z]+$/.test(input) ? false : true;
  return validator;
}

function isEmailValidator(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validator = regex.test(input);
  return validator;
}

function isNumericValidator(input) {
  let validator = true;
  if (isNaN(input) || typeof input != "number") {
    validator = false;
  }
  return validator;
}

function isValidImageUrl(input) {
  const regex = /\.(jpg|jpeg|png|gif)$/i;
  const validator = regex.test(input);
  return validator;
}

module.exports = {
  notNullValidator,
  isAlphabetValidator,
  isEmailValidator,
  isNumericValidator,
  isValidImageUrl,
};

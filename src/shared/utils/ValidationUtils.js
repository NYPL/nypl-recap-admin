export function isBarcodeValid(barcode, requiredLength = 14) {
  return typeof barcode === 'string' && barcode.trim().length === requiredLength ? true : false;
}

export function isBibRecordNumberValid(bibNumber) {
  return typeof bibNumber === 'string' && bibNumber.trim().match(/^b\d{8}[\dx]$/) ? true : false;
}

/**
* @desc Validates the input
* @param {string} date - the string of the input value
*/
export function isDateValid(dateInput) {
  if (!dateInput || typeof dateInput !== 'string') {
    return false;
  }

  const dateArray = dateInput.split('-');
  const month = parseInt(dateArray[1], 10);
  const date = parseInt(dateArray[2], 10);
  // Checks if it has a valid date format. The Regex check if the inputs are digits
  // and if they have right number of digits
  const dateMatches = dateInput.match(/^(\d{4})\-(\d{2})\-(?:\d{2})$/);

  if (!dateMatches) {
    return false;
  }

  // Checks if the month is valid
  if (month < 1 || month > 12) {
    return false;
  }

  // Checks if the date is valid
  if (date < 1 || date > 31) {
    return false;
  }

  return true;
}

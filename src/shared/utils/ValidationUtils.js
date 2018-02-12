export function isBarcodeValid(barcode, requiredLength = 14) {
  return typeof barcode === 'string' && barcode.trim().length === requiredLength ? true : false;
}

export function isBibRecordNumberValid(bibNumber) {
  return typeof bibNumber === 'string' && bibNumber.trim().match(/^b\d{8}[\dx]$/) ? true : false;
}

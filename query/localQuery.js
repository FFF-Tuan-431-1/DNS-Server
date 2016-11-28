const XLSX = require('xlsx');
let records = [];

function init(pathName) {
  let workbook;
  try {
    workbook = XLSX.readFile(pathName);
  } catch (e) {
    console.error('Try read excel file error!!!')
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // rename
  worksheet['A1'].w = 'type';
  worksheet['B1'].w = 'name';
  worksheet['C1'].w = 'data';
  records = XLSX.utils.sheet_to_json(worksheet);
}

function query(type, name) {
  return records.filter(v => v.type === type && v.name === name)
}

// test for directly execute
if (require.main === module) {
  init('./data.xlsx');
  console.log(query('A', 'test.com'));
}

module.exports = {
  init,
  query
};

const fs = require('fs');
const config = require('../util/globals');
const { table } = require('table');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(config.SHEET_ID);
doc.useServiceAccountAuth(require('../client-secret.json'));

module.exports = {
  command: 'beat',
  dm: false,
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    const abbreviations = fs
      .readFileSync('heroes.txt', 'utf-8')
      .split(/\r\n|\n/g)
      .map((row) => row.split(':')[0].toLowerCase());
    if (args.length < 3) {
      return msg.channel.send('Please at least enter 3 heros.');
    }
    if (args.slice(0, 5).some((arg) => !abbreviations.includes(arg))) {
      return msg.channel.send('Unrecognised hero name(s).');
    }

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Output'];
    await sheet.loadCells();

    sheet.getCellByA1('L3').value = args.slice(0, 5).join(' ');
    await sheet.saveUpdatedCells();

    await sheet.loadCells();
    const data1 = [
      [
        'Battle Type',
        'L1',
        'L2',
        'L3',
        'L4',
        'L5',
        'LOST PWR',
        'WIN PWR',
        'W1',
        'W2',
        'W3',
        'W4',
        'W5',
        'Grd'
      ],
      ...[...Array(15).keys()].slice(10).map((row) => {
        return [...Array(14).keys()].map(
          (column) => sheet.getCell(row, column).value
        );
      })
    ];

    const data2 = [
      [
        'Battle Type',
        'L1',
        'L2',
        'L3',
        'L4',
        'L5',
        'LOST PWR',
        'WIN PWR',
        'W1',
        'W2',
        'W3',
        'W4',
        'W5',
        'Grd'
      ],
      ...[...Array(20).keys()].slice(15).map((row) => {
        return [...Array(14).keys()].map(
          (column) => sheet.getCell(row, column).value
        );
      })
    ];

    msg.channel.send(
      '```' + table(data1).split('\n').slice(0, -2).join('\n') + '```'
    );
    msg.channel.send(
      '```' + table(data2).split('\n').slice(2).join('\n') + '```'
    );
  }
};

const Jimp = require('jimp');
const { download } = require('../util/file');
const vision = require('@google-cloud/vision');
const fs = require('fs');
const { table } = require('table');

const client = new vision.ImageAnnotatorClient();

module.exports = {
  command: 'submit',
  dm: false,
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    if (
      msg.attachments.size == 0 ||
      !['png', 'jpg', 'bmp', 'jpeg', 'tiff'].some((type) =>
        msg.attachments.first().proxyURL.endsWith('.' + type)
      )
    ) {
      return msg.channel.send('Please attach a bmp/jpeg/png/tiff file.');
    }

    if (
      !['A', 'GA', 'GW', 'CS', 'T', 'a', 'ga', 'gw', 'cs', 't'].includes(
        args[0]
      )
    ) {
      return msg.channel.send('Valid battle types are A/GA/GW/CS/T.');
    }

    if (!['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].includes(args[1])) {
      return msg.channel.send('Valid grades are A/B/C/D.');
    }

    const path = await download(msg.attachments.first().proxyURL);

    const jimp = await Jimp.read(path);

    jimp.resize(2280, 1080);
    jimp.crop(810, 360, 710, 590);
    jimp.write(path);
    const [result] = await client.textDetection(path);

    const text = result.fullTextAnnotation.text;
    const lines = text.split('\n');

    const data = [
      ['', 'Hero 1', 'Hero 2', 'Hero 3', 'Hero 4', 'Hero 5', 'Str'],
      [
        'Win',
        lines[0],
        lines[6],
        lines[12],
        lines[18],
        lines[24],
        [1, 7, 13, 19, 25].reduce(
          (sum, i) => sum + parseInt(lines[i].replace(/[^0-9]/g, '')),
          0
        )
      ],
      [
        'Lose',
        lines[3],
        lines[9],
        lines[15],
        lines[21],
        lines[27],
        [2, 8, 14, 20, 26].reduce(
          (sum, i) => sum + parseInt(lines[i].replace(/[^0-9]/g, '')),
          0
        )
      ],
      [
        'Type',
        args[0].toUpperCase(),
        'Grade',
        args[1].toUpperCase(),
        '',
        '',
        ''
      ]
    ];

    await msg.channel.send('```' + table(data) + '```');

    fs.unlinkSync(path);
  }
};

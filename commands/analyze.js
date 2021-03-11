const Jimp = require('jimp');
const { download } = require('../util/file');
const vision = require('@google-cloud/vision');
const fs = require('fs');
const { table } = require('table');

const client = new vision.ImageAnnotatorClient();

module.exports = {
  command: 'analyze',
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

    const path = await download(msg.attachments.first().proxyURL);

    const jimp = await Jimp.read(path);

    jimp.resize(2280, 1080);
    jimp.crop(810, 360, 710, 590);
    jimp.write(path);
    const [result] = await client.textDetection(path);

    const text = result.fullTextAnnotation.text;
    const lines = text.split('\n');

    const data = [
      ['Left Player Name', 'Left Player Power', 'Right Player Name', 'Right Player Power'],
      [lines[0], lines[1].replace(/[^0-9]/g, ''), lines[3], lines[2].replace(/[^0-9]/g, '')],
      [lines[6], lines[7].replace(/[^0-9]/g, ''), lines[9], lines[8].replace(/[^0-9]/g, '')],
      [lines[12], lines[13].replace(/[^0-9]/g, ''), lines[15], lines[14].replace(/[^0-9]/g, '')],
      [lines[18], lines[19].replace(/[^0-9]/g, ''), lines[21], lines[20].replace(/[^0-9]/g, '')],
      [lines[24], lines[25].replace(/[^0-9]/g, ''), lines[27], lines[26].replace(/[^0-9]/g, '')]
    ];

    console.log(data);
    
    await msg.channel.send('```' + table(data) + '```');
    
    fs.unlinkSync(path);
  }
};

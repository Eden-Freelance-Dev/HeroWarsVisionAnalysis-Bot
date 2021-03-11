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

    const data = {
      left: [
        {
          name: lines[0],
          power: lines[1].replace(/[^0-9]/g, '')
        },
        {
          name: lines[6],
          power: lines[7].replace(/[^0-9]/g, '')
        },
        {
          name: lines[12],
          power: lines[13].replace(/[^0-9]/g, '')
        },
        {
          name: lines[18],
          power: lines[19].replace(/[^0-9]/g, '')
        },
        {
          name: lines[24],
          power: lines[25].replace(/[^0-9]/g, '')
        }
      ],
      right: [
        {
          name: lines[3],
          power: lines[2].replace(/[^0-9]/g, '')
        },
        {
          name: lines[9],
          power: lines[8].replace(/[^0-9]/g, '')
        },
        {
          name: lines[15],
          power: lines[14].replace(/[^0-9]/g, '')
        },
        {
          name: lines[21],
          power: lines[20].replace(/[^0-9]/g, '')
        },
        {
          name: lines[27],
          power: lines[26].replace(/[^0-9]/g, '')
        }
      ]
    }

    await msg.channel.send()
    
    fs.unlinkSync(path);
  }
};

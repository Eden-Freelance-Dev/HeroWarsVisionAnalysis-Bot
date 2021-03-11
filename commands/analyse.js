const Jimp = require('jimp');
const { download } = require('../util/file');
const vision = require('@google-cloud/vision');
const fs = require('fs');

const client = new vision.ImageAnnotatorClient();

module.exports = {
  command: 'analyse',
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

    fs.unlink(path);
  }
};

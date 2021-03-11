const fs = require('fs');
const https = require('https');

module.exports = class File {
  constructor(path) {
    this.path = path;
  }
  read() {
    return JSON.parse(fs.readFileSync(this.path));
  }
  write(data) {
    fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
  }
};

module.exports.download = async (url, dest = url.split('/').pop()) => {
  return new Promise(async (res, rej) => {
    let file = fs.createWriteStream(dest);
    https
      .get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          res(file.path);
        });
      })
      .on('error', function (err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        rej(err);
      });
  });
};

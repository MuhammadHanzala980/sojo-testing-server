var fs = require('fs');
const generateUniqueName = require("./id-genrator");

const createDir = (dir) => new Promise((resolve, reject) => {
    let dirName = dir + generateUniqueName();
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
        resolve(dirName);
    } else {
        reject({
            success: false,
            error: "Somethin went to wrong!"
        });
    };
});

module.exports = createDir;


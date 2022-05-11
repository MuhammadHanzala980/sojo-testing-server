const LinkModal = require("../models/Products/ProductLink");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.URL_KEY);




async function saveLinks({ zip, _id }) {
    console.log({ zip, _id });

    const hash = await cryptr.encrypt(zip);
    const linkModal = await new LinkModal({ hash: hash, id: _id });
    return await linkModal.save();
}


module.exports = saveLinks



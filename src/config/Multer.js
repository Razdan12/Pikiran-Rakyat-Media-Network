const multer = require('multer');
const fs = require('fs');


const base_url = process.env.BASE_URL
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = './public';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); 
  },
  filename: (req, file, cb) => {
    let date = new Date().toISOString().replace(/:/g, '-');
    const namaFile = date+" - "+file.originalname
    cb(null, namaFile);
  },
});

const upload = multer({ storage });

module.exports = upload;
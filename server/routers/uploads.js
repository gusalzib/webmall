const multer = require('multer');
const path = require('path');

try {
    // Configure storage for uploaded files
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Set the destination where files will be stored
            cb(null, path.join(__dirname, '../../server/public/store_images'));
        },
        filename: function (req, file, cb) {
            // Generate a unique filename for each uploaded file
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });
    module.exports = upload;
} catch (error) {
    console.log(error.message)
}





import fs from 'node:fs/promises';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, './tmp');
    }, 
    filename: (req, file, cb) => {
        const picName = Date.now() + '-' + file.originalname;
        cb(null, picName);
    }, 
});

const upload = multer({ storage });

export const uploadImage = upload.single('image');

export const getImageName = (req, res) => {
    res.json({
        url:`${req.file.filename}`
    });
};

export const deleteFile = async (req, res) => {
    try{
        const filePath = `./tmp/${req.body.url}`;
        await fs.unlink(filePath);
        res.json({ message: 'Picture Deleted!'})
    } catch (err) {
        res.json(err);
    }

}; 
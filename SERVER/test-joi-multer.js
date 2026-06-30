const express = require('express');
const multer = require('multer');
const joi = require('joi');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const updateProductSchema = joi.object({
    images: joi.array().items(joi.string().required()).optional().min(1),
    title: joi.string()
}).unknown(true);

app.post('/test', upload.array('images', 5), (req, res) => {
    let bodyImages = req.body.images;
    if (typeof bodyImages === "string") bodyImages = [bodyImages];

    const { error, value } = updateProductSchema.validate({ ...req.body, images: bodyImages });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const keptImages = value.images || [];
    const newImages = req.files && req.files.length > 0 ? req.files.map(img => img.path) : [];
    value.images = [...keptImages, ...newImages];

    if (value.images.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
    }

    res.json({ success: true, value });
});

app.listen(3006, async () => {

    const fd1 = new FormData();
    fd1.append('images', fs.createReadStream('package.json'));
    fd1.append('title', 'test');

    const res1 = await fetch('http://localhost:3006/test', { method: 'POST', body: fd1 });
    console.log("Test 1 (only file):", await res1.json());

    process.exit(0);
});

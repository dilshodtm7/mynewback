const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// JSON ma'lumotlarini o'qish imkoniyatini beradi
app.use(express.json());
// Frontend fayllarini serve qilish uchun
app.use(express.static(__dirname));

// Agar `data.json` fayli mavjud bo'lmasa, uni yaratish
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// POST so'rovlarini qabul qiluvchi marshrut
app.post('/post_data', (req, res) => {
    try {
        const incomingData = req.body;

        if (!incomingData || Object.keys(incomingData).length === 0) {
            return res.status(400).json({ error: 'Hech qanday ma\'lumot yuborilmadi' });
        }

        // Vaqt tamg'asini qo'shish
        incomingData.timestamp = new Date().toISOString();

        // Avvalgi ma'lumotlarni o'qish
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(fileData);

        // Yangi ma'lumotni qo'shish
        data.push(incomingData);

        // Ma'lumotlarni faylga yozish
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));

        res.status(200).json({ message: 'Ma\'lumotlar muvaffaqiyatli saqlandi!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
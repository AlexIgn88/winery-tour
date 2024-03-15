import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { body, validationResult } from 'express-validator';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
});

function trimReplace(value) {
    if ('string' === typeof value) return value.trim().replace(/\s+/g, ' ');
    return value;
}

const validateData = [
    body('name').customSanitizer(trimReplace).notEmpty().withMessage('Нет имени')
        .matches(/^[a-zA-Zа-яА-ЯёЁ]{2,30}$/).withMessage('Имя должно содержать только кириллицу/латиницу и быть от 2 до 30 символов'),
    body('phone').customSanitizer(trimReplace).notEmpty().withMessage('Нет телефона')
        .matches(/^\+?\d{10,15}$/).withMessage('Имя должно содержать только кириллицу/латиницу и быть от 2 до 30 символов'),
];

app.post('/send-email', validateData, async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const { name, phone, textarea } = req.body;
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Заявка от ${name}`,
            html: `<p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Сообщение:</strong> ${textarea}</p>`
        });

        res.send(JSON.stringify({ message: 'Сообщение отправлено!' }));

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message)
    }
})

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Сервер запущен на порту ${PORT}`);
})
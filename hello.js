const telegramBot = require("node-telegram-bot-api");
const token = '7101501338:AAEXe3pWPtaiAq2VROgCCd7N6vTyoBAFbU4';
const bot = new telegramBot(token, {polling: true});

const start = async () => {
    const usersData = {};
    const user = -1002071427575;
    
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (!usersData[userId]) {
            bot.sendMessage(chatId, '*Для того чтобы выйти на новый уровень в деньгах, укажите ваше имя👇🏻*', {parse_mode: 'Markdown'});
            usersData[userId] = {};
            usersData[userId].stage = 'name';
        } else {
            sendMenu(chatId);
        }
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const message = msg.text;

        if (usersData[userId]) {
            switch (usersData[userId].stage) {
                case 'name':
                    usersData[userId].name = message;
                    bot.sendMessage(chatId, '*Скачайте чек-лист на первый миллион указав ваш номер телефона👇🏻*', {parse_mode: 'Markdown'});
                    usersData[userId].stage = 'phone';
                    break;
                case 'phone':
                    const match = message.match(/^\+?\d{5,15}$/);
                    if (match) {
                        usersData[userId].phone = message;
                        sendUserInfo(chatId, usersData[userId].name, usersData[userId].phone);
                        delete usersData[userId];
                        sendMenu(chatId);
                    } else {
                        bot.sendMessage(chatId, '*Пожалуйста, введите корректный номер телефона в формате "+XXXXXXXXXXX".*', {parse_mode: 'Markdown'});
                    }
                    break;
            }
        }
    });

    bot.on('callback_query', (query) => {
        const chatId = query.message.chat.id;
        const data = query.data;

        switch (data) {
            case 'button1':
                bot.sendMessage(chatId, 'Вы выбрали Секреты больших продаж. Информацию можно получить ниже \n'+
                    'https://disk.yandex.ru/i/EklcBSgl4PK_PQ'
                );
                break;
            case 'button2':
                bot.sendMessage(chatId, 'Вы выбрали Выход на новый уровень в деньгах. Информацию можно получить ниже\n'+
                    'https://disk.yandex.ru/i/T3emrNNNTBS7ng'
                );
                break;
            case 'button3':
                bot.sendMessage(chatId, 'Вы выбрали Успешный РОП - успешный бизнес. Информацию можно получить ниже\n'+
                    'https://disk.yandex.ru/i/O5MNrx3IVPB2tA'
                );
                break;
            case 'button4':
                bot.sendMessage(chatId, 'Вы выбрали Чек-лист на миллион. Информацию можно получить ниже\n'+
                    'https://disk.yandex.ru/i/RFDZFswEX78A6w'
                );
                break;
            case 'button5':
                bot.sendMessage(chatId, 'Вы выбрали Неубиваемая воронка продаж. Информацию можно получить ниже\n'+
                    'https://disk.yandex.ru/i/GTaOa5UhWRSFHQ'
                );
                break;
        }
    });

    function sendUserInfo(chatId, name, phone) {
        bot.sendMessage(user, `Получена информация:\nИмя: ${name}\nНомер телефона: ${phone}`);
    }

    function sendMenu(chatId) {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Секреты больших продаж', callback_data: 'button1' }],
                    [{ text: 'Выход на новый уровень в деньгах', callback_data: 'button2' }],
                    [{ text: 'Успешный РОП - успешный бизнес', callback_data: 'button3' }],
                    [{ text: 'Чек-лист на миллион', callback_data: 'button4' }],
                    [{ text: 'Неубиваемая воронка продаж', callback_data: 'button5' }]
                ]
            }
        };
        bot.sendMessage(chatId, '*Поздравляем! Вы получили доступ к уникальным материалам 🔥*', {parse_mode: 'Markdown'});
        bot.sendMessage(chatId, 'Получить файлы можно ниже👇🏻',options);
    }

}
start()
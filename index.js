const multivarka = require('./multivarka');

multivarka
    // Указываем url для подключения
    .server('mongodb://localhost/urfu-2015')

    // и коллекцию
    .collection('students')

    // Выбираем только те записи, в которых поле `group` равно значению «ПИ-301».
    .where('group').equal('ПИ-302')

    // После подготовки, делаем запрос
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        }
    });

docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.prod.yml up
(тоже в ридми)

Краткая инструкция для тестирования websocket-ов через Postman:

    My Workspace
    New
    WebSocket Request
    Raw поменять на Socket.IO
    ws://localhost:ВНЕШНИЙ_ПОРТ_ПРИЛОЖЕНИЯ/
    Connect
    Запонлнить Event Name
    формат JSON
    Пример: { "text": "Сообщение" }
    В Listeners добавить имена событий, которые слушает клиент
    Send

Есть еще протокол wss. Не забывать делать дисконнект, если менялись переменные окружения. Входящие сообщения в постмане только что-то мне не приходят, но в базе данных все как надо меняется. Возможно это связано с тем, что у меня 2 разных события. Хотя если приконнектиться еще и с браузера - все исправно обновляется там, так что все ок вроде.

Как загружать файл или много файлов через постман - тоже инструкцию запили
Для загрузки нескольких файлов с помощью малтера через постман выбираем Post -> Body -> form-data (это малтипарт формдата). В столбце key пишем то, что указано в @UseInterceptors(FilesInterceptor('***')), а в столбце value - выбираем путь до файла. При мульти-загрузке файлов значение key во всех строках будет одно и то же, а в value - разные пути до файла. Если параллельно нужно будет передать body, то эти поля по тому же принципу пишутся в следующих строках. Только это будет малтипарт-формдата, потому... (нюансы работы с ней)

Инструкции по тестированию для вебсокетов и авторизации сюда тоже
Тестируй авторизацию через заголовки - Authorication - Bearer *.*.* (в инструкцию, про второй способ тоже рассказать. Раздел "тестировщикам")

Инструкция для тестирования. Аутентификация - через Authorization, через заголовки или через кукисы.


Для тестов в постмане (но потом большую портянку в dump):
{
  "email": "somemail@mail.ru",
  "passwordHash": "A1B54C93D01E442F58",
  "name": "Vasia",
  "contactPhone": "8-922-222-11-34",
  "role": "client"
}

ТЕСТИРОВАНИЕ:
- емэйл занят
- не хватает обязательных полей
- поля заполнены некорректными данными
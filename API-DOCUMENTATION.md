Краткое описание API (подробное есть в SPECIFICATION.md)
TODO: В своем проекте делай через Swagger

### API Модуля «Гостиницы»

GET /api/common/hotel-rooms - Основной API для поиска номеров.

GET /api/common/hotel-rooms/:id - Получение подробной информации о номере.

POST /api/admin/hotels/ - Добавление гостиницы администратором.

GET /api/admin/hotels/ - Получение списка гостиниц администратором.

PUT /api/admin/hotels/:id - Изменение описания гостиницы администратором.

POST /api/admin/hotel-rooms/ - Добавление номера гостиницы администратором.

PUT /api/admin/hotel-rooms/:id - Изменение описания номера гостиницы администратором.

### API Модуля «Бронирование»

POST /api/client/reservations - Создаёт бронь на номер на выбранную дату для текущего пользователя.

GET /api/client/reservations - Список броней текущего пользователя.

DELETE /api/client/reservations/:id - Отменяет бронь пользователя.

GET /api/manager/reservations/:userId - Список броней конкретного пользователя.

DELETE /api/manager/reservations/:id - Отменяет бронь пользователя по id брони.

### API Модуля «Аутентификация и авторизация»

POST /api/auth/login - Стартует сессию пользователя и выставляет Cookies.

POST /api/auth/logout - Завершает сессию пользователя и удаляет Cookies.

POST /api/client/register - Позволяет создать пользователя с ролью client в системе.

### API Модуля «Управление пользователями»

POST /api/admin/users/ - Позволяет пользователю с ролью admin создать пользователя в системе.

GET /api/admin/users/ - Позволяет пользователю с ролью admin получить список пользователей.

GET /api/manager/users/ - Позволяет пользователю с ролью manager получить список пользователей.

### API модуля «Чат с техподдрежкой»

POST /api/client/support-requests/ - Позволяет пользователю с ролью client создать обращение в техподдержку.

GET /api/client/support-requests/ - Позволяет пользователю с ролью client получить список обращений для текущего пользователя.

GET /api/manager/support-requests/ - Позволяет пользователю с ролью manager получить список обращений от клиентов.

GET /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client получить все сообщения из чата.

POST /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client отправлять сообщения в чат.

POST /api/common/support-requests/:id/messages/read - Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.


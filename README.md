# Веб-додаток для порівняння товарів
![image](https://github.com/user-attachments/assets/262010fc-683d-4176-8510-bc8827b6b85a)
![image](https://github.com/user-attachments/assets/3fc383ce-6457-4a51-91fe-c2559ac1daf5)
![image](https://github.com/user-attachments/assets/60d0e1d3-6693-460b-a99d-c712f6124aed)

## 📁 Структура проекту

```
├── client/          # Frontend код (React)
├── server/          # Backend API сервер
├── tests/           # Тести для клієнта та сервера
├── mongo/           # База даних MongoDB
```

## 🚀 Швидкий старт

### Передумови
- Node.js (версія 18+)
- MongoDB
- npm або yarn

### Покрокова інструкція запуску

1. **Встановлення залежностей**
   ```bash
   ./InstallALLStuff.bat
   ```

2. **Запуск бази даних**
   ```bash
   ./StartTheBestDatabase.bat
   ```
   ⚠️ **Важливо**: База даних повинна бути повністю запущена перед стартом додатка

3. **Запуск сервера та клієнта в режимі розробки**
   ```bash
   ./StartClientServerDevMode.bat
   ```

4. **Відкриття в браузері**
   - Подвійний клік на `OpenClientInBrowser.url`
   - Або перейдіть на http://localhost:5173

## 👤 Доступ адміністратора

**Логін**: `ma@ka.rasty`
**Пароль**: `123123`

Для зміни облікових даних адміністратора відредагуйте файл:
```
server/src/startup/initAdmin.ts
```

## ⚙️ Конфігурація

### Змінні середовища сервера (.env)
```env
MONGO_URI="mongodb://localhost:27017/site?authMechanism=DEFAULT"
JWT_SECRET="MKY-corp-proj-compare-SBX-d6628eb6f-ce5e5186"
PORT=5305
```

### Налаштування URL API на клієнті
Якщо змінюєте порт сервера, оновіть URL в наступних файлах:
- `client/src/services/authService.ts`
- `client/src/services/productService.ts`
- `client/src/services/userService.ts`

Приклад URL: `http://localhost:5305/api/devices`

## 🔌 Розширення функціональності

### Додавання нових джерел даних
Для інтеграції з новими API створіть файли за зразком:

**API сервіс**:
```
server/src/services/api/dummyJsonService.ts
```

**Адаптер**:
```
server/src/services/adapters/DummyJsonAdapter.ts
```

### Додавання зображень
Розмістіть зображення в папці:
```
client/public/images/
```

Вони будуть доступні за посиланням:
```
http://localhost:5173/images/назва_файлу.png
```

## 📊 Розмір проекту

Загальний розмір: **~350 МБ**

- 📱 Клієнт: 140 МБ
- 🗄️ База даних: 75 МБ
- 🖥️ Сервер: 50 МБ
- 🧪 Тести: 75 МБ
- 📄 Інші файли: ~10 МБ

## 🛠️ Розробка

### Структура API
- **База URL**: `http://localhost:5305/api`
- **Автентифікація**: JWT токени
- **База даних**: MongoDB

### Тестування
Тести розташовані в папці `tests/` та покривають як frontend, так і backend функціональність.

## 📝 Додаткові примітки

- Переконайтеся, що порти 5305 (сервер) та 5173 (клієнт) вільні
- Для production використання змініть JWT_SECRET на більш безпечний
- Регулярно створюйте резервні копії бази даних

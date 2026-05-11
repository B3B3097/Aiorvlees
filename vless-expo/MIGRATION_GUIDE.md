# Инструкция по переходу на Development Build

## Что было сделано

Создан новый проект `vless-expo` с полной поддержкой **Expo Development Build** для работы с нативными VPN модулями.

## 📁 Структура проекта

```
vless-expo/
├── app/                    # Исходный код приложения (expo-router)
│   └── index.tsx          # Главный экран с UI и логикой VPN
├── assets/                # Иконки и изображения
├── .github/workflows/     # GitHub Actions для автосборки
│   └── build-apk.yml      # Workflow для сборки APK
├── app.json               # Конфигурация Expo
├── eas.json               # Профили сборки EAS
├── package.json           # Зависимости и скрипты
├── tsconfig.json          # Настройки TypeScript
├── babel.config.js        # Конфигурация Babel
├── .gitignore             # Игнорируемые файлы
└── README.md              # Документация
```

## 🔑 Ключевые изменения

### 1. Переход от Expo Go к Development Build

**Раньше (Expo Go):**
```bash
npx expo start
```
❌ Не работает с нативными модулями (VPN)

**Теперь (Development Build):**
```bash
npm run prebuild              # Генерация нативного кода
eas build --profile development --platform android  # Сборка APK
```
✅ Работает с `react-native-wireguard` и другими native модулями

### 2. Добавлена библиотека react-native-wireguard

Подключена через plugin в `app.json`:
```json
"plugins": [
  ["react-native-wireguard", {
    "vpnName": "VLess VPN",
    "bundleId": "com.vlesshunter.app"
  }]
]
```

### 3. Настроен EAS Build

Файл `eas.json` содержит три профиля:
- **development** - Debug APK для тестирования
- **preview** - Preview для внутреннего тестирования  
- **production** - Release AAB для Google Play

### 4. GitHub Actions автоматизация

Workflow `.github/workflows/build-apk.yml`:
- Автоматически запускается при push в main/master
- Устанавливает зависимости
- Выполняет `prebuild` для генерации нативного кода
- Запускает `eas build --profile development`
- Загружает APK как артефакт
- Опционально создает релиз на GitHub

## 🚀 Быстрый старт

### Шаг 1: Установка зависимостей

```bash
cd vless-expo
npm install
```

### Шаг 2: Настройка Expo аккаунта

```bash
# Войти в аккаунт
eas login

# Инициализировать проект (получить PROJECT_ID)
eas init
```

### Шаг 3: Запуск локальной разработки

```bash
# Первый запуск требует prebuild
npm run prebuild

# Запуск development клиента
npm run android
# или для iOS
npm run ios
```

### Шаг 4: Сборка APK

```bash
# Development APK (для тестирования)
npm run build:dev

# Production APK/AAB (для публикации)
npm run build:prod
```

### Шаг 5: Настройка GitHub Actions

1. В репозитории GitHub перейдите в **Settings → Secrets and variables → Actions**

2. Добавьте секреты:
   ```
   EXPO_TOKEN=<ваш токен из eas login>
   EAS_PROJECT_ID=<из app.json или eas init>
   ```

3. Запушьте код в main branch - сборка запустится автоматически

## 📱 Как использовать приложение

1. **Добавление конфигурации:**
   - Введите название (опционально)
   - Вставьте VLESS URL в формате `vless://uuid@host:port?path...`
   - Нажмите "Сохранить"

2. **Подключение к VPN:**
   - Выберите сохраненную конфигурацию из списка
   - Нажмите "Подключить"
   - Разрешите подключение VPN в системном диалоге

3. **Отключение:**
   - Нажмите "Отключить VPN"

## ⚠️ Важные замечания

### VLESS Protocol Support

Текущая реализация использует WireGuard как транспорт. Для полноценной работы с VLESS:

1. **Вариант A**: Используйте промежуточный прокси (sing-box, Xray-core)
   - Настройте сервер для преобразования VLESS ↔ WireGuard
   - Приложение подключается через WireGuard

2. **Вариант B**: Добавьте прямую поддержку VLESS
   - Создайте собственный native модуль
   - Используйте библиотеки типа libv2ray или sing-box

3. **Вариант C**: Используйте готовое решение
   - Интегрируйте существующие VPN клиенты с открытым кодом
   - Адаптируйте UI под ваши нужды

### Разрешения Android

В `app.json` уже добавлены необходимые разрешения:
```json
"permissions": [
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE"
]
```

Для VPN также может потребоваться:
```json
"android.permission.BIND_VPN_SERVICE"
```
(добавляется автоматически плагином react-native-wireguard)

## 🔧 Troubleshooting

### Ошибка: "Module not found: react-native-wireguard"

```bash
npm install
npm run prebuild --clean
```

### Ошибка сборки: "EAS_PROJECT_ID not configured"

Проверьте `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

### GitHub Actions падает с ошибкой аутентификации

Убедитесь, что секреты правильно настроены:
```bash
# Получите токен
eas login
# Скопируйте токен и добавьте в GitHub Secrets как EXPO_TOKEN
```

### VPN не подключается

1. Проверьте логи: `adb logcat | grep -i wireguard`
2. Убедитесь, что конфигурация корректна
3. Проверьте доступность сервера

## 📊 Сравнение подходов

| Характеристика | Expo Go | Development Build |
|---------------|---------|-------------------|
| Нативные модули | ❌ Нет | ✅ Да |
| VPN поддержка | ❌ Нет | ✅ Да |
| Время сборки | ~1 мин | ~10-15 мин |
| Размер APK | N/A | ~50-70 MB |
| Hot reload | ✅ Да | ✅ Да (с ограничениями) |
| Production ready | ❌ Нет | ✅ Да |

## 🎯 Следующие шаги

1. **Настройте сервер**: Подготовьте VLESS/WireGuard сервер
2. **Протестируйте локально**: Соберите development APK и установите на устройство
3. **Настройте CI/CD**: Добавьте секреты в GitHub и протестируйте автосборку
4. **Доработайте парсинг**: Реализуйте полноценный парсер VLESS URL
5. **Добавьте функции**: Импорт/экспорт конфигов, статистика трафика и т.д.

## 📚 Полезные ссылки

- [Expo Development Builds](https://docs.expo.dev/development/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/eas/)
- [react-native-wireguard](https://github.com/tradle/react-native-wireguard)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

**Готово!** Проект полностью настроен для работы с Development Build и нативными VPN модулями.

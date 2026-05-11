# 📱 VLess Hunter - Готовый APK для Android

**Просто скачайте и установите!** Никакой сборки и настройки не требуется.

## ⬇️ Скачать APK

### Последний релиз
Перейдите в раздел [Releases](https://github.com/YOUR_USERNAME/YOUR_REPO/releases) и скачайте последний APK файл.

### Автоматические сборки
Все сборки доступны в разделе [Actions](https://github.com/YOUR_USERNAME/YOUR_REPO/actions):
1. Откройте последний запуск workflow
2. Прокрутите вниз до секции **Artifacts**
3. Скачайте `vless-hunter-development-apk.zip`
4. Распакуйте и установите на Android устройство

## 🚀 Что это?

Приложение для управления VLESS конфигурациями с встроенным VPN клиентом.

### Особенности
- ✅ **Готовый к использованию** - просто установите APK
- ✅ **Нативный VPN** - использует react-native-wireguard
- ✅ **Сохранение конфигов** - хранит ваши VLESS URL локально
- ✅ **Автоматические обновления** - новые сборки появляются после каждого обновления кода

## 📲 Установка на Android

1. **Скачайте APK** из раздела Releases или Actions
2. **Разрешите установку** из неизвестных источников:
   - Настройки → Безопасность → Неизвестные источники → Включить
3. **Установите приложение** как обычный APK файл
4. **Запустите** и добавьте вашу VLESS конфигурацию

## 🔧 Для разработчиков

Если вы хотите собрать свою версию:

### Требования
- Node.js 18+
- Аккаунт на [expo.dev](https://expo.dev)
- EAS CLI (`npm install -g eas-cli`)

### Быстрый старт

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Установить зависимости
npm install

# Войти в Expo
eas login

# Собрать development APK
npm run build:dev
```

### Автоматическая сборка через GitHub

Настройте секреты в вашем репозитории:
1. Settings → Secrets and variables → Actions
2. Добавьте:
   - `EXPO_TOKEN` - получите через `eas login`
   - `EAS_PROJECT_ID` - из app.json или после `eas init`

После каждого пуша в main/master ветку APK будет собираться автоматически!

## ⚙️ Технологии

- **Expo SDK 51** с Development Build
- **React Native** 0.74
- **react-native-wireguard** - нативный VPN модуль
- **EAS Build** - облачная сборка APK
- **GitHub Actions** - CI/CD автоматизация

## ⚠️ Важно

- Это **Development Build** с отладочными символами
- Для production используйте `npm run build:prod`
- Приложение требует разрешения на создание VPN подключения
- Используйте только легальные VLESS конфигурации

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте [Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
2. Создайте новый issue с описанием проблемы
3. Приложите логи устройства (Logcat)

---

**Лицензия:** MIT  
**Совместимость:** Android 8.0+

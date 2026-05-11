# VLESS VPN App (Expo Development Build)

📱 **Готовый APK для Android** — просто скачайте и установите!

## 🚀 Быстрый старт

1. Перейдите в раздел **[Releases](../../releases)** или **[Actions](../../actions)**
2. Скачайте последний файл `.apk`
3. Установите на Android-устройство
4. Запустите приложение и добавьте VLESS конфигурацию

## 📦 О приложении

Это приложение построено на **React Native + Expo** с использованием **EAS Build** для создания нативного APK с поддержкой VPN через `react-native-wireguard`.

### Особенности:
- ✅ Поддержка VLESS протокола
- ✅ Встроенный VPN клиент (WireGuard-based)
- ✅ Простой и понятный интерфейс
- ✅ Автоматическая сборка через GitHub Actions
- ✅ Готовые бинарники в Releases

## 🔧 Для разработчиков

Если вы хотите собрать приложение самостоятельно:

```bash
cd vless-expo
npm install
eas login
eas init
npm run prebuild
eas build --profile development --platform android
```

### Требования:
- Node.js 18+
- Expo CLI
- EAS Build аккаунт

## 📄 Лицензия

MIT License

---

**⚠️ Важно:** Используйте только легальные VLESS конфигурации и соблюдайте законы вашей страны.

# 🚀 Free VPN - GitHub Edition

Полностью бесплатное VPN решение, развертываемое через GitHub Pages + Cloudflare Workers. Никаких серверов, только код.

## 🏗 Архитектура

1. **Frontend (GitHub Pages)**: Мобильное веб-приложение (PWA) в одном файле `index.html`.
2. **Proxy (Cloudflare Workers)**: Бесплатный прокси-сервер для обхода блокировок.
3. **Scanner**: Поиск конфигов прямо в GitHub Issues и репозиториях.

## ⚡ Быстрый старт

### Шаг 1: Развернуть Приложение
1. Зайди в настройки репозитория -> **Pages**.
2. Включи GitHub Pages (Source: GitHub Actions).
3. Запусти Action `Build FreeVPN App` (или сделай push).
4. Твое приложение доступно по ссылке вида: `https://username.github.io/repo-name/`

### Шаг 2: Поднять Прокси (Cloudflare Worker)
Создай новый Worker на [dash.cloudflare.com](https://dash.cloudflare.com/) и вставь этот код:

```javascript
// worker.js - Код для Cloudflare Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Проверка доступности
    if (url.pathname === '/ping') {
      return new Response('OK', { status: 200 });
    }

    // Получаем целевой URL из заголовка или query параметра
    const targetUrl = request.headers.get('X-Target-URL') || url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing target URL', { status: 400 });
    }

    // Создаем запрос к целевому серверу
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    try {
      const response = await fetch(newRequest);
      
      // Возвращаем ответ с CORS заголовками
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Target-URL');
      
      return newResponse;
    } catch (e) {
      return new Response('Proxy Error: ' + e.message, { status: 500 });
    }
  }
};
```

**Важно:** В настройках Worker включи **CORS** и добавь свой домен приложения в разрешенные.

### Шаг 3: Использование
1. Открой приложение на телефоне.
2. В поле **Worker URL** вставь ссылку на твой Worker (например: `https://my-proxy.user.workers.dev`).
3. Найди конфиг во вкладке "Поиск" или вставь свой VLESS.
4. Нажми **Подключиться**.

## 🔍 Как работает поиск конфигов?
Приложение использует GitHub API для поиска по публичным репозиториям.
- Ищет файлы с расширением `.txt`, `.json`.
- Ключевые слова: `vless`, `vmess`, `trojan`.
- *Лимит API: 60 запросов в час без токена.*

## 📂 Структура
- `app.yaml` - Конфигурация GitHub Actions (собирает приложение).
- `README.md` - Эта инструкция.
- `worker.js` - Код для копирования в Cloudflare (выше).

## ⚠️ Ограничения
- Это **HTTP Proxy**, а не системный VPN (браузер не позволяет поднимать туннели на уровне ОС без Native App).
- Для полного проксирования всего трафика телефона нужно использовать сторонние клиенты (v2rayNG, Shadowrocket), указав им этот Worker как прокси.
- Cloudflare Workers имеет лимиты бесплатного тарифа (100k запросов/день).

---
*Сделано за 5 минут. Работает бесплатно.*

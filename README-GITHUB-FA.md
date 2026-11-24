# Piano Rain — آماده‌سازی GitHub و APK

این پروژه بازی وب React/Vite است. نسخه اجرایی بازی در `index.html` و `src/game.js` قرار دارد.

## اجرای محلی وب

نیازمند Node.js 22:

```bash
npm install
npm run dev
```

## ساخت APK از طریق GitHub

1. محتویات این پوشه را در ریشه یک repository جدید GitHub قرار دهید.
2. فایل‌ها را روی شاخه `main` یا `master` push کنید.
3. به تب **Actions** بروید و workflow با نام **Build Android APK** را باز کنید.
4. پس از موفقیت، از بخش **Artifacts** فایل `piano-rain-debug-apk` را دریافت کنید.
5. ZIP آرتیفکت را باز کنید؛ فایل `app-debug.apk` داخل آن است.

می‌توانید از گزینه **Run workflow** نیز Build را دستی اجرا کنید.

## نکات

- خروجی فعلی Debug APK برای نصب و آزمایش است؛ انتشار در Google Play به نسخه Release امضاشده نیاز دارد.
- شناسه برنامه در `capacitor.config.ts` برابر `com.amirhosini.pianorain` است؛ در صورت نیاز پیش از اولین Build تغییرش دهید.
- بازی بازنویسی نشده و فایل‌های اجرایی اصلی حفظ شده‌اند.
- `src/App.tsx` صفحه نمونه است، اما `index.html` مستقیماً `src/game.js` را بارگذاری می‌کند؛ مسیر فعلی بازی بر همین اساس حفظ شده است.
- فونت‌های Google Fonts از اینترنت دریافت می‌شوند و در اجرای آفلاین ممکن است فونت جایگزین دیده شود.
- Workflow از `npm install` استفاده می‌کند تا lockfile موجود را با وابستگی‌های Capacitor به‌روز کند.

# لوحة تحكم رادار المبيعات — تعليمات التشغيل

## الخطوات

1. فك ضغط المجلد وافتحه في VS Code.
2. افتح التيرمنل (Ctrl + `) وشغّل:

   ```
   npm install
   ```

   هذا بيحمّل كل المكتبات المطلوبة (React, Vite, Tailwind, Recharts, lucide-react).

3. بعد ما يخلص التثبيت، شغّل:

   ```
   npm run dev
   ```

4. بيطلع لك رابط زي:

   ```
   http://localhost:5173
   ```

   افتحه في المتصفح وبتشوف الداشبورد شغال بكامل التصميم والرسوم البيانية.

## بنية المشروع

```
sales-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      ← نقطة الدخول
    ├── App.jsx        ← كود الداشبورد كامل (SalesDashboard)
    └── index.css      ← تفعيل Tailwind
```

## لو حبيت تبني نسخة نهائية للنشر

```
npm run build
```

بينشئ لك مجلد `dist` جاهز ترفعه على أي استضافة (Vercel, Netlify... إلخ).

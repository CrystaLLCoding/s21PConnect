# 🛡️ PeerConnect 21

> **School 21 peerlari uchun anonim autentifikatsiya, loyihalar lentalari va o‘zaro rozilik (Accept) orqali jamoa shakllantirish platformasi.**

🌐 **Jonli Platforma:** [https://s21-connect.vercel.app](https://s21-connect.vercel.app)  
🤖 **Rasmiy Telegram Bot:** [@s21Regbot](https://t.me/s21Regbot)

PeerConnect 21 — School 21 (Toshkent / Samarqand) kadetlari uchun shaxsiy kontaktlarini (ism, telefon raqami, Telegram) oshkor qilmasdan startap loyihalariga jamoa to‘plash, vakansiyalar e’lon qilish va nomzodlarni tanlash imkonini beruvchi zamonaviy veb-platforma.

---

## 🌟 Asosiy Imkoniyatlar (Features)

1. **🤖 Real Telegram Bot Onboarding (`@s21Regbot`)**:
   - Talabalar ro‘yxatdan o‘tishni rasmiy Telegram bot orqali amalga oshiradi.
   - Telefon raqami Telegram orqali xavfsiz tasdiqlanadi.
   - Har bir kadetga tizimda tahrirlab bo‘lmaydigan, doimiy **unikal anonim nik** (masalan: `@silent_core_73`, `@quantum_coder_42`) beriladi.

2. **🔒 Anonimlik & Maxfiylik**:
   - Veb-platformada kadetning haqiqiy ismi, telefon raqami va Telegram usernamesi butunlay yashirin bo‘ladi.
   - Kartalarda faqat `@anon_nick`, daraja (`Pooler`, `Common Core Lvl 4`, `Lvl 8`, `Lvl 10`), dasturlash ko‘nikmalari (skills) va qiziqishlari ko‘rinadi.

3. **🤝 O‘zaro Rozilik (Mutual Consent) Mexanizmi**:
   - Nomzod loyihaga anonim ariza yuboradi.
   - Loyiha egasi arizani qabul qilgandagina (**Accept**), ikkala tomon uchun real aloqa kontaktlari (telefon, Telegram link `https://t.me/<username>`) ochiladi.
   - Rad etish (**Reject**) tanlanganda esa, nomzodga nima sababdan rad etilgani majburiy asoslab yoziladi va bu xabar nomzodning Telegramiga yuboriladi.

4. **🚀 Ochiq Loyihalar Lentasi & needed_roles**:
   - Kadetlar o‘z startaplarini e’lon qilishi va kerakli mutaxassisliklar (masalan: `Frontend (React)`, `C Backend`, `AI/ML`, `Python`, `Docker`) bo‘yicha filtrlar orqali bir zumda jamoa topishi mumkin.

5. **🏢 Kampus Switcher**:
   - Tashkent, Samarkand yoki Cross-Campus loyihalarini qulay filtrlash.

---

## 🛠 Texnologiyalar Steki (Tech Stack)

- **Framework**: [Next.js 16 (App Router, Turbopack)](https://nextjs.org/)
- **Frontend**: React 19, TypeScript, Vanilla & Tailwind CSS v4, Lucide Icons
- **Backend & API**: Next.js Server Route Handlers (`/api/sync`)
- **Telegram Bot**: Node.js Long-polling Bot Service (`scripts/telegramBot.mjs`)
- **Storage**: JSON Data Layer (`src/data/db.json`)

---

## 🚀 Ishga Tushirish (Getting Started)

### 1. Repozitoriyani klonlash va paketlarni o‘rnatish:

```bash
git clone https://github.com/<your-username>/PeerConnect21.git
cd PeerConnect21
npm install
```

### 2. Muhit o‘zgaruvchilarini sozlash:

`.env.example` dan nusxa olib `.env.local` yarating:

```env
TELEGRAM_BOT_TOKEN=8330190118:AAHyBk-93duHmcg-xdTZuqHP3co3o_xqtcA
```

### 3. Veb-serverni ishga tushirish:

```bash
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) manziliga kiring.

### 4. Telegram Bot xizmatini yoqish:

Alohida terminal oynasida bot servisini ishga tushiring:

```bash
npm run bot
```

Endi Telegram ilovangizda **[@s21Regbot](https://t.me/s21Regbot)** ga kirib `/start` bosish orqali to‘liq ro‘yxatdan o‘tish va matchmaking jarayonini sinab ko‘rishingiz mumkin!

---

## 📋 Ma'lumotlar Modeli (Data Schema)

```typescript
// Foydalanuvchi modeli
export interface User {
  telegram_id: number | string;
  full_name: string;
  phone_number: string;
  telegram_username: string;
  anon_nick: string; // Unikal, read-only
  password_hash: string;
  skills: string[];
  interests: string;
  campus?: 'Tashkent' | 'Samarkand';
  level?: string;
  avatar?: string;
}

// Loyiha modeli
export interface Project {
  project_id: string;
  owner_nick: string;
  title: string;
  description: string;
  needed_roles: string[];
  status: 'open' | 'closed';
  campus?: 'Tashkent' | 'Samarkand' | 'Cross-Campus';
  created_at?: string;
}

// Ariza modeli
export interface Application {
  application_id: string;
  project_id: string;
  applicant_nick: string;
  status: 'pending' | 'accepted' | 'rejected';
  reject_reason?: string;
  created_at?: string;
}
```

---

## 📄 Litsenziya

MIT License. School 21 talabalari va jamoalari uchun ochiq manbali kod.

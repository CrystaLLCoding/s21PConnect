import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const content = await fs.readFile(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch {}
}
await loadEnv();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8330190118:AAHyBk-93duHmcg-xdTZuqHP3co3o_xqtcA';
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;
const DB_PATH = path.resolve(__dirname, '../src/data/db.json');
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://s21-connect.vercel.app';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const ADJECTIVES = ['silent', 'quantum', 'matrix', 'zero_leak', 'cyber', 'neon', 'shadow', 'turing', 'hyper', 'crypto'];
const NOUNS = ['coder', 'pooler', 'cadet', 'sam', 'hacker', 'dev', 'pilot', 'ninja', 'core', 'wizard'];

function generateRandomNick() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90 + 10);
  return `${adj}_${noun}_${num}`;
}

async function readDb() {
  if (supabase) {
    try {
      const [uRes, pRes, aRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('applications').select('*'),
      ]);
      if (uRes.data && pRes.data) {
        return {
          users: uRes.data,
          projects: pRes.data,
          applications: aRes.data || [],
        };
      }
    } catch {}
  }
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { users: [], projects: [], applications: [] };
  }
}

async function writeDb(db) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch {}
}

async function api(method, params = {}) {
  try {
    const res = await fetch(`${BASE_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API Error in ${method}:`, err.message);
    return null;
  }
}

const userSessions = new Map();

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  const db = await readDb();

  const existingUser = db.users.find(u => Number(u.telegram_id) === Number(chatId));

  if (text === '/start') {
    if (existingUser) {
      await api('sendMessage', {
        chat_id: chatId,
        text: `👋 <b>Qaytganingiz bilan, ${existingUser.full_name}!</b>\n\n` +
          `Siz allaqachon PeerConnect 21 platformasida ro‘yxatdan o‘tgansiz.\n\n` +
          `👤 <b>Unikal anonim nik:</b> <code>@${existingUser.anon_nick}</code>\n` +
          `🔑 <b>Veb-parol:</b> <code>${existingUser.password_hash}</code>\n` +
          `🏢 <b>Kampus:</b> ${existingUser.campus || 'Tashkent'}\n` +
          `⚡ <b>Ko‘nikmalar:</b> ${existingUser.skills.join(', ')}\n\n` +
          `🌐 <b>Veb-sayt:</b> ${WEB_APP_URL}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Veb-Platformaga Kirish', url: WEB_APP_URL }],
          ],
        },
      });
      return;
    }

    // Start registration
    userSessions.set(chatId, { step: 'awaiting_contact' });

    await api('sendMessage', {
      chat_id: chatId,
      text: `👋 <b>Assalomu alaykum!</b>\n\n` +
        `Men <b>PeerConnect 21</b> — School 21 campusida shaxsiy kontaktlarni oshkor qilmasdan anonim jamoa yig‘ish va loyihalar almashish platformasining rasmiy botiman.\n\n` +
        `Ro‘yxatdan o‘tish va tizimda <b>o‘zgarmas unikal anonim nik</b> olish uchun pastdagi tugma orqali telefon raqamingizni tasdiqlang:`,
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [{ text: '📱 Telefon raqamni yuborish', request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return;
  }

  const session = userSessions.get(chatId);

  // Handle Contact
  if (msg.contact) {
    const contact = msg.contact;
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || msg.from.first_name || 'School 21 Peer';
    const phoneNumber = contact.phone_number.startsWith('+') ? contact.phone_number : `+${contact.phone_number}`;
    const username = msg.from.username || '';

    const anonNick = generateRandomNick();

    userSessions.set(chatId, {
      step: 'awaiting_password',
      telegram_id: chatId,
      full_name: fullName,
      phone_number: phoneNumber,
      telegram_username: username,
      anon_nick: anonNick,
    });

    await api('sendMessage', {
      chat_id: chatId,
      text: `Rahmat, <b>${fullName}</b>! Telefon raqamingiz qabul qilindi. 📱\n\n` +
        `Tizim sizga quyidagi <b>unikal anonim nikni</b> berdi:\n` +
        `🛡️ <code>@${anonNick}</code> (buni keyin o‘zgartirib bo‘lmaydi)\n\n` +
        `Endi veb-platformaga kirish uchun <b>parol</b> o‘ylab toping va yozib yuboring:`,
      parse_mode: 'HTML',
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  // Handle Password step
  if (session && session.step === 'awaiting_password' && text) {
    session.password_hash = text;
    session.step = 'awaiting_campus';

    await api('sendMessage', {
      chat_id: chatId,
      text: `Parol qabul qilindi! 🔒\n\nQaysi kampusda o‘qiysiz?`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🏢 Tashkent', callback_data: 'campus_Tashkent' },
            { text: '🏢 Samarkand', callback_data: 'campus_Samarkand' },
          ],
        ],
      },
    });
    return;
  }

  // Fallback info
  await api('sendMessage', {
    chat_id: chatId,
    text: `Bot bilan ishlash uchun /start buyrug‘ini yuboring.`,
  });
}

async function handleCallbackQuery(query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  const session = userSessions.get(chatId);

  await api('answerCallbackQuery', { callback_query_id: query.id });

  if (!session) {
    const existing = db.users.find(u => Number(u.telegram_id) === Number(chatId));
    if (existing) {
      await api('sendMessage', {
        chat_id: chatId,
        text: `🎉 <b>Siz allaqachon muvaffaqiyatli ro‘yxatdan o‘tgansiz!</b>\n\n` +
          `👤 <b>Anonim nik:</b> <code>@${existing.anon_nick}</code>\n` +
          `🔑 <b>Veb-parol:</b> <code>${existing.password_hash}</code>\n` +
          `🏢 <b>Kampus:</b> ${existing.campus || 'Tashkent'}\n` +
          `⚡ <b>Stek:</b> ${existing.skills.join(', ')}\n\n` +
          `🌐 <b>Veb-sayt:</b> ${WEB_APP_URL}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Veb-Platformaga Kirish', url: WEB_APP_URL }],
          ],
        },
      });
      return;
    }

    await api('sendMessage', {
      chat_id: chatId,
      text: `Iltimos, ro‘yxatdan o‘tishni qaytadan boshlash uchun /start buyrug‘ini bosing.`,
    });
    return;
  }

  // Campus selection
  if (data.startsWith('campus_')) {
    const campus = data.replace('campus_', '');
    session.campus = campus;
    session.step = 'awaiting_level';

    await api('editMessageText', {
      chat_id: chatId,
      message_id: query.message.message_id,
      text: `Kampus: <b>${campus}</b> ✅\n\nSchool 21 dagi darajangiz (Level) qaysi?`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🏊 Pooler', callback_data: 'lvl_Pooler' },
            { text: '⚡ Common Core Lvl 4', callback_data: 'lvl_Common Core Lvl 4' },
          ],
          [
            { text: '🏆 Common Core Lvl 8', callback_data: 'lvl_Common Core Lvl 8' },
            { text: '🚀 Lvl 10+', callback_data: 'lvl_Lvl 10' },
          ],
        ],
      },
    });
    return;
  }

  // Level selection
  if (data.startsWith('lvl_')) {
    const level = data.replace('lvl_', '');
    session.level = level;
    session.step = 'awaiting_skill';

    await api('editMessageText', {
      chat_id: chatId,
      message_id: query.message.message_id,
      text: `Daraja: <b>${level}</b> ✅\n\nAsosiy dasturlash yo‘nalishingiz (asosiy stek) qaysi?`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💻 C/C++', callback_data: 'skill_C/C++' },
            { text: '🐍 Python', callback_data: 'skill_Python' },
          ],
          [
            { text: '⚛️ Frontend (React)', callback_data: 'skill_Frontend (React)' },
            { text: '🤖 AI/ML', callback_data: 'skill_AI/ML' },
          ],
          [
            { text: '⚙️ C Backend / Go', callback_data: 'skill_C Backend' },
            { text: '🐳 DevOps / Docker', callback_data: 'skill_Docker' },
          ],
        ],
      },
    });
    return;
  }

  // Skill selection & Finalize
  if (data.startsWith('skill_')) {
    const skill = data.replace('skill_', '');
    session.skills = [skill, 'Algorithms'];

    const newUser = {
      telegram_id: session.telegram_id,
      full_name: session.full_name,
      phone_number: session.phone_number,
      telegram_username: session.telegram_username || session.anon_nick,
      anon_nick: session.anon_nick,
      password_hash: session.password_hash,
      skills: session.skills,
      interests: `School 21 ${session.campus} campus startaplarida ishlash va jamoa tuzish`,
      campus: session.campus,
      level: session.level,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${session.anon_nick}`,
    };

    const currentDb = await readDb();
    currentDb.users = currentDb.users.filter(u => Number(u.telegram_id) !== Number(session.telegram_id));
    currentDb.users.push(newUser);
    await writeDb(currentDb);

    if (supabase) {
      try {
        await supabase.from('users').upsert(newUser);
      } catch (err) {
        console.error('Supabase direct write error:', err.message);
      }
    }

    try {
      await fetch(`${WEB_APP_URL}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register_user', user: newUser }),
      });
    } catch (err) {
      console.error('Failed to sync user to web app:', err.message);
    }

    userSessions.delete(chatId);

    await api('editMessageText', {
      chat_id: chatId,
      message_id: query.message.message_id,
      text: `🎉 <b>Tabriklaymiz, profilingiz muvaffaqiyatli faollashtirildi!</b>\n\n` +
        `👤 <b>Anonim nikingiz:</b> <code>@${newUser.anon_nick}</code>\n` +
        `🔑 <b>Veb-parol:</b> <code>${newUser.password_hash}</code>\n` +
        `🏢 <b>Kampus:</b> ${newUser.campus}\n` +
        `⚡ <b>Stek:</b> ${skill}\n\n` +
        `🔒 <i>Eslatma:</i> Platformada sizning ismingiz va telefon raqamingiz to‘liq yashirin bo‘ladi. Faqat loyiha egasi arizangizni qabul qilganda (Accept) o‘zaro kontaktlar almashiladi.\n\n` +
        `🌐 <b>Veb-saytga kiring:</b> ${WEB_APP_URL}\n` +
        `Yuqoridagi anonim nik va parolingiz bilan platformada «Kirish» tugmasini bosing.`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Veb-Platformaga Kirish', url: WEB_APP_URL }],
        ],
      },
    });
  }
}

async function runLongPolling() {
  console.log(`🤖 PeerConnect 21 Telegram Bot ishga tushdi (@s21Regbot)...`);
  let offset = 0;

  while (true) {
    try {
      const res = await api('getUpdates', { offset, timeout: 25 });
      if (res && res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          offset = update.update_id + 1;
          if (update.message) {
            await handleMessage(update.message);
          } else if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
          }
        }
      }
    } catch (err) {
      console.error('Polling error, retrying in 3s...', err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

runLongPolling();

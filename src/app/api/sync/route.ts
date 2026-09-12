import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/data/db.json');
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8330190118:AAHyBk-93duHmcg-xdTZuqHP3co3o_xqtcA';

interface UserRecord {
  telegram_id: number | string;
  full_name: string;
  phone_number: string;
  telegram_username: string;
  anon_nick: string;
  password_hash: string;
  skills: string[];
  interests: string;
  campus?: 'Tashkent' | 'Samarkand';
  level?: string;
  avatar?: string;
}

interface ProjectRecord {
  project_id: string;
  owner_nick: string;
  title: string;
  description: string;
  needed_roles: string[];
  status: 'open' | 'closed';
  created_at?: string;
  campus?: 'Tashkent' | 'Samarkand' | 'Cross-Campus';
}

interface ApplicationRecord {
  application_id: string;
  project_id: string;
  applicant_nick: string;
  status: 'pending' | 'accepted' | 'rejected';
  reject_reason?: string;
  created_at?: string;
}

interface DbStructure {
  users: UserRecord[];
  projects: ProjectRecord[];
  applications: ApplicationRecord[];
}

async function getDb(): Promise<DbStructure> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], projects: [], applications: [] };
  }
}

async function saveDb(data: DbStructure) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function sendTelegramMessage(chatId: string | number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDb();

  if (body.action === 'add_project') {
    db.projects.unshift(body.project);
    await saveDb(db);
    return NextResponse.json({ success: true, projects: db.projects });
  }

  if (body.action === 'apply') {
    db.applications.unshift(body.application);
    await saveDb(db);

    const project = db.projects.find((p) => p.project_id === body.application.project_id);
    if (project) {
      const owner = db.users.find((u) => u.anon_nick.toLowerCase() === project.owner_nick.toLowerCase());
      if (owner && owner.telegram_id) {
        await sendTelegramMessage(
          owner.telegram_id,
          `📬 *Loyihangizga yangi anonim ariza kelib tushdi!*\n\n` +
          `🚀 *Loyiha:* ${project.title}\n` +
          `👤 *Nomzod:* @${body.application.applicant_nick}\n\n` +
          `Arizani qabul qilish yoki rad etish uchun platformaga kiring:\n` +
          `http://localhost:3000`
        );
      }
    }

    return NextResponse.json({ success: true, applications: db.applications });
  }

  if (body.action === 'accept_application') {
    const app = db.applications.find((a) => a.application_id === body.application_id);
    if (app) {
      app.status = 'accepted';
      await saveDb(db);

      const applicant = db.users.find((u) => u.anon_nick.toLowerCase() === app.applicant_nick.toLowerCase());
      const project = db.projects.find((p) => p.project_id === app.project_id);
      const owner = project ? db.users.find((u) => u.anon_nick.toLowerCase() === project.owner_nick.toLowerCase()) : null;

      if (applicant && applicant.telegram_id && owner) {
        await sendTelegramMessage(
          applicant.telegram_id,
          `🎉 *Arizangiz qabul qilindi!*\n\n` +
          `Sizning *"${project?.title}"* loyihasiga yuborgan arizangiz qabul qilindi.\n\n` +
          `O‘zaro rozilik (Accept) orqali kontaktlar ochildi:\n` +
          `👤 *Loyiha egasi:* ${owner.full_name}\n` +
          `📞 *Telefon:* ${owner.phone_number}\n` +
          `💬 *Telegram:* @${owner.telegram_username}\n\n` +
          `Bog‘lanish uchun: https://t.me/${owner.telegram_username}`
        );
      }
    }
    return NextResponse.json({ success: true, applications: db.applications });
  }

  if (body.action === 'reject_application') {
    const app = db.applications.find((a) => a.application_id === body.application_id);
    if (app) {
      app.status = 'rejected';
      app.reject_reason = body.reason;
      await saveDb(db);

      const applicant = db.users.find((u) => u.anon_nick.toLowerCase() === app.applicant_nick.toLowerCase());
      const project = db.projects.find((p) => p.project_id === app.project_id);

      if (applicant && applicant.telegram_id) {
        await sendTelegramMessage(
          applicant.telegram_id,
          `ℹ️ *"${project?.title}" loyihasiga yuborilgan ariza*\n\n` +
          `Arizangiz rad etildi.\n` +
          `*Sabab:* ${body.reason}`
        );
      }
    }
    return NextResponse.json({ success: true, applications: db.applications });
  }

  return NextResponse.json({ success: true, db });
}

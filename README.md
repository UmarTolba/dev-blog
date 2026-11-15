# Minimal Blog

A responsive blog built with Next.js, React, TypeScript, Markdown, and SQLite. Visitors can read and browse articles; registered users can write and manage their own articles; administrators can manage every article.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

## Accounts and roles

Visitors can read articles. Register an account to upload Markdown or create, edit, and delete your own articles. The administrator can edit and delete all articles.

Administrators can use `/admin` to review article/account totals and manage every article.

To create the first administrator, add these values to `nextjs-blog/.env.local` before starting the app:

```text
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-private-password-of-at-least-12-characters
```

Restart the app after changing environment values. The admin account is created the first time someone signs in or registers; its email and password are synchronized from these values. New registrations always receive the `user` role.

## Articles and storage

Use **Add an article** to write a Markdown article with a title, category, and date (`DD-MM-YYYY`). The app saves the generated `.md` file in `articles/`; SQLite stores its relative path and the creating user's ID. Existing Markdown articles are indexed in SQLite too. Removed files are pruned from the index.

Use **Upload an article** to add an existing `.md` file. Front matter must include `title`, `category`, and `date`, for example:

```yaml
---
title: "A sample article"
category: "notes"
date: "15-11-2026"
---

# Article text
```

The SQLite database is created at `.data/articles.db`. Accounts, roles, sessions, and article-path ownership are kept there. The database and uploaded Markdown files are local to the server and should be backed up together.

Double-bracketed YouTube URLs, such as `[[https://youtu.be/VIDEO_ID]]`, are displayed as responsive video embeds. Markdown images are supported; place image files in `public/` and use their public URL.

## Configuration

Set `CONTACT_EMAIL` in `.env.local` to enable the email link on the Contact page. No contact address is hardcoded.

## Project notes

The project uses Next.js route handlers and SQLite. Express and MongoDB are intentionally not used for this implementation.

Before submission, add your actual team members and contributions:

| Team member | Contribution |
| --- | --- |
| Add name | Add contribution |
| Add name | Add contribution |
| Add name | Add contribution |

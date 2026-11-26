# WARM MEDIA

The original public site and admin page now use Supabase Auth, Database, and Storage while keeping the existing page structure and visual styles.

## Files and local run

- `index.html` — public news site.
- `admin.html` — existing administrator console.
- `css/style.css`, `css/admin.css` — existing visual styles and additions for account/forms controls.
- `js/app.js`, `js/admin.js` — Supabase integration.
- `supabase.sql` — complete database, RLS, and Storage setup.
- `hm-logo.svg` — official logo used in the existing site and account screens.

Serve this folder over HTTP(S) (for example with the host's static-site server). Do not open the HTML files as `file://` URLs; Supabase Auth redirects require a registered web origin.

## Supabase setup

1. In Supabase SQL Editor, run the entire `supabase.sql` file once as the project owner. It creates the profile, admin, category, news, comment, and like tables, RLS policies, helper functions, indexes, and the public `wm-media` Storage bucket. It leaves the old prototype tables in place rather than dropping user data.
2. In **Authentication → URL Configuration**, set the production Site URL and add the exact production site origin/path and local development URL to Additional Redirect URLs. The app uses email/password accounts and the configured email-confirmation and password-reset links.
3. Configure Auth email confirmation and SMTP/provider settings in Supabase Dashboard as required for the deployment. Password recovery is by email; phone-based accounts are not enabled in this client.
4. The project URL and publishable key are configured in the existing JavaScript files. The publishable key is intended for browser use. **Never add a service-role key to either file or the website.**
5. Uploads use the `wm-media` bucket created by SQL. Images and videos are public to read; authenticated users can upload/delete only files in their own `avatars/<auth-user-id>/` folder, and only admins can manage files in `news/`. The bucket limits uploads to 100 MiB and the listed image/video MIME types; the client applies matching MIME checks.

## Add the three administrators

1. Create each of the three accounts through the site's account form. Confirm each email before granting admin rights.
2. Use SQL Editor to look up their Auth UUIDs:

   ```sql
   select id, email from auth.users
   where email in ('admin1@example.com', 'admin2@example.com', 'admin3@example.com');
   ```

3. Insert only those three UUIDs into the protected admin table. Use each account's displayed name; `avatar_path` can be `null` or the matching Storage path, such as `avatars/<user-uuid>/photo.webp`:

   ```sql
   insert into public.wm_admins (user_id, display_name, avatar_path)
   values
     ('UUID-1', 'Admin One', null),
     ('UUID-2', 'Admin Two', null),
     ('UUID-3', 'Admin Three', null);
   ```

   Run this privileged SQL yourself only after replacing all example values with the three actual UUIDs and names. The database has no client-facing policy to grant or edit administrator roles; ordinary users cannot self-promote. Admin badges and names are read from `wm_admins`.
4. Sign in at `admin.html`. The page verifies the signed-in user against `wm_admins`; database RLS is the actual authorization boundary for every administrative operation.

## Implemented functionality

- Visitors can browse/search/filter published news and view articles without an account.
- Email signup with name, password confirmation, Supabase session handling, sign-in/out, and email password recovery.
- User profile name/avatar and account creation date; avatar files are checked and stored in Supabase Storage.
- Admin-managed news with categories, breaking status, author/source, drafts/publishing, cover/additional images, and videos.
- Authenticated article-specific comments with owner editing/deletion and administrator deletion.
- Authenticated likes with a unique `(article_id, user_id)` key; article view, comment, and like totals use database data.
- Existing admin page includes article, comment, user, and category management and live statistics. Admin privileges and data operations are protected by RLS.

## Verification and setup-dependent tests

JavaScript syntax can be checked locally with `node --check js/app.js` and `node --check js/admin.js`. End-to-end Auth, Storage, RLS, and database persistence checks require first running the SQL and configuring the Supabase project's Auth URLs/email service; no test account or admin password is included in this project.

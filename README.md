# Campus Connect

Build a simple, clean and responsive **College Support Web App prototype** using React + TypeScript.

This is a **static frontend prototype only**. Use mock data and React local state. No backend, database, Supabase, API, or real authentication.

## Main Features

### 1. Library

Students can:

* View and search books by name, author, and subject.
* Check whether a book is **Available** or **Issued**.
* Request a book if it is unavailable.
* View their book request status.

Library staff can:

* Add/edit books.
* Update book availability.
* Approve or reject book requests.

Book data:
`book_id, book_name, author, subject, availability_status, request_count`

Book request:
`request_id, book_name, requested_by, status`

### 2. Teacher Free-Period Request

Students/class representatives can:

* See teachers who are free/available.
* View teacher name, subject and free period.
* Send a request to an available teacher.
* View request status.

Teachers can:

* View incoming requests.
* Accept or decline requests.

When accepted, show a notification:
**"[Teacher Name] will come to teach your class during [Period]."**

Teacher data:
`teacher_id, teacher_name, subject, period, availability_status`

Teacher request:
`request_id, class_name, teacher_id, period, status`

## Roles

Provide a simple prototype role selection:

* Student
* Teacher
* Library Staff
* Admin

No real authentication is required.

Show only relevant navigation for each role.

Main navigation:

* Dashboard
* Library
* Teacher Requests

## Dashboard

Create a simple dashboard showing:

* Available Books
* Issued Books
* Available Teachers
* Pending Requests
* Recent Book Requests
* Recent Teacher Requests

Use realistic mock data.

## UI

Make it:

* Clean
* Modern
* Simple
* College-friendly
* Responsive

Use a sidebar, cards, tables, search/filter controls, status badges, forms/modals and toast messages.

All buttons and requests should work with local React state.

## GitHub Pages

The app must be a **static frontend compatible with GitHub Pages**.

`npm run build` must work and output to `dist/`.

Create `.github/workflows/deploy.yml` that:

* Runs on push to `main`
* Uses Node.js 20
* Runs `npm ci`
* Runs `npm run build`
* Uploads `dist/` as a GitHub Pages artifact
* Deploys it to GitHub Pages
* Also supports manual `workflow_dispatch`

Use:
`actions/checkout@v4`
`actions/setup-node@v4`
`actions/configure-pages@v5`
`actions/upload-pages-artifact@v3`
`actions/deploy-pages@v4`

Do not add any features other than **Library** and **Teacher Free-Period Request**.

Build the complete working prototype in one generation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/77c1f31b-6b03-4e0b-b1d6-b6de7c9b3c3a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

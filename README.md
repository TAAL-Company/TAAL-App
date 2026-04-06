```markdown
# TAAL PATH

A React 18 Progressive Web App (PWA) for managing guided task-based routes and sites. Built with Redux and Webpack, it integrates with an Azure/Node.js backend (with legacy WordPress REST API support), enables users to log in, complete tasks, access support through a Help page, and explore dynamic sites. The app supports offline-first workflows via Workbox service workers and provides multilingual interfaces in Hebrew, Arabic, and English through i18next and the Google Translate API.

## Architecture

```
React 18 SPA (PWA)
├── Webpack 4 build system
├── Redux + Redux Persist (localStorage)
├── @reach/router (client-side routing)
├── Azure/Node.js REST API backend
├── i18n: i18next (static) + Google Translate API (dynamic)
├── PostHog analytics
├── Workbox service worker (offline-first)
├── Offline data caching in localStorage
└── Task performance tracking with offline queue
```

## Folder Structure

```
src/
├── App.js                  # Root component — Provider stack + routing
├── index.js                # Entry point — React render, PostHog, service worker
├── client-config.js        # siteUrl and baseUrl settings
├── azure-config.js         # Azure REST API endpoint definitions
├── wp-config.js            # Legacy WordPress REST API endpoints
├── i18n.js                 # i18next configuration (Hebrew, Arabic)
├── service-worker.js       # Workbox caching strategies
├── serviceWorkerRegistration.js
├── style.css               # Global styles
├── components/
│   ├── api.js              # All API calls (Azure + WordPress)
│   ├── functions.js        # Auth helpers, adapters, utilities
│   ├── Login/              # Authentication UI and logic
│   ├── Sites/              # Route/place listing, data loading, barcode
│   ├── Tasks/              # Task carousel, performance tracking, loops
│   ├── HelpPage/           # Guide contact, current task info
│   ├── Nav/                # Navbar with audio help, offline sync, logout
│   ├── assets/             # Icons, spinners, audio files, shared styles
│   ├── DataClasses/        # Data model definitions (place, route, task)
│   ├── DataNO/             # Sample Node.js backend data (JSON)
│   └── DataWP/             # Sample WordPress backend data (JSON)
├── redux/
│   ├── actions/            # users, places, tasks action creators
│   ├── constants/          # Action type constants
│   └── reducers/           # userReducer, placesReducer, tasksReducer
├── store/
│   └── configureStore.js   # Redux store with persist (localStorage)
├── Utility/
│   └── TranslationProvider.js  # Google Translate API context provider
├── images/                 # App icons and images
└── locales/                # i18next translation files (he-IL, ar)
public/
└── index.html              # HTML shell (Bootstrap 4.3.1, Font Awesome 4.7)
```

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   Copy `.env.example` to `.env` and fill in values:
   ```
   PORT=8080
   HOST=192.168.0.172
   PUBLIC_URL=
   REACT_APP_VERSION=          # Auto-generated from git hash via set-env.js
   REACT_APP_USERNAME_ACCESSKEY=
   REACT_APP_PASSWORD_ACCESSKEY=
   ```
   > `set-env.js` runs automatically before `dev` and `build` scripts, setting `REACT_APP_VERSION` to the current git short hash.

4. **Run in development mode:**
   ```sh
   npm run dev
   ```
5. **Build for production:**
   ```sh
   npm run build
   ```

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `node set-env.js && webpack-dev-server --mode=development` | Development server with hot reload |
| `build` | `node set-env.js && webpack --mode production --output-path dist` | Production build to `dist/` |
| `prod` | `webpack --mode=production` | Production webpack build (no env setup) |

## Configuration

- **[src/client-config.js](src/client-config.js):** `siteUrl` and `baseUrl` for the backend.
- **[src/azure-config.js](src/azure-config.js):** Azure REST API endpoint paths (`/students`, `/routes`, `/tasks`, `/sites`, `/task-performance`, `/packs`).
- **[src/wp-config.js](src/wp-config.js):** Legacy WordPress REST API endpoints (inactive).

## Routing

Routes are defined in [src/App.js](src/App.js) using `@reach/router`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Login | User authentication |
| `/Sites/:username` | Sites | Route/place listing and navigation |
| `/Tasks/:username` | Tasks | Task carousel and completion |
| `/Help/:username` | Help | Guide contact and current task info |

## Key Features

### Authentication
Users log in with username and password via the Azure `/students/login` endpoint. On success, the app stores a token and user profile in localStorage, dispatches user data to Redux, identifies the user in PostHog, and navigates to the Sites page. Language selection (Hebrew/English/Arabic) is available on the login screen.

### Sites & Routes
The Sites page loads the user's assigned routes, places, and tasks in sequence from the Azure API. Data is cached in localStorage for offline access. Each site card displays progress, and clicking a site extracts the route's tasks (with loop expansion) and navigates to the Tasks page.

### Task Management
Tasks are displayed in a swipeable carousel (vertical on mobile, horizontal on tablet/desktop). Features include:
- **Estimated time enforcement** — prevents swiping to the next task until the allotted time elapses
- **Loop support** — tasks can repeat based on `loopDuration`, `loopIteration`, or `loopUntil` parameters with a live countdown timer
- **Performance tracking** — records start/end times, loop info, and station ID via `POST /task-performance`; queues submissions locally when offline and syncs on reconnect
- **Finish modal** — shown after the last task is completed

### Help Page
Displays the current task info, next location, and the assigned guide's phone number. Supports audio playback for help content.

### Navbar
Shows user name and avatar, provides an audio help button (megaphone icon), handles offline-to-online sync of queued task performance data, and includes logout functionality.

## API Layer

All API calls are in [src/components/api.js](src/components/api.js). The app uses the Azure/Node.js backend (`IS_NODE = true`):

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `loginUser` | POST | `/students/login` | Authentication |
| `getingDataUsersFromNodejs` | GET | `/students` | Fetch all users |
| `getingDatauserByIdFromNodejs` | GET | `/students/:id` | Fetch user by ID |
| `getingDataRoutesFromNodejs` | GET | `/routes` | Fetch all routes |
| `getingDataRouteByIdFromNodejs` | GET | `/routes/:id` | Fetch route by ID |
| `getingDataRouteByIdsFromNodejs` | POST | `/routes/app` | Batch fetch routes |
| `getingPlacesIdFormRoutes` | POST | `/routes/ids` | Get place IDs from routes |
| `getingDataPlacesFromNodejs` | GET | `/sites` | Fetch all sites |
| `getingDataPlaceByIdFromNodejs` | GET | `/sites/:id` | Fetch site by ID |
| `getingDataPlaceByIdsFromNodejs` | POST | `/sites/app` | Batch fetch sites |
| `getTaskIdsFromPlaces` | POST | `/sites/ids` | Get task IDs from sites |
| `getingDataTasksFromNodejs` | GET | `/tasks` | Fetch all tasks |
| `getingTasksById` | GET | `/tasks/:id` | Fetch task by ID |
| `getingDataTasksByIdsFromNodejs` | POST | `/tasks/app` | Batch fetch tasks |
| `getingpacksDataUsersFromNodejs` | POST | `/packs/app` | Fetch user packs |
| `postDataTime` | POST | `/task-performance` | Submit task performance |

## Redux State

Configured in [src/store/configureStore.js](src/store/configureStore.js) with `redux-persist` (localStorage, user blacklisted from persistence).

| Reducer | State | Key Actions |
|---------|-------|-------------|
| `userReducer` | User profile (name, avatar, guide info, login status) | `USER_CHANGE`, `ENTER_APP` |
| `placesReducer` | Places array, visit tracking, daily reset | `PLACES_CHANGE`, `VISIT_PLACE` |
| `tasksReducer` | Tasks, current task list, completion status, task index | `TASKS_CHANGE`, `TASKS_ADD`, `CURRENT_SITE_TASKS`, `COMPLETE_TASK`, `CHANGE_TASK_NAME`, `CURRENT_SITE_TASKS_LIST` |

## Internationalization

- **Static translations:** `i18next` with `i18next-http-backend`, loading from `/locales/{lng}/translation.json`. Supported languages: Hebrew (`he-IL`), Arabic (`ar`). Fallback: `he-IL`.
- **Dynamic translation:** Custom `TranslationProvider` ([src/Utility/TranslationProvider.js](src/Utility/TranslationProvider.js)) wraps the Google Translate API for runtime content translation. Supports Hebrew, English, and Arabic with a "Show Original" toggle.

## Offline Support

- **Workbox service worker** with `clientsClaim` + `skipWaiting`, precaching, and `StaleWhileRevalidate` for images (max 50 entries).
- **localStorage caching** of routes, places, and tasks data for full offline access.
- **Offline queue** for task performance submissions — saved to localStorage and synced when connectivity is restored (triggered in the Navbar component).

## Key Dependencies

| Category | Packages |
|----------|----------|
| Core | React 18, Redux, redux-persist, @reach/router |
| HTTP | axios |
| i18n | i18next, react-i18next, i18next-http-backend, i18next-browser-languagedetector |
| UI | react-slick, react-swipeable, react-modal, reactjs-popup, sweetalert2, styled-components, react-icons |
| QR/Barcode | react-qr-reader, react-qr-scanner |
| PWA | workbox (full suite) |
| Analytics | posthog-js |
| Build | webpack 4, Babel 7, html-webpack-plugin, dotenv-webpack, workbox-webpack-plugin, webpack-pwa-manifest |
```
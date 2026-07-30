# Mehr Panel — AI Override Guide

> **Audience:** AI coding agents and developers customizing the React admin panel **without forking core files**.
>
> **Where this file lives (ships with the panel into the app):**
> - In the package: `src/react/src/docs/AI_OVERRIDE_GUIDE.md`
> - After `php artisan vendor:publish --tag=mehr-panel`: `resources/admin/src/docs/AI_OVERRIDE_GUIDE.md`
>
> **Base path for code paths below:** relative to the React `src/` folder  
> (`src/react/src/` in the package, or `resources/admin/src/` in the Laravel app).
>
> **Rule of thumb:** copy a `*.sample` → remove `.sample` → export `default`. Vite ignores `.sample` files.

---

## 0. Core vs custom — what you may NEVER edit

The panel ships a full React app. **Everything that comes from the package is core.** On upgrade / re-publish, core is replaced. **Do not modify core files for project-specific behavior.** Use file-drop overrides only.

### Forbidden (panel core — never change for customization)

Treat these as **read-only** when implementing features for a product / tenant / client:

| Area | Paths (under `…/src/`) |
|------|-------------------------|
| App entry & routing | `main.jsx`, `MyApp.jsx` |
| Built-in pages | `pages/**` (`Index`, `List`, `Detail`, `Create`, `Custom`, `Login` wiring, …) |
| Layouts | `layouts/**` (`DefaultLayout`, `Login`, `AuthShell`, …) |
| Blocks / UI chrome | `blocks/**` (`IndexShell`, `IndexTableBody`, `Sidebar`, `Form`, `Filter*`, …) |
| Hooks | `hooks/**` (`useIndexPage`, `useLogin`, `useTableColumns`, …) |
| Built-in field components | `components/Field.jsx`, `Text.jsx`, `Select.jsx`, `Submit.jsx`, and every other **existing** built-in type |
| Lib / resolvers | `lib/**` (`utils`, `resolveDynamicPage`, `resolveOverride`, helpers, …) |
| Context / config / API | `context/**`, `constants/**`, `Request/**` (and similar) |
| Default theme merge | `theme/default.js`, `theme/mergeTheme.js` |
| Base styles | `assets/index.css` (and other shipped CSS except `custom.css`) |
| Shipped locale dictionaries | `locales/en/panel.js`, `locales/fa/panel.js`, `locales/de/panel.js` (and other package locale files) |
| Samples (templates only) | any `*.sample` — **copy**, don’t “fix” the sample in place for production |
| Package PHP / publish stubs | outside React: ServiceProvider, routes, views, `src/dashboard.jsx` publish stub, etc. (unless you are developing the **package** itself) |

**Also forbidden:** editing a file under `dynamic-*` that is still named `*.sample`, or renaming core files, or patching `node_modules`.

If the task seems to require editing a forbidden path, **stop** and use an allowlisted override instead (or ask the user if they are intentionally developing the panel package core).

### Allowed (project customization only)

Create or edit **only** these:

| Purpose | Path |
|---------|------|
| Module screens | `dynamic-pages/**/*.jsx` (real files, not `.sample`) |
| Injection slots | `dynamic-slots/**/*.jsx` |
| Top header | `dynamic-layouts/**/CustomTopHeader.jsx` |
| Login / forgot page | `dynamic-public-routes/**/*.jsx` |
| Theme tokens | `theme/override.js` |
| Extra CSS | `assets/custom.css` |
| **New** field type (new backend `type` name) | `components/{NewType}.jsx` — **add only**; never replace built-in `Text`/`Select`/… |
| Extra translation keys | new files under `locales/{en\|fa\|de}/*.js` (merge); don’t rewrite shipped `panel.js` |
| Docs / Cursor rules for the team | `docs/AI_OVERRIDE_GUIDE.md` (this file — ships with publish); optional project `.cursor/rules` from publish tag |

**Compose, don’t fork:** override pages should `import` core hooks/blocks (`useIndexPage`, `IndexShell`, …) and leave those core files untouched.

### Working in the `mehr-panel` package repo

- **Product customization** → same rules: only allowlisted paths (or samples as templates).
- **Developing the panel itself** (bugfix / new core feature) → core edits are allowed **only when the user explicitly asks to change the package core**.

---

## 1. Decision tree (what should I override?)

| Goal | Mechanism | Where |
|------|-----------|--------|
| Custom UI for one module view (index/list/detail/form) | Dynamic page | `dynamic-pages/…` |
| Keep Index toolbar; only change table → cards/custom rows | Slot `IndexBody` | `dynamic-slots/IndexBody.jsx` |
| Inject UI into toolbar / form / layout / login / sidebar | Named slot | `dynamic-slots/{Name}.jsx` |
| New form field type from backend schema | Custom field component | `components/{Type}.jsx` |
| Replace login / forgot-password page | Public route override | `dynamic-public-routes/…` |
| Replace top header | Layout override | `dynamic-layouts/CustomTopHeader.jsx` |
| Ant Design tokens / component theme | Theme override | `theme/override.js` |
| Global CSS tweaks | CSS override | `assets/custom.css` |
| Auth logic only (token, API) | Import hook, don’t drop file | `hooks/useLogin.js`, `useForgotPassword.js` |

**Prefer compose over replace:** reuse `useIndexPage` + `IndexShell` + body blocks instead of rewriting data fetching.

**After adding a new glob-matched file:** restart Vite so `import.meta.glob` picks it up.

---

## 2. Dynamic pages (module screens)

### Routes (`MyApp.jsx` → `pages/Custom.jsx`)

| URL | `type` prop | Default page | View filename |
|-----|-------------|--------------|---------------|
| `/:panel/:module` | `"index"` | `pages/Index.jsx` (table) | `index.jsx` |
| `/:panel/:module/list` | `"list"` | `pages/List.jsx` (cards) | `list.jsx` |
| `/:panel/:module/detail` | `"detail"` | `pages/Detail.jsx` | `detail.jsx` |
| `/:panel/:module/create-edit` | `"create"` | `pages/Create.jsx` | `create-edit.jsx` |

Resolver: `lib/resolveDynamicPage.js`.

### Priority (highest first)

For panel=`admin`, module=`client`, type=`list`:

1. `dynamic-pages/admin/client/list.jsx`
2. `dynamic-pages/admin/client.jsx` *(flat — all views without a folder override)*
3. `dynamic-pages/client/list.jsx`
4. `dynamic-pages/client.jsx` *(flat — all views)*
5. Built-in (`Index` / `List` / `Detail` / `Create`)

### Export contract

```jsx
export default function MyPage({ type, ...props }) {
  // type: "index" | "list" | "detail" | "create"
  return …;
}
```

### Folder styles

```
dynamic-pages/
  client.jsx                          # flat — MUST branch on type
  client/
    index.jsx
    list.jsx
    detail.jsx
    create-edit.jsx
  admin/
    client.jsx
    client/
      index.jsx
    dashboard.jsx
```

### Samples to copy

| Sample | Becomes |
|--------|---------|
| `dynamic-pages/client.jsx.sample` | `client.jsx` |
| `dynamic-pages/client/index.jsx.sample` | `client/index.jsx` |
| `dynamic-pages/client/list.jsx.sample` | `client/list.jsx` |
| `dynamic-pages/client/detail.jsx.sample` | `client/detail.jsx` |
| `dynamic-pages/client/create-edit.jsx.sample` | `client/create-edit.jsx` |
| `dynamic-pages/admin/client/index.jsx.sample` | `admin/client/index.jsx` |
| `dynamic-pages/dashboard.jsx.sample` | `dashboard.jsx` |
| `dynamic-pages/admin/dashboard.jsx.sample` | `admin/dashboard.jsx` |

### Recommended index override (keep filters + shell)

```jsx
import useIndexPage from "../../hooks/useIndexPage";
import IndexShell from "../../blocks/IndexShell";
import IndexTableBody from "../../blocks/IndexTableBody";
import NotFoundPage from "../../pages/NotFoundPage";

export default function ClientIndex() {
  const index = useIndexPage();
  if (index.notFound) return <NotFoundPage />;
  return (
    <IndexShell index={index} className="custom-client-index">
      <IndexTableBody index={index} />
    </IndexShell>
  );
}
```

### Recommended list override

Same as built-in `pages/List.jsx`: `useIndexPage` + `useIndexCardsFilters` + `useIndexCardsSort` + `IndexShell` (`afterSearch`, `belowToolbar`, `hideCustomCol`) + `IndexCardsBody`.

### CRITICAL gotcha — flat file hijacks `/list`

A flat `dynamic-pages/client.jsx` matches **every** view that has no folder file. If you forget `type === "list"`, `/client/list` may show the table Index.

```jsx
// ✅ ALWAYS branch all types in flat overrides
function Client({ type, ...props }) {
  if (type === "detail") return <Detail {...props} />;
  if (type === "create") return <Create {...props} />;
  if (type === "list") return <List {...props} />;
  return <Index {...props} />;
}
```

**Prefer folder files** (`client/index.jsx`, `client/list.jsx`, …) when views differ.

---

## 3. Dynamic slots (injection points)

Resolver: `components/Slot.jsx` + `lib/resolveOverride.js`.

### Priority

1. `dynamic-slots/{panel}/{Name}.jsx`
2. `dynamic-slots/{Name}.jsx`
3. `fallback` (often `null`)

### Built-in slot names

| Name | Mounted in | Props |
|------|------------|-------|
| `LoginHeader` | `layouts/AuthShell.jsx` | — |
| `LoginExtra` | `layouts/AuthShell.jsx` | — |
| `IndexToolbar` | `blocks/IndexShell.jsx` | `pageModule` |
| `FormBeforeFields` | `blocks/Form.jsx` | `pageModule`, `pageType`, `form` |
| `LayoutBeforeContent` | `layouts/DefaultLayout.jsx` | — |
| `SidebarFooter` | `blocks/Sidebar.jsx` | — |
| **`IndexBody`** | `blocks/IndexBody.jsx` *(not `<Slot>`)* | `{ index }` from `useIndexPage()` |

Any other `{Name}.jsx` works if you add `<Slot name="YourName" … />` in core or an override.

### Export

```jsx
export default function IndexToolbar({ pageModule }) {
  return <button type="button">Extra for {pageModule}</button>;
}
```

### IndexBody — change rows UI, keep search/filters/AI/create

Drop `dynamic-slots/IndexBody.jsx` (see `IndexBody.jsx.sample`).

Default when missing: `IndexTableBody`.

```jsx
import IndexCardsBody from "../blocks/IndexCardsBody";

export default function IndexBody({ index }) {
  return <IndexCardsBody index={index} />;
}
```

**Note:** `/list` already uses cards via `pages/List.jsx`. Use `IndexBody` slot when you want cards (or custom grid) on the **index** URL `/:panel/:module`.

### Samples

- `dynamic-slots/IndexBody.jsx.sample`
- `dynamic-slots/IndexToolbar.jsx.sample`
- `dynamic-slots/LoginHeader.jsx.sample`

---

## 4. Index composition API

```
useIndexPage()  →  object "index"
IndexShell      →  title, search, AI, CustomCol, filter tags, Create, IndexToolbar slot
  children      →  IndexBody | IndexTableBody | IndexCardsBody | your UI
```

| Piece | Path |
|-------|------|
| Hook | `hooks/useIndexPage.js` |
| Shell | `blocks/IndexShell.jsx` |
| Body resolver | `blocks/IndexBody.jsx` |
| Table | `blocks/IndexTableBody.jsx` |
| Cards | `blocks/IndexCardsBody.jsx` |
| Card filter draft UI | `blocks/IndexCardsFilters.jsx` → `useIndexCardsFilters(index)` |
| Pagination label | `blocks/IndexPaginationTotal.jsx` |

### Useful `index` fields

`form`, `t`, `pageModule`, `pageData`, `indexData`, `columns`, `mergedColumns`, `rows`, `pagination`, `setPagination`, `listPagination`, `isEmpty`, `emptyDescription`, `notFound`, `loadErrorStatus` (404 \| 403), `headerLoading`, `bodyLoading`, `handleChangeTable`, `onSearch`, `handleClearFilters`, `handleAiFilters`, `handleAiClear`, `handleAiModeChange`, `handleColumnChange`, `handlePaginationChange`, `removeFilterKey`, queries, …

### `IndexShell` extra props (list-style)

- `afterSearch` — node next to Search (e.g. Apply filters button)
- `belowToolbar` — filter panel under toolbar
- `hideCustomCol` — hide column picker (cards don’t need it)
- `className`

---

## 5. Custom field components

Dispatcher: `components/Field.jsx`.

### How types resolve

1. If `type` is in the **built-in map** → that component (Text, Select, DatePicker, …).
2. Else lazy-load `components/{type}.jsx` via Vite glob.
3. Missing file → error UI `"Error loading the field: {type}"`.

**Filename must equal backend `type` (case-sensitive).**  
Example: schema `{ "type": "RatingStars" }` → `components/RatingStars.jsx`.

### Built-ins cannot be replaced by dropping a same-named file

`Text`, `Select`, `Number`, … are wired in the map. A custom `Text.jsx` is **ignored**. Use a **new type name** (e.g. `MyText`) on the backend.

### Creating a field

```jsx
// components/RatingStars.jsx
import { Form, Rate } from "antd";
import { separationRules } from "../lib/helpers";
import Readonly from "../blocks/Readonly";

export default function RatingStars(props) {
  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });

  if (props.readonly) {
    return (
      <Readonly>
        {!props.hideLabel && <div>{props.display}</div>}
        <Rate disabled value={Number(props.value) || 0} />
      </Readonly>
    );
  }

  return (
    <Form.Item
      name={props.name}
      label={props.hideLabel ? undefined : props.display}
      rules={rules}
      initialValue={props.value}
    >
      <Rate disabled={props.disable} />
    </Form.Item>
  );
}
```

`FormGroup` wraps each field in a responsive `Col` and spreads all schema props into `Field`.

### Typical props

`name`, `type`, `display`, `value`, `rules`, `creationRules`, `updateRules`, `pageType`, `readonly`, `disable`, `options`, `data`, `dataSet`, `col`, `existent`, `form`, `relation`, `table`, `hideLabel`, `testId`, …

**Label hide** — two places only:

| Place | Effect |
|--------|--------|
| top-level `hideLabel` | Forced hide (e.g. table cells) |
| `options.hideLabel` | Hide the field label from schema |

**Other label options** on `options`:

| Option | Effect |
|--------|--------|
| `options.inlineLabel` | Label and control on one row; colon after the label |

Example:

```json
{ "type": "Text", "display": "Name", "options": { "hideLabel": true } }
```

```json
{ "type": "Text", "display": "Name", "options": { "inlineLabel": true } }
```

### `data` vs `record` (CRITICAL)

| Prop | Meaning |
|------|---------|
| `data` / `dataSet` | Select/Radio/Transfer **options** from schema |
| `record` | Current **table row** (set in `lib/utils.jsx` cell renderer) |
| `id` | Row primary key for inline editing |
| `rowIndex` | Row index in table |

**Never pass the row as `data={row}`** after `{...item.field}` — it overwrites Select options and breaks the field.

`existent: false` → `Field` returns `null`.

---

## 6. Auth overrides

### Layers (compose)

| Layer | Path | Role |
|-------|------|------|
| Hook | `hooks/useLogin.js` | `login(payload)`, `loading`, `mustVerify`, `resetVerification` |
| Hook | `hooks/useForgotPassword.js` | reset request / password set |
| Chrome | `layouts/AuthShell.jsx` | card + `LoginHeader` / `LoginExtra` slots |
| Default UI | `layouts/Login.jsx`, `pages/ForgotPassword.jsx` | forms + notifications |
| Full page swap | `pages/DynamicPublicPage.jsx` | file-drop |

### Public routes

- `/:panel/login` → override name `Login`
- `/:panel/forgot-password` → `ForgotPassword`

Priority: `dynamic-public-routes/{panel}/Login.jsx` → `dynamic-public-routes/Login.jsx` → default.

### `login()` result statuses

`'success' | 'must_verify' | 'no_token' | 'error'` — handle each (see Login sample / default Login).

Hooks are **imported**, not file-dropped.

Samples: `dynamic-public-routes/Login.jsx.sample`, `admin/Login.jsx.sample`, `ForgotPassword.jsx.sample`.

---

## 7. Top header layout

- Drop: `dynamic-layouts/CustomTopHeader.jsx` or `dynamic-layouts/{panel}/CustomTopHeader.jsx`
- Fallback: `blocks/DefaultTopHeader.jsx`
- Wired from: `blocks/TopHeader.jsx`
- Sample: `dynamic-layouts/CustomTopHeader.jsx.sample` (also `.js.sample` may exist — prefer `.jsx`)

Receives the same props as `DefaultTopHeader` (general query data spread).

---

## 8. Theme override

1. Copy `theme/override.js.sample` → `theme/override.js`
2. Export Ant Design theme partial:

```js
export default {
  token: { colorPrimary: "#0ea5e9" },
  components: { Button: { borderRadius: 6 } },
};
```

3. Merged by `theme/mergeTheme.js` onto `theme/default.js` (shallow: top-level, `token`, each `components.*` key).
4. Loaded eagerly in `MyApp.jsx`. Dark/light algorithms still applied at runtime.

---

## 9. CSS override

1. Copy `assets/custom.css.sample` → `assets/custom.css`
2. Loaded via `import.meta.glob` in `main.jsx`
3. Useful scopes: `body.dark-mode`, `.panel-{prefix}` (from `DefaultLayout`)

---

## 10. Locales (soft extension)

`context/translations.js` merges `locales/{en|de|fa}/*.js` (eager). Add a new `*.js` exporting a default object of translation keys.

---

## 11. Shared resolvers

### `lib/resolveOverride.js` (slots, public routes, layouts)

Priority: `{folder}/{panel}/{name}.jsx` → `{folder}/{name}.jsx` → `null`.

`panel` defaults to `Config.prefix` (first URL segment at app load).

### `lib/resolveDynamicPage.js` (module pages)

Four-level priority (see §1). Uses `panelName` from `useParams()` in `Custom.jsx`.

### Suspense

Module pages (`dynamic-pages`) and most slots are `React.lazy` (Skeleton / empty fallback while loading).

**Public auth pages** (`dynamic-public-routes` Login / ForgotPassword) are loaded **eagerly** so a custom login paints on the first frame — no flash of the built-in default.

---

## 12. Checklist for AI agents

When asked to customize the panel:

1. **Read §0** — if the change targets a forbidden/core path, refuse and use an allowlisted override.
2. **Identify the smallest override** (slot vs page vs field vs theme).
3. **Copy from `*.sample`**, rename by removing `.sample` — never edit core; never “fix” by patching `pages/` / `blocks/` / `hooks/`.
4. **Compose** `useIndexPage` / `IndexShell` / existing bodies when possible.
5. For flat dynamic pages, **always handle `type` including `"list"`**.
6. New fields: **new type name** + `components/{Type}.jsx`; don’t try to replace built-in Text/Select.
7. Table cells: use **`record`**, not `data`, for the row.
8. **Restart Vite** after adding new override files.
9. Panel folder name must match URL (`/admin/...` → `admin/`).
10. Do not commit `node_modules` or secrets; only the new override files.
11. Prefer English code/comments consistent with the repo; UI strings via `t` / locales when available.

---

## 13. Quick reference — all sample files

```
dynamic-pages/client.jsx.sample
dynamic-pages/client/index.jsx.sample
dynamic-pages/client/list.jsx.sample
dynamic-pages/client/detail.jsx.sample
dynamic-pages/client/create-edit.jsx.sample
dynamic-pages/admin/client/index.jsx.sample
dynamic-pages/dashboard.jsx.sample
dynamic-pages/admin/dashboard.jsx.sample
dynamic-slots/IndexBody.jsx.sample
dynamic-slots/IndexToolbar.jsx.sample
dynamic-slots/LoginHeader.jsx.sample
dynamic-public-routes/Login.jsx.sample
dynamic-public-routes/admin/Login.jsx.sample
dynamic-public-routes/ForgotPassword.jsx.sample
dynamic-layouts/CustomTopHeader.jsx.sample
theme/override.js.sample
assets/custom.css.sample
```

---

## 14. Minimal recipes

### A) Cards on index URL for all modules

`dynamic-slots/IndexBody.jsx` → render `IndexCardsBody` or custom cards using `index.rows` + `index.listPagination`.

### B) Custom client list only for admin

`dynamic-pages/admin/client/list.jsx` → compose List pattern.

### C) Extra buttons on every index toolbar

`dynamic-slots/IndexToolbar.jsx` → receive `pageModule`.

### D) Banner above every form

`dynamic-slots/FormBeforeFields.jsx` → receive `pageModule`, `pageType`, `form`.

### E) Custom branded login for admin only

`dynamic-public-routes/admin/Login.jsx` → use `useLogin` + `AuthShell` or full custom UI.

### F) New schema field type `MapPicker`

`components/MapPicker.jsx` + backend `type: "MapPicker"`.

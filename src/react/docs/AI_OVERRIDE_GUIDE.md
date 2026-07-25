# Mehr Panel — AI Override Guide

> **Audience:** AI coding agents and developers customizing the React admin panel **without forking core files**.
>
> **Base path:** all paths below are relative to `src/react/src/` unless noted.
>
> **Rule of thumb:** copy a `*.sample` → remove `.sample` → export `default`. Vite ignores `.sample` files.

---

## 0. Decision tree (what should I override?)

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

## 1. Dynamic pages (module screens)

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

## 2. Dynamic slots (injection points)

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

## 3. Index composition API

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

`form`, `t`, `pageModule`, `pageData`, `indexData`, `columns`, `mergedColumns`, `rows`, `pagination`, `setPagination`, `listPagination`, `isEmpty`, `emptyDescription`, `notFound`, `headerLoading`, `bodyLoading`, `handleChangeTable`, `onSearch`, `handleClearFilters`, `handleAiFilters`, `handleAiClear`, `handleAiModeChange`, `handleColumnChange`, `handlePaginationChange`, `removeFilterKey`, queries, …

### `IndexShell` extra props (list-style)

- `afterSearch` — node next to Search (e.g. Apply filters button)
- `belowToolbar` — filter panel under toolbar
- `hideCustomCol` — hide column picker (cards don’t need it)
- `className`

---

## 4. Custom field components

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
        {!props.hideLable && <div>{props.display}</div>}
        <Rate disabled value={Number(props.value) || 0} />
      </Readonly>
    );
  }

  return (
    <Form.Item
      name={props.name}
      label={props.hideLable ? undefined : props.display}
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

`name`, `type`, `display`, `value`, `rules`, `creationRules`, `updateRules`, `pageType`, `readonly`, `disable`, `options`, `data`, `dataSet`, `col`, `existent`, `form`, `relation`, `table`, `hideLable`, `testId`, …

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

## 5. Auth overrides

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

## 6. Top header layout

- Drop: `dynamic-layouts/CustomTopHeader.jsx` or `dynamic-layouts/{panel}/CustomTopHeader.jsx`
- Fallback: `blocks/DefaultTopHeader.jsx`
- Wired from: `blocks/TopHeader.jsx`
- Sample: `dynamic-layouts/CustomTopHeader.jsx.sample` (also `.js.sample` may exist — prefer `.jsx`)

Receives the same props as `DefaultTopHeader` (general query data spread).

---

## 7. Theme override

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

## 8. CSS override

1. Copy `assets/custom.css.sample` → `assets/custom.css`
2. Loaded via `import.meta.glob` in `main.jsx`
3. Useful scopes: `body.dark-mode`, `.panel-{prefix}` (from `DefaultLayout`)

---

## 9. Locales (soft extension)

`context/translations.js` merges `locales/{en|de|fa}/*.js` (eager). Add a new `*.js` exporting a default object of translation keys.

---

## 10. Shared resolvers

### `lib/resolveOverride.js` (slots, public routes, layouts)

Priority: `{folder}/{panel}/{name}.jsx` → `{folder}/{name}.jsx` → `null`.

`panel` defaults to `Config.prefix` (first URL segment at app load).

### `lib/resolveDynamicPage.js` (module pages)

Four-level priority (see §1). Uses `panelName` from `useParams()` in `Custom.jsx`.

### Suspense

Almost all overrides are `React.lazy`. Expect Skeleton / default fallback while loading. Prefer stable default exports.

---

## 11. Checklist for AI agents

When asked to customize the panel:

1. **Identify the smallest override** (slot vs page vs field vs theme).
2. **Copy from `*.sample`**, rename by removing `.sample` — never edit core unless unavoidable.
3. **Compose** `useIndexPage` / `IndexShell` / existing bodies when possible.
4. For flat dynamic pages, **always handle `type` including `"list"`**.
5. New fields: **new type name** + `components/{Type}.jsx`; don’t try to replace built-in Text/Select.
6. Table cells: use **`record`**, not `data`, for the row.
7. **Restart Vite** after adding new override files.
8. Panel folder name must match URL (`/admin/...` → `admin/`).
9. Do not commit `node_modules` or secrets; only the new override files.
10. Prefer English code/comments consistent with the repo; UI strings via `t` / locales when available.

---

## 12. Quick reference — all sample files

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

## 13. Minimal recipes

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

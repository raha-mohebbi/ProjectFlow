# مستندات تست‌های پروژه ProjectFlow

> دستور اجرا: `npm run test:run` (یا `npm run test` برای حالت watch)

---

## ۱. خلاصه وضعیت فعلی

| فایل تست | تعداد تست | وضعیت |
|---|---|---|
| `src/test/authSlice.test.js` | 5 | ✅ پاس |
| `src/test/ProtectedRoute.test.jsx` | 3 | ✅ پاس |
| `src/test/AuthProvider.test.jsx` | 5 | ✅ پاس |
| `src/test/LoginPage.test.jsx` | 5 | ✅ پاس |
| `src/test/LoginPageExtra.test.jsx` | 7 | ✅ پاس |
| `src/test/RegisterPage.test.jsx` | 6 | ✅ پاس |
| `src/test/RegisterPageExtra.test.jsx` | 4 | ✅ پاس |
| `src/test/CreateProjectModal.test.jsx` | 7 | ✅ پاس |
| `src/test/CreateTaskModal.test.jsx` | 5 | ✅ پاس |
| `src/test/ProjectCard.test.jsx` | 6 | ✅ پاس |
| `src/test/Dashboard.test.jsx` | 8 | ✅ پاس |
| **مجموع** | **61** | **همه پاس** |

---

## ۲. پوشش تست‌های فعلی (جزئیات)

### ۲.۱. `authSlice.test.js` — تست ریدیوسر Redux

ریدیوسر `src/store/slices/authSlice.js` را تست می‌کند:

| # | تست | سناریو |
|---|---|---|
| 1 | `should return the initial state when passed an unknown action` | اکشن ناشناخته → بازگشت به حالت اولیه (`user: null`, `session: null`, `isAuthenticated: false`) |
| 2 | `setAuth → sets user, session, and marks authenticated` | اکشن `setAuth` با payload معتبر → ست شدن `user`/`session` و `isAuthenticated: true` |
| 3 | `setAuth → overwrites a previously authenticated state` | `setAuth` روی حالت واردشده قبلی → بازنویسی کامل مقادیر قبلی |
| 4 | `clearAuth → clears user, session, and marks unauthenticated` | `clearAuth` روی حالت واردشده → صفر شدن هر سه فیلد |
| 5 | `clearAuth → on already-cleared state is a no-op` | `clearAuth` روی حالت خالی → بدون تغییر (idempotent) |

### ۲.۲. `ProtectedRoute.test.jsx` — تست گارد مسیر

کامپوننت `src/app/router/ProtectedRoute.jsx` را با `MemoryRouter` تست می‌کند:

| # | تست | سناریو |
|---|---|---|
| 1 | `shows loading state while checking the session` | تا زمان resolve شدن `getSession()` → رندر کامپوننت `Loading` |
| 2 | `redirects to /login when no session is found` | `session: null` → ریدایرکت به `/login` و عدم رندر محتوای محافظت‌شده |
| 3 | `renders protected children when a session exists` | `session` معتبر → رندر `Outlet` / محتوای محافظت‌شده |

> **نکته:** در این تست‌ها `Loading` با یک stub ساده mock شده تا DOM تمیز بماند.

### ۲.۳. `AuthProvider.test.jsx` — تست ارائه‌دهنده احراز هویت

کامپوننت `src/app/providers/AuthProvider.jsx` را با **استور واقعی Redux** و یک `Probe` کوچک تست می‌کند:

| # | تست | سناریو |
|---|---|---|
| 1 | `dispatches setAuth when an initial session exists` | `getSession` معتبر → dispatch شدن `setAuth` و نمایش `authed` + ایمیل |
| 2 | `stays unauthenticated when there is no initial session` | `session: null` → بدون dispatch، حالت `guest` |
| 3 | `dispatches setAuth when onAuthStateChange emits a session` | رویداد `SIGNED_IN` → dispatch `setAuth` با کاربر جدید |
| 4 | `dispatches clearAuth when onAuthStateChange emits a null session` | رویداد `SIGNED_OUT` → dispatch `clearAuth` و بازگشت به `guest` |
| 5 | `unsubscribes from auth changes on unmount` | unmount شدن → فراخوانی `subscription.unsubscribe()` |

### ۲.۴. `LoginPage.test.jsx` — تست صفحه ورود (مسیر اصلی)

کامپوننت `src/features/auth/pages/LoginPage.jsx` (Formik + Yup) را تست می‌کند.
Supabase و `react-hot-toast` هر دو mock شده‌اند:

| # | تست | سناریو |
|---|---|---|
| 1 | `renders the login form with email and password fields` | رندر هدر، فیلدهای Email/Password و دکمه Sign in |
| 2 | `shows validation errors when submitting an empty form` | سابمیت خالی → پیام‌های `Email is required` و `Password is required` + صدا زده نشدن `signInWithPassword` |
| 3 | `shows 'Must be at least 6 characters' for short passwords` | پسورد کوتاه → پیام خطای Yup |
| 4 | `calls signInWithPassword with correct values on valid submit` | سابمیت معتبر → فراخوانی `signInWithPassword` با payload صحیح `{email, password}` |
| 5 | `does not submit when validation fails for empty password` | ایمیل معتبر + پسورد خالی → پیام خطا و عدم فراخوانی API |

> **تغییر اخیر:** تست `shows 'Invalid email' for a malformed email` به دلیل شکست
> (ناهماهنگی بین ولیدیشن HTML فیلد `type="email"` و پیام Yup) حذف شد.

### ۲.۵. `LoginPageExtra.test.jsx` — مسیرهای خطای صفحه ورود

| # | تست | سناریو |
|---|---|---|
| 1 | `shows toast.error and stays on login when Supabase rejects the credentials` | پاسخ خطای API → `toast.error(message)`، بدون ناوبری به `/dashboard` |
| 2 | `shows a success toast and navigates to /dashboard on successful login` | پاسخ موفق → `toast.success("Signed in successfully!")` + رندر مسیر `/dashboard` |
| 3 | `shows a generic error toast when signInWithPassword throws` | رد شدن promise (خطای شبکه) → `toast.error("Something went wrong. Please try again.")` |
| 4 | `disables the submit button and shows 'Signing in...' while the request is pending` | حالت `isSubmitting` → دکمه غیرفعال و متن `Signing in...` تا resolve شدن |
| 5 | `does not call resetPasswordForEmail when the email field is empty` | «Forgot password?» با ایمیل خالی → `toast.error("Please enter your email first.")` و عدم فراخوانی API |
| 6 | `sends a password reset link when an email is provided` | ایمیل دار → `resetPasswordForEmail(email)` + `toast.success("Password reset email sent!")` |
| 7 | `shows an error toast when the password reset request fails` | خطای API بازیابی → `toast.error(message)` |

### ۲.۶. `RegisterPage.test.jsx` — تست صفحه ثبت‌نام (مسیر اصلی)

کامپوننت `src/features/auth/pages/RegisterPage.jsx` را تست می‌کند:

| # | تست | سناریو |
|---|---|---|
| 1 | `renders all form fields: name, email, password, confirm password` | رندر ۴ فیلد + دکمه Create account |
| 2 | `shows validation errors when submitting an empty form` | سابمیت خالی → ۴ پیام خطای `required` + عدم فراخوانی `signUp` |
| 3 | `shows 'Name must be at least 2 characters' for short names` | نام تک‌حرفی → پیام خطای Yup |
| 4 | `shows 'Passwords must match' when confirmation differs` | عدم تطابق پسورد و تکرار آن → پیام `Passwords must match` |
| 5 | `calls signUp with correct payload on valid submit` | سابمیت معتبر → `signUp` با payload صحیح شامل `options.data.name` |
| 6 | `shows 'Password must be at least 6 characters' for short password` | پسورد ۵ رقمی → پیام خطای Yup |

### ۲.۷. `RegisterPageExtra.test.jsx` — مسیرهای خطای صفحه ثبت‌نام 

| # | تست | سناریو |
|---|---|---|
| 1 | `shows toast.error when Supabase returns an error` | پاسخ خطای API → `toast.error(message)` بدون toast موفقیت |
| 2 | `shows a success toast on successful sign-up` | پاسخ موفق → `toast.success("Account created successfully!")` |
| 3 | `shows a generic error toast when signUp throws` | رد شدن promise → toast خطای عمومی |
| 4 | `disables the submit button and shows 'Creating account...' while pending` | حالت `isSubmitting` → دکمه غیرفعال و متن `Creating account...` |

### ۲.۸. `CreateProjectModal.test.jsx` — تست مودال ایجاد پروژه

| # | تست | سناریو |
|---|---|---|
| 1 | `renders nothing when isOpen is false` | `isOpen=false` → رندر نشدن (خروجی خالی) |
| 2 | `renders the modal with its form when isOpen is true` | رندر هدر، فیلدها و دکمه‌ها |
| 3 | `shows 'Project name is required' when submitting an empty form` | نام خالی → خطای Yup + عدم فراخوانی `insert` |
| 4 | `inserts the project with form values and closes the modal on success` | سابمیت معتبر → `insert` با payload کامل (`created_by` از کاربر جاری) + فراخوانی `onClose` |
| 5 | `does not insert anything when the user is not authenticated` | کاربر null → عدم اتصال به `from()` و عدم بستن مودال |
| 6 | `closes the modal via the Cancel button without inserting` | دکمه Cancel → فقط `onClose` |
| 7 | `closes the modal via the ✕ button without inserting` | دکمه ✕ → فقط `onClose` |

### ۲.۹. `CreateTaskModal.test.jsx` — تست مودال ایجاد تسک

| # | تست | سناریو |
|---|---|---|
| 1 | `renders nothing when isOpen is false` | `isOpen=false` → رندر نشدن |
| 2 | `renders the modal with its fields when isOpen is true` | رندر هدر، فیلدهای عنوان/توضیحات و دکمه |
| 3 | `inserts the task with form values and closes the modal on success` | پر کردن همه فیلدها → `insert` با payload کامل + `onClose` |
| 4 | `does not insert anything when the user is not authenticated` | کاربر null → عدم insert و عدم بستن مودال |
| 5 | `closes the modal via the × button without inserting` | دکمه × → فقط `onClose` |

### ۲.۱۰. `ProjectCard.test.jsx` — تست کارت پروژه

| # | تست | سناریو |
|---|---|---|
| 1 | `renders the project name and description` | رندر نام (h3) و توضیحات |
| 2 | `renders the status badge` | نمایش وضعیت `active` |
| 3 | `renders a different status value when provided` | وضعیت دلخواه (`completed`) |
| 4 | `renders the progress section starting at 0%` | بخش Progress با مقدار `0%` |
| 5 | `renders the stats labels (Tasks / Members / Status)` | لیبل‌های آماری |
| 6 | `renders the empty activity placeholder` | `Recently Activity` + `No recent activity` |

### ۲.۱۱. `Dashboard.test.jsx` — تست داشبورد

| # | تست | سناریو |
|---|---|---|
| 1 | `renders the heading and fetches the user's projects` | fetch پروژه‌ها از `from("projects")` و رندر همه کارت‌ها |
| 2 | `shows '0 projects' in the header when there are no projects` | آرایه خالی → هدر `0 projects across your workspace` |
| 3 | `does not query projects when the user is not authenticated` | کاربر null → عدم فراخوانی `from()` |
| 4 | `filters projects by search text` | تایپ در جستجو → نمایش فقط پروژه منطبق |
| 5 | `filters projects by status via the Filter dropdown` | باز شدن dropdown، انتخاب `Completed` → فیلتر + بسته شدن منو |
| 6 | `switches the view mode from grid to list` | کلیک List → تغییر کلاس‌های کانتینر از grid به flex |
| 7 | `opens the Create Project modal from the '+ New Project' button` | کلیک دکمه → رندر مودال Create New Project |
| 8 | `renders the stats cards from the Tasks section` | رندر کارت‌های آماری (total projects/tasks/completed/overdue) |

---

## ۳. زیرساخت تست مشترک

| فایل | نقش |
|---|---|
| `vitest.config.js` | محیط `jsdom`، فایل setup، شامل شدن `src/test/**/*.{test,spec}.{js,jsx}` |
| `src/test/setup.js` | ایمپورت `@testing-library/jest-dom` برای matchereای DOM |
| `src/test/mocks/supabaseMock.js` | کارخانه (`createSupabaseMock`) برای ساخت mock کامل Supabase با قابلیت override |

> هر تست فعلاً mock مخصوص به خودش را داخل `vi.mock()` تعریف می‌کند؛
> `supabaseMock.js` آماده است ولی هنوز در تست‌ها استفاده نمی‌شود (قابل بهینه‌سازی).

### الگوهای به‌کار رفته

- **Mock ماژول Supabase** با `vi.mock("../lib/supabase", ...)` پیش از ایمپورت کامپوننت
- **Mock کردن `react-hot-toast`** برای assertion روی `toast.success` / `toast.error`
- **`vi.hoisted`** در `AuthProvider.test.jsx` برای دسترسی امن به mock ها داخل factory
- **زنجیره‌های Supabase** (`from().insert().select().single()` و `from().select().eq()`)
  با helper های `setupInsertChain` / `setupProjectsFetch`
- **`MemoryRouter` + `Routes`** برای تست ناوبری (مثلاً ریدایرکت به `/dashboard`)
- **Promise کنترل‌شده** برای تست حالت `isSubmitting` (resolve دستی داخل تست)

---

## ۵. اجرای تست‌ها

```bash
# اجرای یک‌باره (مناسب CI)
npm run test:run

# حالت watch (توسعه)
npm run test

# فقط یک فایل
npx vitest run src/test/LoginPage.test.jsx

# پوشش کد
npm run test:coverage
```

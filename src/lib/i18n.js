// Translation tables. Add a language by adding another object + LANGS entry.
// t() falls back to English, then to the key itself, and never throws.

const EN = {
  nav_board: "Board", nav_budget: "Budget", nav_vendors: "Vendors",
  nav_guests: "Guests", nav_settings: "Settings",

  add: "Add", save: "Save", cancel: "Cancel", delete: "Delete",
  search_tasks: "Search tasks…", search_vendors: "Search vendors…", search_names: "Search names…",
  all_categories: "All categories", anyone: "Anyone", any_priority: "Any priority",
  any_stage: "Any stage", all_sides: "All sides", any_rsvp: "Any RSVP",
  btn_task: "+ Task", btn_vendor: "+ Vendor", btn_expense: "+ Expense", btn_guest: "+ Guest",
  btn_add_inline: "+ Add", export_csv: "Export CSV", import_csv: "Import CSV",

  eyebrow_workflow: "Workflow", title_board: "Board",
  eyebrow_money: "Money", title_budget: "Budget", czk_view: "CZK view",
  eyebrow_suppliers: "Suppliers", title_vendors: "Vendors",
  eyebrow_people: "People", title_guests: "Guests",
  eyebrow_setup: "Setup", title_settings: "Settings",

  col_backlog: "Backlog", col_todo: "To do", col_doing: "In progress",
  col_waiting: "Waiting", col_done: "Done",
  prio_low: "low", prio_medium: "medium", prio_high: "high",
  sort_prefix: "Sort", sort_due: "Due date", sort_priority: "Priority",
  sort_category: "Category", sort_assignee: "Assignee",

  f_title: "Title", f_description: "Description", f_column: "Column", f_priority: "Priority",
  f_category: "Category", f_assignee: "Assignee", f_due: "Due date",
  tcat_Venue: "Venue", tcat_Vendor: "Vendor", tcat_Budget: "Budget", tcat_Guest: "Guest",
  tcat_Travel: "Travel", tcat_Admin: "Admin", tcat_Other: "Other",
  new_task: "New task", edit_task: "Edit task",

  stat_total_budget: "Total budget", stat_planned: "Planned", stat_spent: "Spent (actual)",
  stat_remaining: "Remaining", stat_paid: "Paid so far",
  vendor_commitments: "Vendor commitments", from_vendors_tab: "from your Vendors tab",
  total_quoted: "Total quoted", deposits_paid: "Deposits paid", outstanding: "Outstanding",
  "bcat:venue": "venue", "bcat:food/drinks": "food/drinks", "bcat:music": "music",
  "bcat:photo/video": "photo/video", "bcat:decorations": "decorations",
  "bcat:clothing": "clothing", "bcat:rings": "rings", "bcat:misc buffer": "misc buffer",
  f_label: "Label", f_linked_vendor: "Linked vendor", f_planned_eur: "Planned (EUR)",
  f_actual_eur: "Actual (EUR)", f_paid: "Paid", paid: "paid", unpaid: "unpaid", plan_prefix: "plan",
  new_expense: "New expense", edit_expense: "Edit expense",
  no_expenses: "No manual expenses yet. Add one with “+ Expense”.",

  stat_vendors: "Vendors", stat_deposits_paid: "Deposits paid", stat_outstanding: "Outstanding",
  stage_lead: "lead", stage_contacted: "contacted", stage_negotiating: "negotiating",
  stage_booked: "booked", stage_paid: "paid", stage_done: "done",
  vcat_photographer: "Photographer", vcat_videographer: "Videographer", vcat_band: "Band",
  vcat_dj: "DJ", vcat_decoration: "Decoration", vcat_catering: "Catering", vcat_dress: "Dress / Suit",
  vcat_makeup: "Makeup / Hair", vcat_cake: "Cake", vcat_transport: "Transport", vcat_other: "Other",
  f_name: "Name", f_type: "Type", f_stage: "Stage", f_contact_name: "Contact name",
  f_phone: "Phone", f_email: "Email", f_price_quote: "Their price / quote (EUR)",
  f_deposit_required: "Deposit required (EUR)", f_deposit_paid: "Deposit paid",
  remaining_balance: "Remaining balance", balance_hint: "“price” = what they charge, not what you’ve paid",
  f_contract: "Contract link (URL)", f_notes_log: "Notes / log",
  v_price: "Price", v_balance: "Balance", deposit_paid_pill: "deposit paid", deposit_due_pill: "deposit due",
  new_vendor: "New vendor", edit_vendor: "Edit vendor",
  no_vendors: "No vendors yet. Add your first with “+ Vendor”.", no_match: "No matches.",

  paid_headcount: "paid headcount", total_bodies: "total bodies",
  rsvp_confirmed: "Confirmed", rsvp_tentative: "Tentative", rsvp_declined: "Declined", rsvp_none: "No response",
  plus_ones: "Plus-ones", kids_chair: "Kids w/ chair", kids_lap: "Kids on lap",
  side_confirmed: "{c} confirmed / {i} invited", paid_seats: "paid seats",
  side_Serbian: "Serbian", side_Kazakh: "Kazakh", side_Czech: "Czech",
  needs_hotel: "Needs hotel", needs_transport: "Needs transport",
  shown_total: "{shown} shown · {total} total",
  f_side: "Side", f_rsvp: "RSVP", f_country: "Country", f_plus_ones: "Plus-ones",
  f_kids_chair: "Kids w/ chair (5+)", f_kids_lap: "Kids on lap (under 5)", f_dietary: "Dietary",
  f_needs_accommodation: "Needs accommodation", f_needs_transport: "Needs transport", f_notes: "Notes",
  new_guest: "New guest", edit_guest: "Edit guest",

  set_wedding_day: "Wedding day",
  set_wedding_hint: "Set the date and a countdown shows on top of every tab.",
  f_date: "Date", set_budget_currency: "Budget & currency",
  f_total_budget_eur: "Total budget (entered in EUR)", f_display_currency: "Display currency",
  f_exchange_rate: "Exchange rate — 1 EUR = ? CZK (approximate)",
  currency_note: "You enter amounts in EUR everywhere. Switching to CZK converts the view using this rate — it doesn’t change what’s stored.",
  set_people: "People (assignees)",
  set_people_hint: "These power the assignee dropdown on tasks. They don’t need to log in.",
  f_role: "role", ph_name: "Name", ph_role: "Role",
  set_account: "Account", signed_in_as: "Signed in as {email}", sign_out: "Sign out",
  no_account_demo: "No account in demo mode.", set_language: "Language",
  demo_banner: "Demo mode. Changes live only in this browser and reset on reload. Add Supabase keys (see README) to save and share.",

  cd_days: "{n} days to go", cd_tomorrow: "Tomorrow! 🎉", cd_today: "Today! 🎉",
  cd_married: "Married {n} days ago 🎉",

  auth_prompt: "Sign in to open your wedding board.",
  auth_google: "Continue with Google", auth_or_email: "or sign in with email instead",
  auth_email_ph: "you@email.com", auth_send: "Send link", auth_sending: "Sending…",
  auth_or_divider: "or email",
  auth_check: "Check your inbox — we sent a sign-in link to {email}. Open it on this device to continue.",
};

const RU = {
  nav_board: "Доска", nav_budget: "Бюджет", nav_vendors: "Подрядчики",
  nav_guests: "Гости", nav_settings: "Настройки",

  add: "Добавить", save: "Сохранить", cancel: "Отмена", delete: "Удалить",
  search_tasks: "Поиск задач…", search_vendors: "Поиск подрядчиков…", search_names: "Поиск по имени…",
  all_categories: "Все категории", anyone: "Любой", any_priority: "Любой приоритет",
  any_stage: "Любой этап", all_sides: "Все стороны", any_rsvp: "Любой ответ",
  btn_task: "+ Задача", btn_vendor: "+ Подрядчик", btn_expense: "+ Расход", btn_guest: "+ Гость",
  btn_add_inline: "+ Добавить", export_csv: "Экспорт CSV", import_csv: "Импорт CSV",

  eyebrow_workflow: "Процесс", title_board: "Доска",
  eyebrow_money: "Деньги", title_budget: "Бюджет", czk_view: "просмотр в CZK",
  eyebrow_suppliers: "Поставщики", title_vendors: "Подрядчики",
  eyebrow_people: "Люди", title_guests: "Гости",
  eyebrow_setup: "Настройка", title_settings: "Настройки",

  col_backlog: "Бэклог", col_todo: "К выполнению", col_doing: "В процессе",
  col_waiting: "Ожидание", col_done: "Готово",
  prio_low: "низкий", prio_medium: "средний", prio_high: "высокий",
  sort_prefix: "Сортировка", sort_due: "По дате", sort_priority: "По приоритету",
  sort_category: "По категории", sort_assignee: "По исполнителю",

  f_title: "Название", f_description: "Описание", f_column: "Колонка", f_priority: "Приоритет",
  f_category: "Категория", f_assignee: "Исполнитель", f_due: "Срок",
  tcat_Venue: "Площадка", tcat_Vendor: "Подрядчик", tcat_Budget: "Бюджет", tcat_Guest: "Гости",
  tcat_Travel: "Поездки", tcat_Admin: "Организация", tcat_Other: "Другое",
  new_task: "Новая задача", edit_task: "Редактировать задачу",

  stat_total_budget: "Общий бюджет", stat_planned: "Запланировано", stat_spent: "Потрачено (факт)",
  stat_remaining: "Остаток", stat_paid: "Оплачено",
  vendor_commitments: "Обязательства по подрядчикам", from_vendors_tab: "из вкладки «Подрядчики»",
  total_quoted: "Всего по сметам", deposits_paid: "Депозиты оплачены", outstanding: "К оплате",
  "bcat:venue": "площадка", "bcat:food/drinks": "еда/напитки", "bcat:music": "музыка",
  "bcat:photo/video": "фото/видео", "bcat:decorations": "оформление",
  "bcat:clothing": "одежда", "bcat:rings": "кольца", "bcat:misc buffer": "прочее (резерв)",
  f_label: "Название", f_linked_vendor: "Связанный подрядчик", f_planned_eur: "Запланировано (EUR)",
  f_actual_eur: "Факт (EUR)", f_paid: "Оплачено", paid: "оплачено", unpaid: "не оплачено", plan_prefix: "план",
  new_expense: "Новый расход", edit_expense: "Редактировать расход",
  no_expenses: "Пока нет расходов. Добавьте первый кнопкой «+ Расход».",

  stat_vendors: "Подрядчики", stat_deposits_paid: "Депозиты оплачены", stat_outstanding: "К оплате",
  stage_lead: "заявка", stage_contacted: "связались", stage_negotiating: "переговоры",
  stage_booked: "забронировано", stage_paid: "оплачено", stage_done: "готово",
  vcat_photographer: "Фотограф", vcat_videographer: "Видеограф", vcat_band: "Группа",
  vcat_dj: "Диджей", vcat_decoration: "Оформление", vcat_catering: "Кейтеринг", vcat_dress: "Платье / костюм",
  vcat_makeup: "Макияж / причёска", vcat_cake: "Торт", vcat_transport: "Транспорт", vcat_other: "Другое",
  f_name: "Имя", f_type: "Тип", f_stage: "Этап", f_contact_name: "Контактное лицо",
  f_phone: "Телефон", f_email: "Эл. почта", f_price_quote: "Их цена / смета (EUR)",
  f_deposit_required: "Депозит (EUR)", f_deposit_paid: "Депозит оплачен",
  remaining_balance: "Остаток к оплате", balance_hint: "«цена» — это сколько они просят, а не сколько вы оплатили",
  f_contract: "Ссылка на договор (URL)", f_notes_log: "Заметки / история",
  v_price: "Цена", v_balance: "Остаток", deposit_paid_pill: "депозит оплачен", deposit_due_pill: "депозит к оплате",
  new_vendor: "Новый подрядчик", edit_vendor: "Редактировать подрядчика",
  no_vendors: "Пока нет подрядчиков. Добавьте первого кнопкой «+ Подрядчик».", no_match: "Нет совпадений.",

  paid_headcount: "оплачиваемых гостей", total_bodies: "всего человек",
  rsvp_confirmed: "Подтвердили", rsvp_tentative: "Под вопросом", rsvp_declined: "Отказались", rsvp_none: "Нет ответа",
  plus_ones: "Сопровождающие", kids_chair: "Дети (место)", kids_lap: "Дети (на руках)",
  side_confirmed: "{c} подтвердили / {i} приглашено", paid_seats: "оплач. мест",
  side_Serbian: "Сербы", side_Kazakh: "Казахи", side_Czech: "Чехи",
  needs_hotel: "Нужен отель", needs_transport: "Нужен трансфер",
  shown_total: "{shown} показано · {total} всего",
  f_side: "Сторона", f_rsvp: "Ответ (RSVP)", f_country: "Страна", f_plus_ones: "Сопровождающие",
  f_kids_chair: "Дети с местом (5+)", f_kids_lap: "Дети на руках (до 5)", f_dietary: "Питание/аллергии",
  f_needs_accommodation: "Нужно жильё", f_needs_transport: "Нужен трансфер", f_notes: "Заметки",
  new_guest: "Новый гость", edit_guest: "Редактировать гостя",

  set_wedding_day: "День свадьбы",
  set_wedding_hint: "Укажите дату — обратный отсчёт появится вверху всех вкладок.",
  f_date: "Дата", set_budget_currency: "Бюджет и валюта",
  f_total_budget_eur: "Общий бюджет (в EUR)", f_display_currency: "Валюта отображения",
  f_exchange_rate: "Курс — 1 EUR = ? CZK (примерно)",
  currency_note: "Суммы вводятся в EUR. Переключение на CZK меняет только отображение по этому курсу — сохранённые данные не меняются.",
  set_people: "Люди (исполнители)",
  set_people_hint: "Используются в списке исполнителей задач. Им не нужно входить в приложение.",
  f_role: "роль", ph_name: "Имя", ph_role: "Роль",
  set_account: "Аккаунт", signed_in_as: "Вы вошли как {email}", sign_out: "Выйти",
  no_account_demo: "Нет аккаунта в демо-режиме.", set_language: "Язык",
  demo_banner: "Демо-режим. Изменения хранятся только в этом браузере и сбрасываются при перезагрузке. Добавьте ключи Supabase (см. README), чтобы сохранять и делиться.",

  cd_days: "осталось дней: {n}", cd_tomorrow: "Завтра! 🎉", cd_today: "Сегодня! 🎉",
  cd_married: "Женаты уже {n} дн. 🎉",

  auth_prompt: "Войдите, чтобы открыть доску свадьбы.",
  auth_google: "Войти через Google", auth_or_email: "или войти по эл. почте",
  auth_email_ph: "вы@почта.com", auth_send: "Отправить ссылку", auth_sending: "Отправка…",
  auth_or_divider: "или эл. почта",
  auth_check: "Проверьте почту — мы отправили ссылку для входа на {email}. Откройте её на этом устройстве.",
};

const DICT = { en: EN, ru: RU };
export const LANGS = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export function translate(lang, key, vars) {
  const table = DICT[lang] || EN;
  let s = table[key];
  if (s == null) s = EN[key];
  if (s == null) s = key;
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(String(vars[k]));
  return s;
}

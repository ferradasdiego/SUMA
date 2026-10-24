# SUMA — Arquitectura

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Aprobada para Fase 0. Revisión formal en la puerta G1. |
| Propietario | Agente 0 — Coordinador y arquitecto principal |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0 |
| Alcance | MVP local-first para iOS y Android |

> Este documento es la fuente única de verdad técnica del proyecto. Cualquier agente que implemente código debe leerlo antes de empezar. Si una decisión cambia, se actualiza este documento y su ADR en el mismo cambio (spec §14.5).

---

## 1. Resumen ejecutivo

Decisiones estructurales del MVP:

1. **Cliente**: React Native 0.88 + Expo SDK 58 + TypeScript estricto, con Expo Router.
2. **Persistencia**: SQLite local mediante `expo-sqlite`, sin cuenta ni backend en el MVP. Modo local-first.
3. **Dinero**: enteros en unidades menores (`amount_minor`), nunca coma flotante. Una moneda por perfil en el MVP (EUR por defecto).
4. **Tiempo**: la **fecha local del registro** (`occurred_local_date`, formato `YYYY-MM-DD`) es la clave de agrupación diaria, semanal, mensual y anual. El instante UTC se conserva para orden y auditoría.
5. **Cálculos**: una sola implementación de dominio; las estadísticas se derivan de los registros, nunca de totales almacenados.
6. **Estado**: React Context + invalidación por versión de datos. Sin Zustand ni TanStack Query en el MVP.
7. **Gráficas**: componentes propios sobre `react-native-svg`, accesibles y sin dependencias pesadas.

```
┌────────────────────── app/ (rutas Expo Router) ──────────────────────┐
│  onboarding      (tabs)/index   (tabs)/add   (tabs)/history          │
│  (tabs)/statistics      goals      settings                          │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │  features/*  (casos de uso)  │
                 └───────┬──────────────┬───────┘
                         │              │
              ┌──────────▼─────┐   ┌────▼───────────────────┐
              │ domain/*       │   │ data/*  (repositorios) │
              │ dinero, fechas │   │ SQL + migraciones      │
              │ cálculos       │   └────┬───────────────────┘
              └────────────────┘        │
                                ┌───────▼────────┐
                                │ SqlDriver      │
                                │ expo-sqlite    │
                                │ sql.js (test)  │
                                └────────────────┘
```

---

## 2. Entorno de ejecución verificado

Comprobado el 2026-10-23 a las 18:07 (Europe/Madrid) sobre macOS 27.0.1 arm64.

| Recurso | Resultado real | Consecuencia |
|---|---|---|
| Node.js | 24.8.0 | Compatible con Expo SDK 58 y con los requisitos de RNTL 14 (Node 24+). |
| npm / pnpm / Corepack | 11.8.0 / 10.17.0 / 0.34.0 | `pnpm` es el gestor del proyecto. |
| Git | 2.51.0 | Instalado, pero **el directorio no es un repositorio**. |
| Xcode | 26.6 (build 17F113) | Instalado, pero **la licencia no está aceptada**, por lo que `simctl` y la compilación iOS fallan. |
| Simuladores iOS | No consultables (bloqueado por la licencia) | No se puede verificar la app en simulador ni ejecutar E2E. |
| JDK | Ausente | No se puede compilar Android localmente. |
| Android SDK / adb | Ausentes | No se puede compilar ni ejecutar en emulador Android. |
| CocoaPods | Ausente | `expo prebuild` + build local de iOS no es viable ahora. |
| Expo CLI / EAS CLI | No instalados globalmente | Se usarán vía `npx expo` y `npx eas-cli`. |
| Red | Acceso a registry.npmjs.org correcto (HTTP 200) | Se pueden instalar dependencias. |
| Disco | 102 GB libres | Suficiente para node_modules, caches y builds. |

**Lectura honesta**: este entorno puede escribir código, instalar dependencias, ejecutar TypeScript, linters y pruebas, y empaquetar el bundle JS. **No puede** compilar ni firmar iOS/Android hoy, ni publicar en tiendas. Las fases 1–5 se pueden completar y verificar con pruebas automatizadas y exportación de bundles; la verificación en dispositivo queda bloqueada hasta que se resuelvan los puntos de §22 (B1, B2).

---

## 3. Stack técnico aprobado

Versiones consultadas en el registro de npm el 2026-10-23. Se fijan en el lockfile y se validan con `npx expo install --check` y `npx expo-doctor`.

| Capa | Tecnología | Versión de referencia | Motivo |
|---|---|---|---|
| Runtime | Expo SDK | 58.0.x | Multiplataforma, actualizaciones OTA, EAS. |
| UI | React Native | 0.88.0 | Versión del template oficial de SDK 58. |
| UI | React | 19.3.0 | Versión del template oficial. |
| Web (canal adicional) | react-native-web + react-dom | ~0.21.4 / 19.3.0 | PWA instalable con el mismo código. |
| Lenguaje | TypeScript | ~6.0.3 (`strict`) | Versión que trae el template de SDK 58. TS 7.0.2 existe, pero no es la base soportada por el SDK. |
| Navegación | expo-router | ~58.0.25 | Rutas por archivos, tipadas, deep links. |
| Persistencia | expo-sqlite | ~58.0.13 | SQLite nativo, transacciones, API asíncrona. |
| Formularios | react-hook-form | 7.90.x | Formularios sin re-render excesivo. |
| Validación | zod | 4.6.x | Esquemas compartidos entre formularios, dominio y mapeo de filas. |
| UUID | expo-crypto | ~58.0.7 | `randomUUID()` estable en dispositivo. |
| Gráficas | react-native-svg | 15.16.x | Primitivas SVG; gráficas propias y accesibles. |
| Tests unitarios | Jest + jest-expo | 30.x + ~58.0.12 | Compatibilidad oficial con Expo. |
| Tests de componentes | @testing-library/react-native | 14.1.x | Requiere `test-renderer` (lo aporta jest-expo). |
| Tests de persistencia | sql.js | 1.15.x (devDependency) | SQLite en Node/WASM sin compilación nativa. |
| Calidad | ESLint (`eslint-config-expo`) + Prettier | ~58.0.4 / 3.9.x | Configuración mantenida por Expo. |
| Gestor de paquetes | pnpm | 10.17.0 | Instalaciones reproducibles y rápidas. |

**Fuera del MVP (deliberadamente)**: Zustand, TanStack Query, ORM (Drizzle/Prisma), librerías de fechas, librerías de gráficas de terceros, RevenueCat, analítica, notificaciones, Supabase.

### 3.1 Política de versiones

- Las dependencias nativas se instalan con `npx expo install` para respetar la matriz del SDK; no se escriben versiones a mano.
- El `pnpm-lock.yaml` se versiona. CI instala con `--frozen-lockfile`.
- No se actualiza el SDK dentro de una fase sin una tarea explícita y una regresión completa.
- `npx expo-doctor` se ejecuta en CI y en cada actualización de dependencias.

---

## 4. Capas y reglas de dependencia

| Capa | Responsabilidad | Puede importar de |
|---|---|---|
| `app/` | Rutas, composición de pantallas, navegación | `features/`, `components/`, `theme/`, `i18n/` |
| `features/` | Casos de uso y hooks de pantalla | `domain/`, `data/`, `components/`, `theme/`, `i18n/` |
| `domain/` | Entidades, dinero, fechas, cálculos, validación pura | Solo `domain/` y utilidades sin React ni React Native |
| `data/` | Repositorios, SQL, migraciones, driver | `domain/` (tipos y errores) |
| `components/ui/` | Presentación sin acceso a datos | `theme/`, `i18n/`, `domain/` solo para tipos de presentación |

Reglas obligatorias:

1. `domain/` **no** importa React, React Native, Expo ni `data/`. Debe poder ejecutarse en Node puro.
2. `data/` no importa `features/` ni `app/`.
3. Ningún archivo de `app/` contiene SQL ni cálculos; solo composición.
4. `components/ui/` no lee repositorios ni estado global.
5. Sin dependencias circulares. Se verifica con ESLint (`import/no-cycle` si el plugin está disponible; si no, revisión manual en cada integración).
6. Los totales mostrados nunca se guardan en estado global: se derivan de la base de datos.

Estas reglas se hacen cumplir con `no-restricted-imports` por carpeta y con la revisión de integración (plan §8).

---

## 5. Estructura del repositorio

```
suma/
├── app/
│   ├── _layout.tsx                 # providers, gate de onboarding, stack raíz
│   ├── onboarding.tsx
│   ├── goals.tsx
│   ├── settings.tsx
│   └── (tabs)/
│       ├── _layout.tsx             # barra inferior de 4 destinos
│       ├── index.tsx               # Inicio
│       ├── add.tsx                 # Añadir
│       ├── history.tsx             # Historial
│       └── statistics.tsx          # Estadísticas
├── src/
│   ├── components/
│   │   ├── ui/                     # Screen, Text, Button, Card, AmountText, Chip…
│   │   ├── forms/                  # AmountInput, CategoryPicker, DateField, NoteField
│   │   ├── charts/                 # BarChart, LineChart, CategoryBars
│   │   └── feedback/               # EmptyState, ErrorState, LoadingState, Dialog, Snackbar
│   ├── features/
│   │   ├── onboarding/
│   │   ├── entries/                # alta y edición de registros
│   │   ├── home/
│   │   ├── history/
│   │   ├── statistics/
│   │   ├── goals/
│   │   └── settings/
│   ├── domain/
│   │   ├── entities/
│   │   ├── money/
│   │   ├── time/
│   │   ├── calculations/
│   │   ├── validation/
│   │   └── errors/
│   ├── data/
│   │   ├── local/                  # driver.ts, expoDriver.ts, sqljsDriver.ts
│   │   ├── migrations/             # 001_initial.ts, runner.ts
│   │   ├── repositories/           # entry, category, goal, profile
│   │   └── export/                 # exportación JSON
│   ├── hooks/
│   ├── theme/
│   ├── i18n/
│   ├── config/                     # env.ts, constants.ts
│   ├── utils/
│   └── types/
├── tests/
│   ├── unit/                       # dominio puro en Node
│   ├── integration/                # repositorios sobre sql.js
│   ├── components/                 # RNTL
│   └── e2e/                        # Maestro (bloqueado en este entorno)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── STATUS.md
│   ├── EXECUTION_PLAN.md
│   └── decisions/                  # ADR-XXXX.md
├── assets/
├── app.config.ts
├── eas.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── eslint.config.js
├── jest.config.js
├── .env.example
└── README.md
```

Notas:

- No se crean carpetas vacías sin propósito (spec §7).
- No existe `src/navigation/`: Expo Router es la navegación.
- No existe `supabase/` hasta que se apruebe backend (Fase 6 o posterior).
- `user_id` se mantiene en el esquema como preparación, pero es `NULL` en modo local.

---

## 6. Contratos TypeScript

### 6.1 Resultado y errores

Los fallos esperables (validación, almacenamiento) no se lanzan como excepciones: se devuelven como `Result`, para que la UI decida el mensaje.

```ts
// src/domain/errors/result.ts
export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AppError };

export type ErrorCode =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'STORAGE'
  | 'MIGRATION'
  | 'IO'
  | 'UNKNOWN';

export interface AppError {
  readonly code: ErrorCode;
  readonly message: string;   // técnico, para logs; la UI usa i18n
  readonly field?: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
}

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = (error: AppError): Result<never> => ({ ok: false, error });
```

### 6.2 Entidades

```ts
// src/domain/entities/types.ts
export type IsoDateTime = string;   // 2026-10-23T16:07:15.000Z
export type LocalDate = string;     // 2026-10-23 (validado con Zod)
export type CurrencyCode = string;  // ISO 4217, 3 letras mayúsculas
export type WeekStartsOn = 0 | 1;   // 0 = domingo, 1 = lunes (ISO)

export interface Entry {
  readonly id: string;
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly categoryId: string;
  readonly note: string | null;
  readonly occurredAtUtc: IsoDateTime;
  readonly occurredLocalDate: LocalDate;
  readonly occurredTz: string;      // IANA, p. ej. Europe/Madrid
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}

export type NewEntry = Pick<
  Entry,
  'amountMinor' | 'currency' | 'categoryId' | 'note' |
  'occurredAtUtc' | 'occurredLocalDate' | 'occurredTz'
>;

export type EntryPatch = Partial<NewEntry>;

export interface Category {
  readonly id: string;              // identificador estable, p. ej. cat_coffee
  readonly nameKey: string;         // clave i18n: category.coffee
  readonly icon: string;            // nombre de Ionicons
  readonly colorToken: string;      // token del tema, nunca un hex
  readonly isDefault: boolean;
  readonly isActive: boolean;
  readonly sortOrder: number;
}

export interface Goal {
  readonly id: string;
  readonly title: string;
  readonly targetAmountMinor: number;
  readonly currency: CurrencyCode;
  readonly startDate: LocalDate;
  readonly targetDate: LocalDate | null;
  readonly isActive: boolean;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}

export interface UserProfile {
  readonly id: string;              // 'local' en el MVP
  readonly displayName: string | null;
  readonly preferredCurrency: CurrencyCode;
  readonly locale: string;          // 'es-ES'
  readonly weekStartsOn: WeekStartsOn;
  readonly onboardingCompleted: boolean;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}
```

### 6.3 Repositorios

```ts
// src/data/repositories/types.ts
export interface EntryQuery {
  readonly fromLocalDate?: LocalDate;   // inclusive
  readonly toLocalDate?: LocalDate;     // inclusive
  readonly categoryIds?: readonly string[];
  readonly currency?: CurrencyCode;
  readonly limit?: number;
  readonly offset?: number;
  readonly order?: 'occurred_desc' | 'occurred_asc';
}

export interface EntryRepository {
  create(input: NewEntry): Promise<Result<Entry>>;
  update(id: string, patch: EntryPatch): Promise<Result<Entry>>;
  remove(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Entry | null>>;
  list(query?: EntryQuery): Promise<Result<readonly Entry[]>>;
  count(query?: EntryQuery): Promise<Result<number>>;
  sum(query?: EntryQuery): Promise<Result<number>>;
}

export interface CategoryRepository {
  list(includeInactive?: boolean): Promise<Result<readonly Category[]>>;
  getById(id: string): Promise<Result<Category | null>>;
}

export interface GoalRepository {
  getActive(): Promise<Result<Goal | null>>;
  list(): Promise<Result<readonly Goal[]>>;
  create(input: NewGoal): Promise<Result<Goal>>;
  update(id: string, patch: GoalPatch): Promise<Result<Goal>>;
  remove(id: string): Promise<Result<void>>;
  setActive(id: string): Promise<Result<void>>;   // transacción: desactiva el resto
}

export interface ProfileRepository {
  get(): Promise<Result<UserProfile>>;
  update(patch: ProfilePatch): Promise<Result<UserProfile>>;
  ensureExists(): Promise<Result<UserProfile>>;
  resetLocalData(): Promise<Result<void>>;
}
```

Reglas:

- `sum` solo agrega importes de una única moneda y de registros válidos; nunca mezcla monedas.
- `list` aplica `ORDER BY occurred_local_date DESC, occurred_at_utc DESC, created_at DESC` por defecto.
- Toda escritura actualiza `updated_at` en la misma sentencia.
- Los repositorios no formatean importes ni producen textos de UI.
- `setActive` y `ensureExists` se ejecutan en una transacción.

### 6.4 Driver SQL

Abstracción mínima que permite ejecutar el mismo SQL sobre `expo-sqlite` en la app y sobre `sql.js` en pruebas.

```ts
// src/data/local/driver.ts
export type SqlValue = string | number | null;

export interface SqlDriver {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: readonly SqlValue[]): Promise<{ changes: number }>;
  all<T>(sql: string, params?: readonly SqlValue[]): Promise<readonly T[]>;
  transaction<T>(fn: (tx: SqlDriver) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
```

- `expoDriver`: `openDatabaseAsync`, `execAsync`, `runAsync`, `getAllAsync`, `withTransactionAsync`.
- `sqljsDriver` (solo tests): base en memoria; exporta los bytes para simular cierre y reapertura.
- `PRAGMA foreign_keys = ON` al abrir cada conexión.
- `PRAGMA journal_mode = WAL` al abrir en dispositivo (no aplica a sql.js).

### 6.5 Validación

`src/domain/validation/schemas.ts` define esquemas Zod reutilizados en tres puntos: formularios, repositorios (antes de escribir) y mapeo de filas (antes de confiar en la base). Las restricciones SQL son defensa en profundidad, no la única validación.

---

## 7. Modelo de datos

### 7.1 Esquema v1 (SQL)

```sql
CREATE TABLE schema_migrations (
  version    INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE user_profile (
  id                   TEXT PRIMARY KEY,
  display_name         TEXT,
  preferred_currency   TEXT NOT NULL DEFAULT 'EUR' CHECK (length(preferred_currency) = 3),
  locale               TEXT NOT NULL DEFAULT 'es-ES',
  week_starts_on       INTEGER NOT NULL DEFAULT 1 CHECK (week_starts_on IN (0, 1)),
  onboarding_completed INTEGER NOT NULL DEFAULT 0 CHECK (onboarding_completed IN (0, 1)),
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);

CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  user_id     TEXT,
  name_key    TEXT NOT NULL,
  icon        TEXT NOT NULL,
  color_token TEXT NOT NULL,
  is_default  INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  is_active   INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE TABLE entries (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT,
  amount_minor         INTEGER NOT NULL CHECK (amount_minor > 0 AND amount_minor <= 100000000),
  currency             TEXT NOT NULL CHECK (length(currency) = 3),
  category_id          TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  note                 TEXT CHECK (note IS NULL OR length(note) <= 280),
  occurred_at_utc      TEXT NOT NULL,
  occurred_local_date  TEXT NOT NULL CHECK (occurred_local_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  occurred_tz          TEXT NOT NULL,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);

CREATE INDEX idx_entries_local_date ON entries (occurred_local_date DESC);
CREATE INDEX idx_entries_category_local_date ON entries (category_id, occurred_local_date DESC);

CREATE TABLE goals (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT,
  title               TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 80),
  target_amount_minor INTEGER NOT NULL CHECK (target_amount_minor > 0 AND target_amount_minor <= 1000000000),
  currency            TEXT NOT NULL CHECK (length(currency) = 3),
  start_date          TEXT NOT NULL,
  target_date         TEXT,
  is_active           INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL,
  CHECK (target_date IS NULL OR target_date >= start_date)
);

-- Un único objetivo activo en el MVP (spec §4.6).
CREATE UNIQUE INDEX idx_goals_single_active ON goals (is_active) WHERE is_active = 1;
```

### 7.2 Decisiones del esquema

| Tema | Decisión | Motivo |
|---|---|---|
| Borrado | **Borrado físico** en el MVP; `deleted_at` no existe todavía | Simplicidad y coherencia de totales. Las tumbas se añaden con la sincronización (ADR-0009). |
| Moneda | Campo `currency` por registro; una sola moneda por perfil en el MVP | Cumple "no sumar monedas distintas" sin conversión (spec §9.9). |
| Fechas | `occurred_local_date` (agrupación) + `occurred_at_utc` (orden/auditoría) + `occurred_tz` | Evita recálculos erróneos tras cambios de zona horaria (spec §8.6). |
| Importes | `INTEGER` en unidades menores | Evita errores de coma flotante (spec §8.1). |
| Totales | No se almacenan | Derivables de `entries` (spec §8.7). |
| Objetivo activo | Índice único parcial | Garantiza la regla del MVP a nivel de base de datos. |
| Categorías | Semilla con IDs estables y `name_key` i18n | Traducción sin perder identidad (spec §8.2). |
| Booleanos | `INTEGER` 0/1 con `CHECK` | SQLite no tiene `BOOLEAN`. |
| Importes rápidos | JSON en `user_profile.quick_amounts_minor` | Preferencia pequeña y editable; no requiere tabla propia. |

### 7.3 Migraciones

`schema_migrations` es la fuente de verdad de la versión aplicada. `PRAGMA user_version` no se usa para evitar dos fuentes.

```ts
export interface Migration {
  readonly version: number;
  readonly name: string;
  readonly up: (db: SqlDriver) => Promise<void>;
}

export async function migrate(db: SqlDriver): Promise<Result<void>> {
  await db.exec('PRAGMA foreign_keys = ON');
  await db.exec(
    'CREATE TABLE IF NOT EXISTS schema_migrations (' +
    'version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL)'
  );
  const applied = await db.all<{ version: number }>('SELECT version FROM schema_migrations');
  const appliedVersions = new Set(applied.map((row) => row.version));

  for (const migration of MIGRATIONS) {
    if (appliedVersions.has(migration.version)) continue;
    await db.transaction(async (tx) => {
      await migration.up(tx);
      await tx.run(
        'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
        [migration.version, migration.name, new Date().toISOString()]
      );
    });
  }
  return ok(undefined);
}
```

Reglas: una migración no se edita una vez aplicada; se añade otra. Las migraciones se prueban desde base vacía y desde cada versión anterior. Si una migración falla, la transacción revierte y la app muestra un error bloqueante comprensible, sin continuar con un esquema parcial.

La migración 002 añade `quick_amounts_minor` (TEXT, JSON, por defecto `[150,250,500,1000]`) al perfil. Los importes rápidos se validan con Zod (1–6 valores enteros positivos) y el repositorio los serializa; una preferencia corrupta cae a los valores por defecto sin bloquear el arranque.

### 7.4 Semilla de categorías

| id | name_key | icono (Ionicons) | color_token | Orden |
|---|---|---|---|---|
| cat_coffee | category.coffee | cafe-outline | amber | 10 |
| cat_food | category.food | restaurant-outline | green | 20 |
| cat_shopping | category.shopping | bag-handle-outline | rose | 30 |
| cat_transport | category.transport | bus-outline | blue | 40 |
| cat_leisure | category.leisure | ticket-outline | violet | 50 |
| cat_subscriptions | category.subscriptions | repeat-outline | slate | 60 |
| cat_other | category.other | ellipsis-horizontal-circle-outline | stone | 70 |

Los `color_token` se resuelven en `src/theme/`; la base de datos nunca guarda hex.

### 7.5 Mapeo y validación de filas

- SQL en `snake_case`; entidades en `camelCase`. La conversión ocurre solo en `data/repositories/mappers.ts`.
- Cada fila se valida con Zod antes de convertirse en entidad. Una fila corrupta produce `STORAGE` con contexto, no un objeto a medias.
- Las fechas se guardan como ISO-8601 UTC con sufijo `Z`; `occurred_local_date` siempre `YYYY-MM-DD`.

---

## 8. Dinero

### 8.1 Representación

- Todo importe es un entero de unidades menores: 2,50 EUR = `250`.
- `CURRENCY_MINOR_DIGITS` define los decimales por moneda (EUR 2, JPY 0, etc.). EUR es la única moneda activa del MVP.
- Límites: entrada 100.000.000 unidades menores (1.000.000,00 EUR); objetivo 1.000.000.000 (10.000.000,00 EUR). Se definen una vez en `src/config/constants.ts` y se reflejan en los `CHECK` de SQL.

### 8.2 Análisis de entrada

`parseAmount(raw, { currency, locale })` devuelve `Result<number>`:

1. Recorta espacios, incluidos NBSP (U+00A0) y espacio fino (U+202F).
2. Rechaza cadena vacía, letras, signos no admitidos y notación científica.
3. Detecta separador decimal y de miles según el locale con `Intl.NumberFormat().formatToParts`.
4. Acepta `2,50`, `2.50` (según locale), `1.234,56`, `0,99`.
5. Rechaza más decimales de los que permite la moneda: **no se redondea en silencio**.
6. Rechaza cero, negativos, `NaN`, infinito y valores por encima del límite.
7. Convierte a entero con aritmética entera (sin `parseFloat` para el valor final).

### 8.3 Formato

`formatAmount(minor, currency, locale)` usa `Intl.NumberFormat` con `style: 'currency'` y aplica `tabular-nums` en la UI. Si `Intl` no está disponible en Hermes para el locale, hay un formateador de reserva documentado y probado. El espacio entre número y símbolo se normaliza para evitar saltos de línea.

### 8.4 Aritmética

Sumas y restas se hacen sobre enteros. No hay división de importes en el dominio salvo para calcular ratios de presentación (porcentajes), que se redondean explícitamente solo al mostrar.

---

## 9. Tiempo, periodos y estadísticas

### 9.1 Principio

Un registro pertenece al día local en que se tomó la decisión. Ese día se guarda como `occurred_local_date` en el momento de la escritura, usando la zona IANA del perfil. Los cambios posteriores de zona horaria **no reinterpretan** registros antiguos (spec §8.6).

Consecuencia: no se hacen operaciones de suma de instantes ni conversiones repetidas; los límites de día, semana, mes y año son aritmética de calendario sobre `YYYY-MM-DD`, anclada a medianoche UTC para evitar días de 23/25 horas por horario de verano.

### 9.2 API de dominio

```ts
// src/domain/time/calendar.ts
export function isLocalDate(value: string): boolean;
export function toLocalDate(instant: Date, timeZone: string): LocalDate;
export function addDays(date: LocalDate, days: number): LocalDate;
export function startOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate;
export function endOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate;
export function startOfMonth(date: LocalDate): LocalDate;
export function endOfMonth(date: LocalDate): LocalDate;
export function startOfYear(date: LocalDate): LocalDate;
export function endOfYear(date: LocalDate): LocalDate;
export function daysBetween(from: LocalDate, to: LocalDate): number;

export type PeriodKind = 'day' | 'week' | 'month' | 'year' | 'custom';
export interface PeriodRange {
  readonly kind: PeriodKind;
  readonly from: LocalDate;
  readonly to: LocalDate;
}

export function periodFor(
  kind: Exclude<PeriodKind, 'custom'>,
  anchor: LocalDate,
  weekStartsOn: WeekStartsOn
): PeriodRange;

export function clampToToday(range: PeriodRange, today: LocalDate): PeriodRange;
export function equivalentPrevious(range: PeriodRange, weekStartsOn: WeekStartsOn): PeriodRange;
```

### 9.3 Reglas de periodo

| Periodo | Rango mostrado | Comparación |
|---|---|---|
| Día | `anchor` | Día anterior |
| Semana | `startOfWeek` a `endOfWeek` | Semana anterior, mismo tramo |
| Mes | Día 1 al último del mes | Mes anterior, mismo tramo de días |
| Año | 1 de enero al 31 de diciembre | Año anterior, mismo tramo |
| Actual | Se recorta a `today` | Se compara con el mismo número de días del periodo anterior |

Reglas:

- Semana según `week_starts_on` (0 = domingo, 1 = lunes). No se asume lunes.
- Comparaciones siempre entre tramos equivalentes; la UI etiqueta "vs. mismo tramo" cuando el periodo está en curso (spec §9.6).
- Si el periodo anterior no tiene registros, no se muestra porcentaje: se muestra "Sin datos suficientes" o solo el delta absoluto.
- Promedio diario: se calcula **sobre todos los días del rango** y también sobre días con registros; ambos se etiquetan si se muestran (spec §9.7).
- Día con mayor importe: desempate por la fecha más antigua.
- Periodo vacío: total 0, listas vacías, sin gráficas engañosas.

### 9.4 Contrato de resumen

```ts
export interface CategoryTotal {
  readonly categoryId: string;
  readonly totalMinor: number;
  readonly entryCount: number;
  readonly share: number;   // 0..1
}

export interface PeriodSummary {
  readonly range: PeriodRange;
  readonly totalMinor: number;
  readonly entryCount: number;
  readonly activeDays: number;
  readonly averagePerCalendarDayMinor: number;
  readonly averagePerActiveDayMinor: number;
  readonly bestDay: { readonly date: LocalDate; readonly totalMinor: number } | null;
  readonly byCategory: readonly CategoryTotal[];
  readonly comparison: {
    readonly range: PeriodRange;
    readonly totalMinor: number;
    readonly deltaMinor: number;
    readonly ratio: number | null;   // null si no hay base suficiente
  } | null;
}

export function summarize(
  entries: readonly Entry[],
  range: PeriodRange,
  options: {
    readonly currency: CurrencyCode;
    readonly weekStartsOn: WeekStartsOn;
    readonly previousEntries?: readonly Entry[];
  }
): PeriodSummary;
```

`summarize` es una función pura y la única implementación de estos cálculos.

---

## 10. Objetivos

- Un único objetivo activo en el MVP, garantizado por índice único parcial.
- Progreso = suma de registros de la moneda del objetivo cuya `occurred_local_date` está en `[start_date, min(target_date, today)]`. Si `start_date > today`, el progreso es 0.
- `ratio = total / target` (no se recorta a 1; la UI muestra el exceso). `remaining = max(0, target - total)`.
- La UI explica que el progreso se calcula con los registros del periodo y **no** implica que el dinero esté apartado ni disponible.
- Crear o activar un objetivo desactiva el anterior en la misma transacción.
- Varios objetivos y asignación explícita de registros quedan para el backlog (spec §18.8); cuando lleguen, se definirá la regla anti-duplicidad antes de implementar.

---

## 11. Estado y flujo de datos

```ts
// src/features/app/AppProvider.tsx
export type BootStatus = 'booting' | 'ready' | 'failed';

export interface AppState {
  readonly status: BootStatus;
  readonly profile: UserProfile | null;
  readonly dataVersion: number;
  readonly error: AppError | null;
}
```

Reglas:

1. Al arrancar: abrir base, aplicar migraciones, `ensureExists` del perfil, cargar perfil. Cualquier fallo deja la app en estado `failed` con acción de reintento; nunca se muestran ceros falsos.
2. Toda mutación (alta, edición, borrado, cambio de perfil, objetivo) termina con `invalidate()`, que incrementa `dataVersion`.
3. Los hooks de datos dependen de `dataVersion` y vuelven a consultar. No hay caché global de totales.
4. Los formularios usan React Hook Form; el esquema Zod es el mismo del dominio.
5. El estado temporal de UI (modales, filtros) vive en el componente; los filtros de historial pueden vivir en la URL para conservarlos al volver atrás.
6. No se introduce TanStack Query sin una capa remota; no se introduce Zustand mientras Context baste.

---

## 12. Navegación

| Ruta | Archivo | Presentación | Contenido |
|---|---|---|---|
| `/onboarding` | `app/onboarding.tsx` | Pantalla completa, sin retorno | Bienvenida, moneda/idioma, primer registro opcional |
| `/` | `app/(tabs)/index.tsx` | Tab 1 | Inicio |
| `/add` | `app/(tabs)/add.tsx` | Tab 2 | Alta de registro |
| `/history` | `app/(tabs)/history.tsx` | Tab 3 | Historial |
| `/statistics` | `app/(tabs)/statistics.tsx` | Tab 4 | Estadísticas |
| `/goals` | `app/goals.tsx` | Push (stack) | Objetivo activo y edición |
| `/settings` | `app/settings.tsx` | Push (stack) | Ajustes |

- Barra inferior con 4 destinos, mismos nombres en iOS y Android.
- El gate de onboarding redirige una sola vez, cuando el perfil ya cargó, para evitar parpadeos.
- El botón "Registrar una decisión" de Inicio navega a `/add`.
- Tras guardar en `/add`: confirmación visible, formulario limpio y permanencia en la pantalla para permitir otro alta rápida, con acción secundaria "Ir a Inicio".
- Áreas seguras y teclado: `SafeAreaView` + `KeyboardAvoidingView`; botón de guardar siempre alcanzable.

---

## 13. Sistema visual

Tokens en `src/theme/tokens.ts`; ningún componente contiene hex.

### 13.1 Color (contraste verificado con la fórmula WCAG 2.1)

| Token | Valor | Uso | Contraste comprobado |
|---|---|---|---|
| background | #FFFFFF | Fondo principal | — |
| surface | #F6F8F6 | Fondo secundario, tarjetas | — |
| primary | #2D7A4B | Acción principal, importes destacados | 5,25:1 sobre blanco |
| primarySoft | #E8F5EB | Fondos de énfasis | 4,68:1 con primary |
| text | #1B2A20 | Texto principal | 15,01:1 sobre blanco |
| textMuted | #68756C | Texto secundario | 4,83:1 sobre blanco; 4,52:1 sobre surface |
| border | #E5EAE6 | Bordes y separadores | No aplica a texto |
| danger | #B42318 | Errores | 6,57:1 sobre blanco |
| warning | #946200 | Advertencias | 5,24:1 sobre blanco |

Todos los pares de texto cumplen AA (≥ 4,5:1). No se usa color como único portador de significado.

### 13.2 Tipografía

- Familia del sistema (SF Pro en iOS, Roboto en Android). Sin fuente externa en el MVP: elimina descargas, licencias y tiempo de arranque.
- Escala: display 40/44, título 28/34, sección 20/26, cuerpo 16/24, etiqueta 14/20, auxiliar 12/16.
- Importes con `fontVariant: ['tabular-nums']` y alineación estable.
- `allowFontScaling` activo; los contenedores crecen, no recortan.

### 13.3 Espaciado y formas

- Escala de 4: 4, 8, 12, 16, 20, 24, 32.
- Radios: 12 (campos), 16 (tarjetas), 24 (hojas), 999 (chips).
- Altura mínima de área táctil: 44 × 44.

### 13.4 Componentes obligatorios (spec §5.4)

`Button` (primario/secundario/ghost), `AmountInput`, `TextField`, `CategoryPicker`, `SummaryCard`, `EntryCard`, `GoalCard`, `ProgressBar`, `PeriodSelector`, `BarChart`, `LineChart`, `CategoryBars`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `Snackbar`, `TabBar`, `LoadingState`.

Todos con props tipadas, sin dependencias de datos y con `accessibilityLabel` obligatorio cuando el contenido no sea textual.

---

## 14. Accesibilidad

Requisitos de aceptación (spec §5.5):

- Etiquetas y roles correctos en todos los controles; `accessibilityState` en chips y pestañas.
- Orden de foco coherente; sin trampas de foco en modales.
- Texto escalable hasta 200 % sin recortes ni solapamientos; probado en las pantallas principales.
- Contraste AA mínimo; AAA en texto principal cuando sea posible.
- Información nunca solo por color: los estados llevan texto o icono.
- Movimiento reducido respetado (`AccessibilityInfo.isReduceMotionEnabled`); animaciones decorativas desactivadas.
- Gráficas con resumen textual y etiquetas por elemento; alternativa en lista para los datos clave.
- Diálogos con título, descripción y botones claros; el foco vuelve al elemento de origen al cerrar.

La auditoría formal con lector de pantalla se ejecuta en Fase 5 y requiere dispositivo o simulador (bloqueado hoy).

---

## 15. Internacionalización

- Cinco idiomas: español (`es-ES`), inglés (`en-GB`), gallego (`gl-ES`), catalán (`ca-ES`) y portugués (`pt-PT`).
- El idioma se elige en el onboarding y en Ajustes con un selector de banderas vectoriales; se guarda en `profile.locale`.
- Diccionarios tipados en `src/i18n/locales/`. `TranslationKey` se deriva del español y el resto de diccionarios se declaran como `Record<TranslationKey, string>`, de modo que TypeScript detecta una clave ausente.
- `t(key, params)` interpola parámetros y usa el locale activo. `AppProvider` llama a `setActiveLocale` al cargar o actualizar el perfil; las pantallas se vuelven a renderizar con el contexto.
- `categoryLabel(nameKey)` traduce las categorías usando su `name_key` estable.
- Los errores de dominio conservan mensajes técnicos en español; `translateError(error)` los mapea a claves traducidas. Un error desconocido cae a un mensaje genérico del idioma activo para no mezclar idiomas.
- Fechas e importes usan `Intl` con `profile.locale`. Los importes rápidos se guardan como unidades menores y no se convierten al cambiar de idioma.
- Plurales mediante claves explícitas; los resúmenes de importación usan etiquetas con contador para evitar concordancias incorrectas.
- Sin i18next: cinco diccionarios pequeños y una función propia cubren el MVP sin añadir dependencias.

---

## 16. Seguridad y privacidad

| Riesgo | Medida en el MVP |
|---|---|
| Datos en tránsito | El MVP no realiza peticiones de red. No hay telemetría ni analítica. |
| Secretos | Ninguno en el cliente. `.env` ignorado; `.env.example` solo con nombres. Solo variables `EXPO_PUBLIC_*` no sensibles. |
| Acceso físico al dispositivo | Base de datos dentro del sandbox de la app; protección de datos del sistema operativo. Sin cifrado adicional en el MVP (documentado como limitación). |
| Filtración en logs | Prohibido registrar notas, importes o identificadores personales. Logs de desarrollo solo con códigos de error. |
| Exportación | El JSON contiene notas personales; se avisa antes de compartir y se usa la hoja del sistema. |
| Borrado | Borrado físico de un registro; "Restablecer datos locales" con doble confirmación y texto explícito de irreversibilidad. |
| Acceso remoto | No aplica hasta que exista backend; entonces RLS obligatorio y pruebas de autorización. |
| Dependencias | `pnpm audit` en CI; actualizaciones revisadas. |

Pendiente antes de publicar: política de privacidad y términos reales, revisión RGPD/LOPDGDD y declaración de privacidad de las tiendas. No se afirmará cumplimiento legal sin esa revisión (spec §11.6).

---

## 17. Pruebas

| Suite | Herramienta | Alcance | Se ejecuta en este entorno |
|---|---|---|---|
| Unitaria | Jest (Node) | Dinero, fechas, periodos, comparaciones, objetivos, esquemas Zod | Sí |
| Integración | Jest (Node) + sql.js | Migraciones, CRUD, transacciones, persistencia tras cierre, restricciones | Sí |
| Componentes | jest-expo + RNTL | Formularios, validaciones, estados vacíos, diálogos, navegación básica | Sí |
| E2E | Maestro | Flujo completo del spec §16.4 | No: requiere simulador/emulador |
| Manual | Dispositivo | Accesibilidad, teclado, tamaños, rendimiento percibido | No disponible hoy |

Reglas:

- `domain/` se prueba sin mocks de React Native.
- La persistencia se prueba contra SQLite real (sql.js), no contra un mock.
- Toda regla de negocio tiene al menos un caso límite y un caso de error.
- No se persigue un porcentaje de cobertura global; se exige cobertura de los flujos críticos y de cada regla del §9.
- Los resultados que se reporten deben ser los de una ejecución real, con comando y salida.

---

## 18. CI/CD, entornos y compilación

Pipeline (GitHub Actions, Node 24 + pnpm):

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm lint`
4. `pnpm typecheck` (`tsc --noEmit`)
5. `pnpm test --ci` (unitarias + integración + componentes)
6. `pnpm audit --audit-level high`
7. `npx expo-doctor`
8. `npx expo export --platform ios --platform android` (verifica que Metro empaqueta; no compila nativo)

Entornos: `development`, `preview`, `production` (perfiles de `eas.json`). Sin datos reales en pruebas. `.env.example` documenta las variables; `src/config/env.ts` valida al arrancar y falla con un mensaje comprensible.

Compilación nativa: EAS Build (iOS/Android). Requiere cuenta Expo, credenciales de Apple/Google y aceptación de licencias. **No disponible en este entorno**; ver STATUS.md.

---

## 19. Rendimiento

Objetivos medibles (dispositivo de gama media, build de desarrollo):

| Escenario | Objetivo |
|---|---|
| Arranque hasta pantalla usable | < 3 s en frío |
| Inicio con 10.000 registros | < 300 ms hasta datos |
| Cambio de periodo en Estadísticas | < 150 ms |
| Scroll de Historial | 60 fps; páginas de 50 |
| Exportación JSON de 10.000 registros | < 2 s |

Técnicas: agregados SQL (`SUM`) para totales; consultas por rango con índices; listas paginadas; `React.memo` en filas; gráficas con un máximo de 31 puntos (día→1, semana→7, mes→días, año→12 meses); sin cálculos en render.

La medición se instrumenta en desarrollo (`performance.now`) y se documenta con resultados reales; no se declaran cifras sin medirlas.

---

## 20. Registro de decisiones (ADR)

Los ADR individuales están publicados en `docs/decisions/` (tarea T0.6 completada el 2026-10-23) y enlazados desde este índice.

| ID | Decisión | Alternativa descartada | Consecuencia principal | Estado |
|---|---|---|---|---|
| [ADR-0001](./decisions/ADR-0001-expo-react-native.md) | React Native + Expo + TypeScript | Flutter; nativo | Un código para iOS/Android; límites del runtime JS | Aprobada |
| [ADR-0002](./decisions/ADR-0002-sqlite-local.md) | SQLite (`expo-sqlite`) como persistencia | AsyncStorage, MMKV, ficheros | Requiere migraciones y SQL; datos relacionales y transaccionales | Aprobada |
| [ADR-0003](./decisions/ADR-0003-modo-local.md) | Modo local sin cuenta obligatoria | Registro obligatorio | Sin copia remota en el MVP; exportación como control del usuario | Aprobada |
| [ADR-0004](./decisions/ADR-0004-backend-diferido.md) | Sin backend en el MVP; Supabase cuando haga falta | Backend propio ahora | Esquema preparado con `user_id`; RLS se prueba al activarlo | Aprobada (revisión en Fase 6) |
| [ADR-0005](./decisions/ADR-0005-unidades-menores.md) | Importes en unidades menores enteras | `number` decimal, `Decimal` | Precisión exacta; toda la UI pasa por parse/format central | Aprobada |
| [ADR-0006](./decisions/ADR-0006-fechas-zonas-horarias.md) | `occurred_local_date` como clave temporal + UTC | Solo instantes UTC; solo hora local | Agrupación correcta y estable ante cambios de zona horaria | Aprobada |
| [ADR-0007](./decisions/ADR-0007-gestion-estado.md) | Context + `dataVersion` para estado | Zustand; Redux; TanStack Query | Menos dependencias; disciplina de invalidación manual | Aprobada |
| [ADR-0008](./decisions/ADR-0008-graficas.md) | Gráficas propias con `react-native-svg` | Victory Native, gifted-charts, Skia | Control visual y accesible; hay que construir 3 gráficas | Aprobada |
| [ADR-0009](./decisions/ADR-0009-sincronizacion.md) | Sincronización diferida; esquema preparado | Sync multi-dispositivo ahora | Sin conflictos en el MVP; se añadirán tumbas y outbox | Aprobada (diferida) |
| [ADR-0010](./decisions/ADR-0010-suscripciones.md) | Monetización diferida a Fase 7; RevenueCat | Suscripciones ahora | El núcleo gratuito se valida antes de cobrar | Aprobada |
| [ADR-0011](./decisions/ADR-0011-testing.md) | Jest + jest-expo + RNTL + sql.js; Maestro después | Detox; Vitest | Pruebas ejecutables en CI; E2E bloqueado sin simulador | Aprobada |
| [ADR-0012](./decisions/ADR-0012-telemetria.md) | Sin telemetría de terceros en el MVP | Firebase Analytics; Sentry | Menos datos recogidos; sin informe de fallos remoto | Aprobada |
| [ADR-0013](./decisions/ADR-0013-borrado-exportacion.md) | Borrado físico y exportación JSON | Borrado lógico; CSV | Simplicidad; las tumbas llegan con la sincronización | Aprobada |
| [ADR-0014](./decisions/ADR-0014-moneda-unica.md) | Una moneda por perfil en el MVP | Multimoneda con conversión | No se suman monedas distintas; cambio de moneda bloqueado con registros | Aprobada (provisional) |
| [ADR-0015](./decisions/ADR-0015-agregados-sql.md) | Agregados SQL con prueba de equivalencia | Tabla de totales; solo cálculo en memoria | Rendimiento sin segunda fuente de verdad | Aprobada |
| [ADR-0016](./decisions/ADR-0016-sin-orm.md) | Sin ORM; SQL tipado con mappers Zod | Drizzle; Prisma | Menos dependencias y control del SQL; más código de mapeo | Aprobada |
| [ADR-0017](./decisions/ADR-0017-driver-sql-test.md) | Driver SQL abstracto con implementación sql.js para tests | Mock del repositorio; build nativo en CI | Pruebas de persistencia reales sin compilar nativo | Aprobada |

---

## 21. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| No poder verificar en simulador por la licencia de Xcode | Alta (hoy) | Alto | Pruebas automatizadas + exportación de bundle; el fundador acepta la licencia para habilitar simulador |
| Ausencia de JDK/Android SDK | Alta (hoy) | Alto | EAS Build en la nube para Android; instalación local opcional |
| `expo-sqlite` no cubre algún caso (transacciones anidadas, WAL) | Media | Medio | Driver propio, pruebas de integración, plan B: better-sqlite3 en tests, revisar API del SDK |
| Diferencias de SQLite entre dispositivo y sql.js | Media | Medio | Misma versión de sintaxis, pruebas de restricciones, evitar funciones no estándar |
| `Intl` limitado en Hermes | Media | Medio | Prueba temprana en Fase 1; formateador de reserva |
| Cambios de zona horaria y DST | Media | Alto | Agrupación por fecha local; pruebas específicas de DST y cambio de zona |
| Deriva de dependencias del SDK 58 | Media | Medio | Lockfile, `expo-doctor`, sin actualizaciones dentro de una fase |
| Pérdida de datos por error de migración | Baja | Crítico | Transacciones, pruebas desde base vacía, exportación previa documentada |
| Complejidad innecesaria por ambición de funciones | Media | Medio | Alcance congelado en EXECUTION_PLAN §2; funciones fuera del MVP al backlog |

---

## 22. Preguntas abiertas y bloqueos

| ID | Tema | Propuesta por defecto | Necesario antes de | Responsable |
|---|---|---|---|---|
| P1 | Identificador de app, esquema y titular legal | `com.suma.mobile`, esquema `suma` | Fase 1 | Fundador |
| P2 | Notificaciones en el MVP | Fuera del MVP; se posponen a v1.1 | Fase 3 | Fundador |
| P3 | Cálculo del objetivo | Suma por periodo (sin asignación) | Fase 4 | Fundador |
| P4 | Formatos de exportación | JSON en el MVP; CSV después | Fase 5 | Fundador |
| P5 | Moneda | Una por perfil; cambio bloqueado con registros | Fase 2 | Fundador |
| P6 | Canales de beta y cuentas de tienda | TestFlight + Play Internal | Fase 6 | Fundador |
| P7 | Modo oscuro antes de lanzar | No; pospuesto | Fase 6 | Fundador |
| P8 | Titular y textos legales | Borrador en docs; revisión externa | Fase 6 | Fundador |

Si no hay respuesta antes de la fecha indicada, se aplica la propuesta y se documenta como supuesto en DECISIONS.md, según spec §0.1.

**B1 (bloqueo real)**: licencia de Xcode no aceptada. Desbloqueo: `sudo xcodebuild -license` en una Terminal del usuario. Sin ello no hay simulador, build local ni E2E.
**B2 (bloqueo real)**: sin JDK ni Android SDK. Desbloqueo: instalar Temurin 17+ y Android command-line tools, o usar EAS Build en la nube.

---

## 23. Canal web / PWA (adicional al MVP móvil)

La app puede compilarse también como web instalable. No sustituye a iOS/Android: es un canal adicional para probar y usar SUMA sin tienda.

### 23.1 Arquitectura

- Misma base de código mediante `react-native-web` y Expo Router con `web.output: 'single'`.
- Persistencia: `expo-sqlite` en web sobre wa-sqlite (WASM) y OPFS. No hay un driver distinto: los repositorios y migraciones se reutilizan.
- La importación de archivos `.wasm` se habilita en `metro.config.js`.
- Las rutas asíncronas se desactivan en web (`asyncRoutes: false`): todo el código viaja en el bundle inicial y el service worker puede servirlo sin conexión. Con rutas asíncronas, una pantalla no visitada antes (por ejemplo, editar un registro) no estaba disponible offline.
- La exportación de datos en web descarga un JSON con `Blob`; en nativo usa la hoja de compartir.
- La importación usa `expo-document-picker` en ambas plataformas. En web lee `asset.file` o el blob; en nativo usa `File` de `expo-file-system`.
- `src/data/export/importData.ts` valida el JSON con Zod y comprueba invariantes: versión 1, identificadores únicos, categorías existentes, una sola moneda y como máximo un objetivo activo.
- `src/data/import/importService.ts` ejecuta la importación en una transacción. **Fusionar** inserta categorías con `INSERT OR IGNORE`, registros y objetivos por identificador (omite los existentes), conserva el perfil local y exige la misma moneda. **Reemplazar** borra registros, objetivos, categorías y perfil, y restaura la copia completa, incluidos idioma, moneda e importes rápidos.
- La UI de importación muestra el resumen de la copia y pide elegir entre fusionar o reemplazar; el reemplazo tiene una segunda confirmación destructiva.

### 23.2 Requisitos de origen

SQLite web usa `SharedArrayBuffer`, disponible solo en contextos seguros y con el origen aislado:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

- `http://localhost` es contexto seguro; una IP de la red local por HTTP **no** lo es.
- Para el móvil se sirve por HTTPS con un certificado local (mkcert) o un túnel HTTPS.
- El servidor de desarrollo aplica las cabeceras; el servidor de producción (`scripts/serve-web.mjs`) también.

### 23.3 PWA

- `public/manifest.webmanifest`: nombre, iconos 192/512/maskable, `display: standalone`, colores.
- `public/offline.html`: pantalla de respaldo si no hay shell cacheado.
- `public/_headers` y `public/_redirects`: cabeceras COOP/COEP y fallback SPA para Netlify/Cloudflare Pages. `vercel.json` contiene el equivalente para Vercel.
- `public/sw.js`: cachea el shell y los recursos en tiempo de ejecución; navegación con fallback a `index.html`.
- `scripts/patch-web-html.mjs`: inyecta manifest, metadatos iOS, fondo sólido y registro del service worker en el HTML exportado (el `+html` de Expo Router no se aplica en `output: 'single'`).
- `scripts/build-sw.mjs`: recorre `dist/` después del export y sustituye `PRECACHE` en `sw.js` por la lista completa de recursos (bundle JS, workers, WASM de SQLite, fuente, iconos, manifest y `offline.html`). Así el `install` del service worker deja la app completa disponible tras una sola apertura online, sin depender de que el usuario recargue para cachear el bundle.
- El viewport **no** usa `viewport-fit=cover`. Así el contenido queda dentro del área segura y no se dibuja bajo la barra de estado translúcida de iOS 26, que producía un blur superior. El HTML fija `background-color`, `overscroll-behavior-y: none` y `theme-color: #FFFFFF`.
- El service worker usa `suma-v6`. Si una navegación recibe un archivo vacío o no-HTML (por ejemplo, un túnel caído), sirve el shell cacheado o `offline.html` en lugar de descargar el archivo.
- Para uso sin PC, `dist/` se puede publicar en Netlify, Cloudflare Pages o Vercel. `public/_headers` y `vercel.json` configuran COOP/COEP; sin esas cabeceras SQLite WASM no arranca. Ver [DEPLOY_STATIC.md](./DEPLOY_STATIC.md).
- Iconos generados en `public/icons/`, servidos desde el mismo origen.

### 23.4 Limitaciones

- Los datos están asociados al **origen**: localhost, IP local y túnel son almacenamientos distintos.
- iOS puede desalojar datos de sitios poco usados; la exportación JSON es la copia de seguridad.
- Sin notificaciones push, sincronización ni acceso a todas las capacidades nativas.
- La instalación y el service worker requieren HTTPS (o localhost).
- No se ejecuta E2E de la PWA en CI; se verifica en local con Chrome headless.

### 23.5 Verificación

`pnpm web:build` genera `dist/`. `pnpm web:serve` sirve la PWA con COOP/COEP. `node scripts/smoke-web.mjs` comprueba en Chrome:

- origen aislado y `SharedArrayBuffer`;
- onboarding, alta y persistencia al recargar;
- service worker y manifest;
- historial y estadísticas;
- funcionamiento sin conexión;
- importación JSON con fusión y reemplazo, idioma persistente y selector de banderas.

También se ha probado sobre HTTPS con certificado local.

## 24. Trazabilidad con la especificación

| Sección del spec | Dónde se resuelve |
|---|---|
| §3 Alcance del MVP | EXECUTION_PLAN §2 |
| §4 Experiencia y navegación | §12 de este documento; plan Fases 3–4 |
| §5 Identidad visual | §13–§14 |
| §6 Arquitectura tecnológica | §3–§4 |
| §7 Organización del código | §5 |
| §8 Modelo de datos | §7 |
| §9 Reglas de negocio y cálculos | §8–§10 |
| §10 Persistencia y copias | §7.3, §16, §18 |
| §11 Seguridad y privacidad | §16 |
| §12 Modelo de negocio | EXECUTION_PLAN §12 (fuera del MVP) |
| §13–§14 Agentes y coordinación | EXECUTION_PLAN §3 y §8 |
| §15 Plan por fases | EXECUTION_PLAN §5 |
| §16 Plan de pruebas | §17; plan Fase 5 |
| §17 CI/CD y despliegue | §18 |
| §20 Decisiones arquitectónicas | §20 |
| §21 Criterios de aceptación | EXECUTION_PLAN §13 |

---

*Fin de ARCHITECTURE.md v1.0.*

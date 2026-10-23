# SUMA — Contratos entre módulos

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Aprobado para Fase 1–2 |
| Propietario | Agente 4 — Arquitectura |
| Referencia | ARCHITECTURE.md §6 |

## 1. Reglas generales

- Los contratos son tipos TypeScript y funciones puras; no hay HTTP en el MVP.
- Los errores esperables se devuelven como Result, no como excepciones.
- Ningún módulo de UI accede a SQL.
- Los cambios de contrato requieren actualizar este documento, ARCHITECTURE y un ADR si afectan a una decisión.

## 2. Dominio

### Result

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError };

type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT'
  | 'STORAGE' | 'MIGRATION' | 'IO' | 'UNKNOWN';
```

### Dinero

```ts
parseAmount(raw: string, options: {
  currency: CurrencyCode;
  locale: string;
}): Result<number>;

formatAmount(minor: number, options: {
  currency: CurrencyCode;
  locale: string;
}): string;

minorDigits(currency: CurrencyCode): number;
```

Postcondiciones: parseAmount nunca devuelve un valor no entero, cero o negativo; formatAmount nunca usa coma flotante para el valor.

### Tiempo

```ts
toLocalDate(instant: Date, timeZone: string): LocalDate;
addDays(date: LocalDate, days: number): LocalDate;
startOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate;
endOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate;
startOfMonth(date: LocalDate): LocalDate;
endOfMonth(date: LocalDate): LocalDate;
periodFor(kind, anchor, weekStartsOn): PeriodRange;
clampToToday(range: PeriodRange, today: LocalDate): PeriodRange;
equivalentPrevious(range: PeriodRange, weekStartsOn: WeekStartsOn): PeriodRange;
```

### Cálculos

```ts
sum(entries: readonly Entry[], currency: CurrencyCode): number;
summarize(entries, range, {
  currency: CurrencyCode;
  weekStartsOn: WeekStartsOn;
  previousEntries?: readonly Entry[];
}): PeriodSummary;
goalProgress(goal: Goal, entries: readonly Entry[], today: LocalDate): GoalProgress;
```

## 3. Persistencia

### Driver

```ts
interface SqlDriver {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: readonly SqlValue[]): Promise<{ changes: number }>;
  all<T>(sql: string, params?: readonly SqlValue[]): Promise<readonly T[]>;
  transaction<T>(fn: (tx: SqlDriver) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
```

### Perfil

`ProfilePatch` admite `displayName`, `preferredCurrency`, `locale`, `weekStartsOn`, `onboardingCompleted` y `quickAmountsMinor` (1–6 importes en unidades menores). Los importes rápidos son una preferencia del perfil y se guardan en la misma fila.

### Importación

```ts
type ImportMode = 'merge' | 'replace';

interface ImportSummary {
  mode: ImportMode;
  importedEntries: number;
  skippedEntries: number;
  importedGoals: number;
  skippedGoals: number;
  importedCategories: number;
}

importData({ driver, now }, payload, mode): Promise<Result<ImportSummary>>;
```

`parseImportPayload(text)` valida el JSON antes de escribir. `merge` conserva el perfil local, omite identificadores existentes y exige la misma moneda; `replace` restaura el perfil incluido en la copia y sustituye todos los datos. Ambas operaciones son transaccionales.

### Repositorios

```ts
interface EntryRepository {
  create(input: NewEntry): Promise<Result<Entry>>;
  update(id: string, patch: EntryPatch): Promise<Result<Entry>>;
  remove(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Entry | null>>;
  list(query?: EntryQuery): Promise<Result<readonly Entry[]>>;
  count(query?: EntryQuery): Promise<Result<number>>;
  sum(query?: EntryQuery): Promise<Result<number>>;
}
```

Contratos de error:

| Situación | Código | Mensaje de UI |
|---|---|---|
| Importe inválido | VALIDATION | "Introduce un importe válido" |
| Categoría inexistente | VALIDATION / NOT_FOUND | "Elige una categoría" |
| Registro ya no existe | NOT_FOUND | "Este registro ya no existe" |
| Fallo de base de datos | STORAGE | "No se pudieron guardar los datos" |
| Migración fallida | MIGRATION | "No se pudo preparar la aplicación" |

## 4. Estado de la aplicación

```ts
interface AppContextValue {
  status: 'booting' | 'ready' | 'failed';
  profile: UserProfile | null;
  categories: readonly Category[];
  repositories: Repositories | null;
  dataVersion: number;
  error: AppError | null;
  completeOnboarding(input: OnboardingInput): Promise<Result<void>>;
  updateProfile(patch: ProfilePatch): Promise<Result<void>>;
  importData(payload: ExportPayload, mode: ImportMode): Promise<Result<ImportSummary>>;
  refresh(): Promise<void>;
  invalidate(): void;
  retry(): void;
}
```

Reglas: ninguna mutación puede terminar sin llamar a invalidate(); el contexto no guarda totales ni entradas.

## 5. Presentación

- Componentes UI: props tipadas, sin acceso a datos.
- Formularios: React Hook Form + esquema Zod compartido con el dominio.
- i18n: `t(key, params)` con claves tipadas y diccionarios ES/EN/GL/CA/PT; `translateError(error)` para errores de dominio.
- Tema: tokens; prohibido el hex en componentes.

## 6. Backend futuro (no implementado)

Si se activa Supabase: PostgreSQL con RLS, autenticación, migraciones reproducibles y verificación de identidad en servidor. La app nunca enviará un user_id libre para decidir el propietario de un dato. Este apartado es una intención, no un contrato vigente.

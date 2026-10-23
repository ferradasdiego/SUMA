import { render, screen } from '@testing-library/react-native';

import { EntryRow } from '@/components/entries/EntryRow';
import { categoriesFixture, makeEntry } from '../fixtures/entries';

describe('EntryRow', () => {
  it('muestra la nota, la categoría y el importe', async () => {
    const entry = makeEntry({
      id: 'a',
      amountMinor: 250,
      note: 'Café en casa',
      occurredLocalDate: '2026-10-23',
    });

    await render(<EntryRow entry={entry} category={categoriesFixture[0]} locale="es-ES" />);

    expect(screen.getByText('Café en casa')).toBeVisible();
    expect(screen.getAllByText(/Café/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2,50/)).toBeVisible();
  });

  it('usa la categoría cuando no hay nota', async () => {
    const entry = makeEntry({ id: 'b', note: null });

    await render(<EntryRow entry={entry} category={categoriesFixture[1]} locale="es-ES" />);

    expect(screen.getAllByText(/Comida/).length).toBeGreaterThan(0);
  });

  it('no falla si la categoría no está disponible', async () => {
    const entry = makeEntry({ id: 'c', note: null });

    await render(<EntryRow entry={entry} category={undefined} locale="es-ES" />);

    expect(screen.getAllByText(/Otros/).length).toBeGreaterThan(0);
  });
});

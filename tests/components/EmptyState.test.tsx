import { render, screen, userEvent } from '@testing-library/react-native';

import { EmptyState } from '@/components/feedback/EmptyState';

describe('EmptyState', () => {
  it('muestra título y descripción', async () => {
    await render(<EmptyState title="Sin registros" description="Añade tu primera decisión." />);

    expect(screen.getByText('Sin registros')).toBeVisible();
    expect(screen.getByText('Añade tu primera decisión.')).toBeVisible();
  });

  it('ofrece una acción cuando se proporciona', async () => {
    const onAction = jest.fn();
    const user = userEvent.setup();
    await render(<EmptyState title="Sin registros" actionLabel="Añadir" onAction={onAction} />);

    await user.press(screen.getByRole('button', { name: 'Añadir' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('no muestra acción si falta el manejador', async () => {
    await render(<EmptyState title="Sin registros" actionLabel="Añadir" />);

    expect(screen.queryByRole('button', { name: 'Añadir' })).toBeNull();
  });
});

import { render, screen, userEvent } from '@testing-library/react-native';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('permite cancelar sin confirmar', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const user = userEvent.setup();

    await render(
      <ConfirmDialog
        visible
        title="¿Eliminar?"
        message="Esta acción no se puede deshacer."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await user.press(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirma la acción destructiva', async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();

    await render(
      <ConfirmDialog
        visible
        title="¿Eliminar?"
        message="Irreversible."
        confirmLabel="Eliminar"
        destructive
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    await user.press(screen.getByRole('button', { name: 'Eliminar' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

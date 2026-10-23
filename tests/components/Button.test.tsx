import { render, screen, userEvent } from '@testing-library/react-native';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('muestra la etiqueta y ejecuta onPress', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button label="Guardar" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Guardar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onPress cuando está deshabilitado', async () => {
    const onPress = jest.fn();
    await render(<Button label="Guardar" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
  });

  it('anuncia el estado ocupado durante la carga', async () => {
    await render(<Button label="Guardando" onPress={jest.fn()} loading />);

    expect(screen.getByRole('button', { name: 'Guardando' })).toBeBusy();
  });
});

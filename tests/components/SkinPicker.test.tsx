import { render, screen, userEvent } from '@testing-library/react-native';

import { SkinPicker } from '@/components/settings/SkinPicker';
import { ThemeProvider } from '@/theme';

describe('SkinPicker', () => {
  it('muestra todas las skins y anuncia la activa', async () => {
    await render(<SkinPicker value="classic" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Clásica/ })).toBeSelected();
    expect(screen.getByRole('button', { name: /Kawaii cozy/ })).not.toBeSelected();
  });

  it('devuelve la skin elegida al pulsarla', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<SkinPicker value="classic" onChange={onChange} />);

    await user.press(screen.getByRole('button', { name: /Kawaii cozy/ }));

    expect(onChange).toHaveBeenCalledWith('kawaii');
  });

  it('marca la skin activa cuando la kawaii ya está aplicada', async () => {
    await render(
      <ThemeProvider skinId="kawaii">
        <SkinPicker value="kawaii" onChange={jest.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /Kawaii cozy/ })).toBeSelected();
    expect(screen.getByRole('button', { name: /Clásica/ })).not.toBeSelected();
  });
});

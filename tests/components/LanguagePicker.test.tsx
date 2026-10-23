import { render, screen, userEvent } from '@testing-library/react-native';

import { LanguagePicker } from '@/components/ui/LanguagePicker';

describe('LanguagePicker', () => {
  it('muestra los cinco idiomas y devuelve el locale elegido', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    await render(<LanguagePicker locale="es-ES" onSelect={onSelect} />);

    expect(screen.getByRole('button', { name: 'Español' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'English' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Galego' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Català' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Português' })).toBeTruthy();

    await user.press(screen.getByRole('button', { name: 'English' }));
    expect(onSelect).toHaveBeenCalledWith('en-GB');
  });
});

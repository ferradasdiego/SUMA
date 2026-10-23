import { render, screen } from '@testing-library/react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';

describe('ProgressBar', () => {
  it('expone el valor accesible y recorta el rango', async () => {
    await render(<ProgressBar ratio={0.36} accessibilityLabel="Progreso del objetivo" />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAccessibilityValue({ min: 0, max: 100, now: 36 });
  });

  it('no supera el 100 %', async () => {
    await render(<ProgressBar ratio={1.6} accessibilityLabel="Progreso" />);

    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({ now: 100 });
  });
});

import { render, screen } from '@testing-library/react-native';

import { BarChart } from '@/components/charts/BarChart';
import { CategoryBars } from '@/components/charts/CategoryBars';

describe('gráficas', () => {
  it('la gráfica de barras expone una descripción accesible', async () => {
    await render(
      <BarChart
        data={[
          { label: 'L', value: 250 },
          { label: 'M', value: 500 },
        ]}
        accessibilityLabel="Evolución semanal"
      />,
    );

    expect(screen.getByRole('image')).toBeVisible();
    expect(screen.getByLabelText('Evolución semanal')).toBeVisible();
  });

  it('las barras por categoría muestran importes y porcentajes', async () => {
    await render(
      <CategoryBars
        currency="EUR"
        locale="es-ES"
        data={[
          {
            categoryId: 'cat_food',
            label: 'Comida',
            totalMinor: 800,
            share: 0.8,
            color: '#2D7A4B',
          },
          {
            categoryId: 'cat_other',
            label: 'Otros',
            totalMinor: 200,
            share: 0.2,
            color: '#57534E',
          },
        ]}
      />,
    );

    expect(screen.getByText('Comida')).toBeVisible();
    expect(screen.getByText('80 %')).toBeVisible();
  });
});

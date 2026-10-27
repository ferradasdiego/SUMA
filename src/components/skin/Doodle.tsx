import { Svg, Path } from 'react-native-svg';

export interface DoodleProps {
  readonly size?: number;
  readonly color: string;
}

/** Estrella de cuatro puntas: el motivo más repetido de la skin kawaii. */
export function Sparkle({ size = 18, color }: DoodleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="M12 1.5c.7 5.4 4.6 9.3 10 10-5.4.7-9.3 4.6-10 10-.7-5.4-4.6-9.3-10-10 5.4-.7 9.3-4.6 10-10Z"
        fill={color}
      />
    </Svg>
  );
}

/** Corazón dibujado a mano. */
export function Heart({ size = 18, color }: DoodleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="M12 21C7.2 17.1 2.5 13.4 2.5 8.6 2.5 5.4 5 3 8 3c1.8 0 3.2.9 4 2.3C12.8 3.9 14.2 3 16 3c3 0 5.5 2.4 5.5 5.6 0 4.8-4.7 8.5-9.5 12.4Z"
        fill={color}
      />
    </Svg>
  );
}

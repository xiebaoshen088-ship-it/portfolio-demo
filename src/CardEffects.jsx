import BorderGlow from './BorderGlow.jsx';
import GradualBlur from './GradualBlur.jsx';
import './card-effects.css';

// Keep the supplied components intact; tune the portfolio's effects here.
const PALETTES = {
  warm: { background: '#f4eeeb', glow: '25 55 65', colors: ['#e5a88d', '#c8afe0', '#94afca'] },
  cool: { background: '#eeeaf6', glow: '270 40 65', colors: ['#b29dcb', '#dda5b4', '#8caec9'] },
  video: { background: '#faf9fb', glow: '265 35 65', colors: ['#bca9d5', '#dcb6a3', '#94b6c8'] },
};

export function WorkFrame({ children, tone = 'cool', radius = 24 }) {
  const palette = PALETTES[tone] || PALETTES.cool;
  return <BorderGlow
    className="work-glow"
    backgroundColor={palette.background}
    glowColor={palette.glow}
    colors={palette.colors}
    borderRadius={radius}
    glowRadius={24}
    edgeSensitivity={48}
    glowIntensity={0.55}
    coneSpread={20}
    fillOpacity={0.025}
    animated={false}
  >{children}</BorderGlow>;
}

export function WorkImageBlur() {
  return <GradualBlur
    className="work-image-blur"
    target="parent"
    position="bottom"
    height="4.5rem"
    strength={0.9}
    divCount={4}
    curve="bezier"
    exponential
    opacity={0.85}
    zIndex={1}
    animated={false}
  />;
}

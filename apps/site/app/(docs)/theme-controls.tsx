'use client';

import {
  Button,
  ButtonGroup,
  CONTRAST_LEVEL_NAMES,
  Menu,
  MenuItem,
  MenuTrigger,
  Switch,
  useTheme,
  type ColorMode,
  type ContrastLevel,
} from '@vkieu/mui';

const MODE_LABELS: Record<ColorMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'Auto',
};

/**
 * Theme, mode, contrast and motion controls, built only from library components
 * (`Menu` / `ButtonGroup` / `Switch`) and `useTheme` — no `<select>`, no non-library UI.
 */
export function ThemeControls() {
  const { theme, themes, setTheme, mode, setMode, contrast, setContrast, motion, setMotion } =
    useTheme();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MenuTrigger>
        <Button variant="outlined" size="sm">{`Theme: ${theme}`}</Button>
        <Menu
          aria-label="Colour theme"
          selectionMode="single"
          selectedKeys={[theme]}
          onAction={(key) => setTheme(String(key))}
        >
          {themes.map((name) => (
            <MenuItem key={name}>{name}</MenuItem>
          ))}
        </Menu>
      </MenuTrigger>

      <ButtonGroup
        variant="connected"
        size="sm"
        aria-label="Colour mode"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[mode]}
        onSelectionChange={(keys) => {
          const [value] = [...keys];
          if (value) setMode(value as ColorMode);
        }}
      >
        {(['light', 'dark', 'system'] as const).map((value) => (
          <Button key={value} toggle value={value}>
            {MODE_LABELS[value]}
          </Button>
        ))}
      </ButtonGroup>

      <MenuTrigger>
        <Button variant="outlined" size="sm">{`Contrast: ${contrast}`}</Button>
        <Menu
          aria-label="Contrast level"
          selectionMode="single"
          selectedKeys={[contrast]}
          onAction={(key) => setContrast(String(key) as ContrastLevel)}
        >
          {CONTRAST_LEVEL_NAMES.map((name) => (
            <MenuItem key={name}>{name}</MenuItem>
          ))}
        </Menu>
      </MenuTrigger>

      <Switch
        selected={motion === 'expressive'}
        onSelectedChange={(on) => setMotion(on ? 'expressive' : 'standard')}
      >
        Expressive motion
      </Switch>
    </div>
  );
}

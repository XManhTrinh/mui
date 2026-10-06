import { Radio, RadioGroup } from '@vkieu/mui';

/** Set `orientation="horizontal"` to lay the options out in a row. */
export function RadioGroupHorizontal() {
  return (
    <RadioGroup label="Size" orientation="horizontal" defaultValue="m" name="size">
      <Radio value="s">S</Radio>
      <Radio value="m">M</Radio>
      <Radio value="l">L</Radio>
      <Radio value="xl">XL</Radio>
    </RadioGroup>
  );
}

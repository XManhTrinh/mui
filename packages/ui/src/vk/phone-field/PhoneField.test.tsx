import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { PhoneField } from './PhoneField';

const number = () => screen.getByRole('textbox', { name: /Phone/ }) as HTMLInputElement;
// The country field is a Select: named by its value, then its label (React Aria).
const countryButton = () => screen.getByRole('button', { name: /Country$/ });

describe('PhoneField', () => {
  it('starts on the default country and formats as it reports E.164', async () => {
    const onChange = vi.fn();
    render(<PhoneField label="Phone" defaultCountry="GB" locale="en" onChange={onChange} />);
    expect(countryButton()).toHaveAccessibleName('United Kingdom (+44) Country');
    expect(countryButton()).toHaveTextContent('+44');
    await userEvent.type(number(), '07400123456');
    expect(number()).toHaveValue('07400 123456');
    expect(onChange).toHaveBeenLastCalledWith('+447400123456');
  });

  it('sets the phone keypad and telephone autofill', () => {
    render(<PhoneField label="Phone" defaultCountry="GB" />);
    expect(number()).toHaveAttribute('type', 'tel');
    expect(number()).toHaveAttribute('inputmode', 'tel');
    expect(number()).toHaveAttribute('autocomplete', 'tel');
  });

  it('switches country for a pasted international number', async () => {
    const onCountryChange = vi.fn();
    render(
      <PhoneField
        label="Phone"
        defaultCountry="GB"
        locale="en"
        onCountryChange={onCountryChange}
      />,
    );
    await userEvent.click(number());
    await userEvent.paste('+84 912 345 678');
    expect(onCountryChange).toHaveBeenCalledWith('VN');
    expect(countryButton()).toHaveTextContent('+84');
    expect(number()).toHaveValue('0912 345 678');
  });

  it('opens a searchable list with priority countries first, and picks with the keyboard', async () => {
    render(
      <PhoneField
        label="Phone"
        defaultCountry="GB"
        locale="en"
        priorityCountries={['GB', 'US', 'AU', 'VN']}
      />,
    );
    await userEvent.click(countryButton());
    const list = await screen.findByRole('listbox');
    const options = within(list).getAllByRole('option');
    expect(options.slice(0, 4).map((option) => option.textContent)).toEqual([
      'United Kingdom+44',
      'United States+1',
      'Australia+61',
      'Vietnam+84',
    ]);
    const search = screen.getByRole('searchbox', { name: 'Search countries' });
    expect(search).toHaveFocus();
    await userEvent.type(search, 'viet');
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    // The list closes (its menu animates out) and focus returns to the country field.
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
    expect(countryButton()).toHaveAttribute('aria-expanded', 'false');
    expect(countryButton()).toHaveAccessibleName('Vietnam (+84) Country');
    await waitFor(() => expect(countryButton()).toHaveFocus());
  });

  it('finds countries by dialling code and says when nothing matches', async () => {
    render(<PhoneField label="Phone" defaultCountry="GB" locale="en" />);
    await userEvent.click(countryButton());
    const search = screen.getByRole('searchbox', { name: 'Search countries' });
    await userEvent.type(search, '+61');
    const names = within(screen.getByRole('listbox'))
      .getAllByRole('option')
      .map((option) => option.textContent);
    expect(names).toContain('Australia+61');
    await userEvent.clear(search);
    await userEvent.type(search, 'zzzz');
    expect(screen.getByRole('status')).toHaveTextContent('No countries found');
  });

  it('names countries in the page language', async () => {
    render(<PhoneField label="Phone" defaultCountry="GB" locale="vi" />);
    expect(countryButton()).toHaveAccessibleName('Vương quốc Anh (+44) Country');
  });

  it('flags an invalid number when the field loses focus', async () => {
    render(<PhoneField label="Phone" defaultCountry="GB" />);
    await userEvent.type(number(), '07400');
    await userEvent.tab();
    expect(number()).toHaveAttribute('aria-invalid', 'true');
    expect(number()).toHaveAccessibleDescription(/Enter a valid phone number/);
    await userEvent.type(number(), '123456');
    expect(number()).not.toHaveAttribute('aria-invalid');
  });

  it('works controlled and submits E.164 under its name', async () => {
    function Controlled() {
      const [phone, setPhone] = useState('+61412345678');
      return (
        <form aria-label="form">
          <PhoneField label="Phone" name="phone" value={phone} onChange={setPhone} />
          <output>{phone}</output>
        </form>
      );
    }
    render(<Controlled />);
    expect(number()).toHaveValue('0412 345 678');
    expect(countryButton()).toHaveTextContent('+61');
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('phone')).toBe('+61412345678');
  });

  it('renders flags only when the app supplies them', async () => {
    render(
      <PhoneField
        label="Phone"
        defaultCountry="GB"
        renderFlag={(country) => <span data-testid="flag">{country}</span>}
      />,
    );
    expect(screen.getByTestId('flag')).toHaveTextContent('GB');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <PhoneField label="Phone" defaultCountry="GB" supportingText="Optional" />
        <PhoneField
          aria-label="Mobile"
          variant="filled"
          defaultCountry="VN"
          invalid
          errorMessage="Wrong"
        />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

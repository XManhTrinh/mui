import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { SelectItem, SelectSection } from './option-list';
import { Select, type SelectProps } from './Select';

const sortField = () => screen.getByRole('button', { name: /Sort by/ });

function Sort(props: Partial<SelectProps<object, 'single' | 'multiple'>>) {
  return (
    <Select label="Sort by" {...props}>
      <SelectItem key="newest">Newest first</SelectItem>
      <SelectItem key="low" description="Cheapest at the top">
        Price, low to high
      </SelectItem>
      <SelectItem key="high">Price, high to low</SelectItem>
    </Select>
  );
}

describe('Select', () => {
  it('opens a menu of options and shows the chosen one in the field', async () => {
    const onChange = vi.fn();
    render(<Sort onChange={onChange} />);
    await userEvent.click(sortField());
    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(3);
    await userEvent.click(within(list).getByRole('option', { name: /Price, low to high/ }));
    expect(onChange).toHaveBeenCalledWith('low');
    // The menu animates out before it unmounts (as Menu's tests wait for).
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
    expect(sortField()).toHaveTextContent('Price, low to high');
  });

  it('works with the keyboard: open, move, choose, and typeahead', async () => {
    render(<Sort />);
    await userEvent.tab();
    expect(sortField()).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(sortField()).toHaveTextContent('Price, low to high');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
    // Typeahead on the closed field jumps to a match.
    // Focus returns to the field once the menu has gone.
    await waitFor(() => expect(sortField()).toHaveFocus());
    await userEvent.keyboard('n');
    expect(sortField()).toHaveTextContent('Newest first');
  });

  it('shows the placeholder and floats the label', () => {
    render(<Sort placeholder="Choose an order" />);
    expect(sortField()).toHaveTextContent('Choose an order');
    expect(sortField().closest('[data-field-state]')).toHaveAttribute('data-floated', 'true');
  });

  it('chooses several options, lists them in the field and keeps the menu open', async () => {
    function Fruits() {
      const [value, setValue] = useState<readonly (string | number)[]>([]);
      return (
        <Select label="Fruits" selectionMode="multiple" value={value} onChange={setValue}>
          <SelectItem key="apple">Apple</SelectItem>
          <SelectItem key="banana">Banana</SelectItem>
          <SelectItem key="cherry">Cherry</SelectItem>
          <SelectItem key="date">Date</SelectItem>
        </Select>
      );
    }
    render(<Fruits />);
    const field = screen.getByRole('button', { name: /Fruits/ });
    await userEvent.click(field);
    // Picked out of order; the field lists them in the list's order.
    for (const name of ['Cherry', 'Apple', 'Banana']) {
      await userEvent.click(screen.getByRole('option', { name }));
    }
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
    expect(field).toHaveTextContent('Apple, Banana +1');
  });

  it('caps multiple selection with maxSelections', async () => {
    const onChange = vi.fn();
    render(<Sort selectionMode="multiple" maxSelections={2} onChange={onChange} />);
    await userEvent.click(sortField());
    await userEvent.click(screen.getByRole('option', { name: /Newest first/ }));
    await userEvent.click(screen.getByRole('option', { name: /low to high/ }));
    expect(onChange).toHaveBeenLastCalledWith(['newest', 'low']);
    const third = screen.getByRole('option', { name: /high to low/ });
    expect(third).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(third);
    expect(onChange).toHaveBeenCalledTimes(2);
    // Removing one frees a place.
    await userEvent.click(screen.getByRole('option', { name: /Newest first/ }));
    expect(third).not.toHaveAttribute('aria-disabled');
  });

  it("nests the first and last options' outer corners in the panel's, as Menu does", async () => {
    render(<Sort />);
    await userEvent.click(sortField());
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveClass('rounded-t-corner-medium', 'rounded-b-corner-extra-small');
    expect(options[1]).toHaveClass('rounded-t-corner-extra-small', 'rounded-b-corner-extra-small');
    expect(options.at(-1)).toHaveClass('rounded-t-corner-extra-small', 'rounded-b-corner-medium');
  });

  it('groups options in sections with headings', async () => {
    render(
      <Select label="Currency">
        <SelectSection title="Popular">
          <SelectItem key="gbp">GBP</SelectItem>
        </SelectSection>
        <SelectSection title="All">
          <SelectItem key="eur">EUR</SelectItem>
        </SelectSection>
      </Select>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Currency/ }));
    expect(screen.getByRole('group', { name: 'Popular' })).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('submits the chosen key under its name and validates required', async () => {
    const { container } = render(
      <form>
        <Sort name="sort" defaultValue="high" required />
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('sort')).toBe('high');
  });

  it('announces an error', () => {
    render(<Sort invalid errorMessage="Choose an order" />);
    expect(screen.getByText('Choose an order')).toBeInTheDocument();
    expect(sortField().closest('[data-field-state]')).toHaveAttribute('data-field-state', 'error');
  });

  it('opens in a bottom sheet with presentation="sheet"', async () => {
    render(<Sort presentation="sheet" />);
    await userEvent.click(sortField());
    expect(screen.getByRole('dialog', { name: 'Sort by' })).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens and closes under control with open and onOpenChange', async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return <Sort open={open} onOpenChange={setOpen} />;
    }
    render(<Controlled />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
    await userEvent.click(sortField());
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('is disabled', async () => {
    render(<Sort disabled />);
    expect(sortField()).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Sort supportingText="How results are ordered" />
        <Sort variant="outlined" invalid errorMessage="Required" />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

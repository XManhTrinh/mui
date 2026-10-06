import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { PropsTable, type PropsTableRow } from './PropsTable';

const rows: PropsTableRow[] = [
  {
    name: 'variant',
    type: '"filled" | "outlined"',
    defaultValue: '"filled"',
    description: 'The visual style.',
    required: false,
  },
  { name: 'label', type: 'string', description: 'The accessible name.', required: true },
];

describe('PropsTable', () => {
  it('renders a table with a caption and column headers', () => {
    render(<PropsTable caption="Button props" rows={rows} />);
    const table = screen.getByRole('table', { name: 'Button props' });
    expect(within(table).getByText('Button props').tagName).toBe('CAPTION');
    for (const header of ['Name', 'Type', 'Default', 'Description']) {
      const cell = within(table).getByRole('columnheader', { name: header });
      expect(cell).toHaveAttribute('scope', 'col');
    }
  });

  it('renders each row name as a row header and type/default as inline code', () => {
    render(<PropsTable rows={rows} />);
    const variant = screen.getByRole('rowheader', { name: /variant/ });
    expect(variant).toHaveAttribute('scope', 'row');
    expect(variant.querySelector('code')).toHaveTextContent('variant');
    const row = variant.closest('tr')!;
    expect(within(row).getByText('"filled" | "outlined"').tagName).toBe('CODE');
    expect(within(row).getByText('"filled"').tagName).toBe('CODE');
  });

  it('marks required props with an accessible label', () => {
    render(<PropsTable rows={rows} />);
    const labelRow = screen.getByRole('rowheader', { name: /label/ }).closest('tr')!;
    expect(within(labelRow).getByText('required')).toHaveClass('sr-only');
  });

  it('is a focusable scroll region named by the caption', () => {
    render(<PropsTable caption="Switch props" rows={rows} />);
    const region = screen.getByRole('region', { name: 'Switch props' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('defaults the region name to Properties', () => {
    render(<PropsTable rows={rows} />);
    expect(screen.getByRole('region', { name: 'Properties' })).toBeInTheDocument();
  });

  it('renders head with an empty body for empty rows without throwing', () => {
    render(<PropsTable rows={[]} />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(table.querySelector('tbody')?.children).toHaveLength(0);
  });

  it('puts className and classNames on the right slots and lets consumer classes win', () => {
    let element: HTMLDivElement | null = null;
    render(
      <PropsTable
        ref={(node) => {
          element = node;
        }}
        rows={rows}
        className="rounded-corner-none"
        classNames={{ table: 'text-primary', th: 'uppercase' }}
      />,
    );
    const region = element as unknown as HTMLDivElement;
    expect(region).toHaveClass('rounded-corner-none');
    expect(region).not.toHaveClass('rounded-corner-medium');
    expect(screen.getByRole('table')).toHaveClass('text-primary');
    expect(screen.getAllByRole('columnheader')[0]).toHaveClass('uppercase');
  });

  it('has no axe violations', async () => {
    const { container } = render(<PropsTable caption="Button props" rows={rows} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

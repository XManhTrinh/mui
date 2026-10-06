import type { Ref } from 'react';
import { cn } from '../../utils/cn';
import { propsTableStyles } from './props-table-styles';

export interface PropsTableRow {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
  required?: boolean;
}

export interface PropsTableClassNames {
  root?: string;
  scroll?: string;
  table?: string;
  thead?: string;
  row?: string;
  th?: string;
  td?: string;
  name?: string;
  type?: string;
  default?: string;
  description?: string;
}

export interface PropsTableProps {
  rows: PropsTableRow[];
  /** Names the scrollable region and the table; visually hidden. @default "Properties" */
  caption?: string;
  className?: string;
  classNames?: PropsTableClassNames;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A documentation props table: the generated name / type / default / description rows for a
 * component's public API.
 *
 * Not an M3 component — it is a `vk` docs-support component (architecture decision #22), and
 * deliberately not a general `DataTable` (no sorting, selection or pagination). The table is
 * wrapped in a focusable, horizontally scrollable region so it stays keyboard-operable and
 * readable on small screens; it is a server component (no client hooks).
 *
 * @example
 * <PropsTable caption="Button props" rows={buttonProps.props} />
 */
export function PropsTable({ rows, caption, className, classNames, ref }: PropsTableProps) {
  const styles = propsTableStyles();
  const label = caption ?? 'Properties';
  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={label}
      className={styles.scroll({ class: cn(classNames?.root, classNames?.scroll, className) })}
    >
      <table className={styles.table({ class: classNames?.table })}>
        <caption className={styles.caption()}>{label}</caption>
        <thead className={styles.thead({ class: classNames?.thead })}>
          <tr>
            <th scope="col" className={styles.th({ class: classNames?.th })}>
              Name
            </th>
            <th scope="col" className={styles.th({ class: classNames?.th })}>
              Type
            </th>
            <th scope="col" className={styles.th({ class: classNames?.th })}>
              Default
            </th>
            <th scope="col" className={styles.th({ class: classNames?.th })}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className={styles.row({ class: classNames?.row })}>
              <th
                scope="row"
                className={styles.nameCell({ class: cn(classNames?.th, classNames?.name) })}
              >
                <span className={styles.nameText()}>
                  <code dir="ltr" className={styles.code()}>
                    {row.name}
                  </code>
                  {row.required && (
                    <>
                      <span aria-hidden="true" className={styles.required()}>
                        *
                      </span>
                      <span className="sr-only"> required</span>
                    </>
                  )}
                </span>
              </th>
              <td className={styles.td({ class: cn(classNames?.td, classNames?.type) })}>
                {row.type ? (
                  <code dir="ltr" className={styles.code()}>
                    {row.type}
                  </code>
                ) : null}
              </td>
              <td className={styles.td({ class: cn(classNames?.td, classNames?.default) })}>
                {row.defaultValue != null && row.defaultValue !== '' ? (
                  <code dir="ltr" className={styles.code()}>
                    {row.defaultValue}
                  </code>
                ) : null}
              </td>
              <td
                className={styles.td({
                  class: cn(styles.description(), classNames?.td, classNames?.description),
                })}
              >
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

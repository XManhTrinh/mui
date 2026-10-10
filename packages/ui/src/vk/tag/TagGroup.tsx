import { Children, isValidElement, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tagGroupStyles } from './tag-styles';

export interface TagGroupProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** The tags. */
  children: ReactNode;
  /** Names the group for screen readers, e.g. "Job details". */
  'aria-label'?: string;
  ref?: Ref<HTMLUListElement>;
}

/**
 * Several tags as a list, so screen readers say how many there are (docs/plans/tag.md).
 * They wrap onto new lines with 8px between them. A server component.
 *
 * @example
 * <TagGroup aria-label="Job details">
 *   <Tag>Full-time</Tag>
 *   <Tag tone="primary">£12–14 an hour</Tag>
 * </TagGroup>
 */
export function TagGroup({ children, className, ...rest }: TagGroupProps) {
  return (
    <ul {...rest} className={tagGroupStyles({ class: className })}>
      {Children.toArray(children)
        .filter(isValidElement)
        .map((child) => (
          <li key={child.key} className="flex">
            {child}
          </li>
        ))}
    </ul>
  );
}

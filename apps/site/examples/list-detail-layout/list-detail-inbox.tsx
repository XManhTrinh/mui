'use client';

import { IconButton, List, ListItem } from '@vkieu/mui';
import { ListDetailLayout } from '@vkieu/mui/vk';
import { useState } from 'react';
import { ArrowBackIcon } from '../../components/icons';

const MESSAGES = [
  { key: 'lan', from: 'Lan Nguyễn', preview: 'See you at the market on Saturday!' },
  { key: 'bep', from: 'Bếp Cô Mai', preview: 'Your order is ready to collect.' },
  { key: 'an', from: 'An Lê', preview: 'Thanks for the recommendation.' },
];

/**
 * An inbox: the list isn't navigation, so `listAs="section"`, and `filled` panes with a wider
 * list for longer rows.
 */
export function ListDetailInbox() {
  const [open, setOpen] = useState('lan');
  const [active, setActive] = useState<'list' | 'detail'>('list');
  const message = MESSAGES.find((item) => item.key === open) ?? MESSAGES[0];

  return (
    <ListDetailLayout
      className="min-h-80 w-full"
      variant="filled"
      listAs="section"
      listWidth="400px"
      active={active}
      detailKey={`${active}-${open}`}
      listLabel="Conversations"
      detailLabel={message?.from ?? ''}
      back={
        <IconButton
          aria-label="Back to conversations"
          icon={<ArrowBackIcon />}
          onPress={() => setActive('list')}
        />
      }
      list={
        <List
          aria-label="Conversations"
          selectionMode="single"
          selectedKeys={[open]}
          onSelectionChange={(keys) => {
            const [key] = keys === 'all' ? [] : [...keys];
            setOpen(key === undefined ? open : String(key));
            setActive('detail');
          }}
        >
          {MESSAGES.map((item) => (
            <ListItem key={item.key} supportingText={item.preview}>
              {item.from}
            </ListItem>
          ))}
        </List>
      }
      detail={
        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-title-large text-on-surface">{message?.from}</h3>
          <p className="text-body-large text-on-surface-variant">{message?.preview}</p>
        </div>
      }
    />
  );
}

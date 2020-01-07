import { DiagramLayoutType } from '@blink-mind/core';
import { Icon, iconClassName, IconName } from '@blink-mind/renderer-react';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
import * as React from 'react';
import {
  ToolbarItem,
  ToolbarItemPopoverTarget
} from '../../../../components/common';

export function ToolbarItemLayout(props) {
  const layoutDirs = [
    [
      DiagramLayoutType.LEFT_AND_RIGHT,
      'Left And Right',
      'layout-left-and-right'
    ],
    [DiagramLayoutType.LEFT_TO_RIGHT, 'Only Right', 'layout-right'],
    [DiagramLayoutType.RIGHT_TO_LEFT, 'Only Left', 'layout-left']
  ];

  const onClickSetLayout = layoutDir => e => {
    const { controller } = props;
    controller.run('setLayoutDir', { ...props, layoutDir });
  };

  return (
    <ToolbarItem className={iconClassName(IconName.LAYOUT_LEFT_AND_RIGHT)}>
      <Popover enforceFocus={false}>
        <ToolbarItemPopoverTarget />
        <Menu>
          {layoutDirs.map(dir => (
            <MenuItem
              key={dir[1]}
              icon={Icon(dir[2])}
              text={dir[1]}
              onClick={onClickSetLayout(dir[0])}
            />
          ))}
        </Menu>
      </Popover>
    </ToolbarItem>
  );
}

import { demos as MyFooComponentDemos } from './MyFooComponent';
import { Group, TreeTag } from './types';

export const demos: Group<any> = {
    tag: TreeTag.Group,
    name: 'Root group',
    children: [
        {
            tag: TreeTag.Group,
            name: 'Sub group',
            children: [MyFooComponentDemos],
        },
    ],
};

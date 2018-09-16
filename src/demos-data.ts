import { demos as MyFooComponentDemos } from './MyFooComponent';
import { group } from './types';

export const demos = group({
    name: 'Root group',
    children: [
        group({
            name: 'Sub group',
            children: [MyFooComponentDemos],
        }),
        MyFooComponentDemos,
    ],
});

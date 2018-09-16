import { SFC } from 'react';
import { componentDemos } from './types';
import React = require('react');

type Props = { name: string };
const MyFooComponent: SFC<Props> = props => <div>{props.name}</div>;

export const demos = componentDemos({
    Component: MyFooComponent,
    name: 'MyFooComponent',
    demos: [
        {
            name: 'foo',
            props: {
                name: 'foo',
            },
        },
        {
            name: 'bar',
            props: {
                name: 'bar',
            },
        },
    ],
});

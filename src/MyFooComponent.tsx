import { SFC } from 'react';
import { ComponentDemos, TreeTag } from './types';
import React = require('react');

type Props = { name: string };
const MyFooComponent: SFC<Props> = props => <div>{props.name}</div>;

export const demos: ComponentDemos<Props> = {
    tag: TreeTag.ComponentDemos,
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
};

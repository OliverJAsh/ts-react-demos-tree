import { ComponentType } from 'react';

export enum TreeTag {
    Group = 'Group',
    ComponentDemos = 'ComponentDemos',
}

export type Group<P> = {
    tag: TreeTag.Group;
    name: string;
    children: Array<Tree<P>>;
};

export type ComponentDemo<P> = {
    name: string;
    props: P;
};
export type ComponentDemos<P> = {
    tag: TreeTag.ComponentDemos;
    Component: ComponentType<P>;
    name: string;
    demos: Array<ComponentDemo<P>>;
};

export type Tree<P> = Group<P> | ComponentDemos<P>;

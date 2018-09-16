import { ComponentType } from 'react';

export type Group<P> = {
    name: string;
    children: Array<Tree<P>>;
};

export type ComponentDemo<P> = {
    name: string;
    props: P;
};
export type ComponentDemos<P> = {
    Component: ComponentType<P>;
    name: string;
    demos: Array<ComponentDemo<P>>;
};

export enum TreeTag {
    Group = 'Group',
    ComponentDemos = 'ComponentDemos',
}

type TreeRecord<P> = {
    [TreeTag.Group]: Group<P>;
    [TreeTag.ComponentDemos]: ComponentDemos<P>;
};

type TreeTaggedRecord<P> = { [Tag in TreeTag]: { tag: Tag; value: TreeRecord<P>[Tag] } };

export type Tree<P> = TreeTaggedRecord<P>[TreeTag];

// Constructors

export const group = <P>(value: Group<P>): Tree<P> => ({ tag: TreeTag.Group, value });
export const componentDemos = <P>(value: ComponentDemos<P>): Tree<P> => ({
    tag: TreeTag.ComponentDemos,
    value,
});

export type TreeTaggedGroup<P> = TreeTaggedRecord<P>['Group'];
export type TreeTaggedComponentDemos<P> = TreeTaggedRecord<P>['ComponentDemos'];

// Predicates

export const checkIsGroup = <P>(tree: Tree<P>): tree is TreeTaggedGroup<P> =>
    tree.tag === TreeTag.Group;
export const checkIsComponentDemos = <P>(tree: Tree<P>): tree is TreeTaggedComponentDemos<P> =>
    tree.tag === TreeTag.ComponentDemos;

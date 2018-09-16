import { findFirst } from 'fp-ts/lib/Array';
import { option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { ComponentType, SFC } from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { demos } from './demos-data';
import { createSubType, unsafeGet } from './helpers';
import {
    checkIsComponentDemos,
    checkIsGroup,
    ComponentDemo,
    ComponentDemos,
    Group,
    Tree,
    TreeTag,
    TreeTaggedComponentDemos,
    TreeTaggedGroup,
} from './types';

type GroupParams = { groupName: string };
type ComponentDemosParams = { componentName: string };
type ComponentDemoParams = { demoName: string };

// https://github.com/Microsoft/TypeScript/issues/27124
const createGenericSFC = createSubType<SFC<any>>();

const ComponentDemoComponent = createGenericSFC(
    <P extends any>({
        Component,
        componentDemo,
        ...routeComponentProps
    }: {
        Component: ComponentType<P>;
        componentDemo: ComponentDemo<P>;
    } & RouteComponentProps<ComponentDemoParams>) => (
        <div>
            <Link to={routeComponentProps.match.url}>
                Demo: {componentDemo.name}
            </Link>
            <div>
                <Component {...componentDemo.props} />
            </div>
        </div>
    ),
);

const ComponentDemoRouteComponent = createGenericSFC(
    <P extends any>({
        parentComponentDemos,
        ...routeComponentProps
    }: {
        parentComponentDemos: ComponentDemos<P>;
    } & RouteComponentProps<ComponentDemoParams>) => (
        <ComponentDemoComponent
            Component={parentComponentDemos.Component}
            componentDemo={unsafeGet(
                findFirst(
                    parentComponentDemos.demos,
                    componentDemo =>
                        componentDemo.name ===
                        routeComponentProps.match.params.demoName,
                ),
            )}
            {...routeComponentProps}
        />
    ),
);

const ComponentDemosListComponent = createGenericSFC(
    <P extends any>({
        componentDemos,
        url,
    }: {
        componentDemos: Array<ComponentDemo<{}>>;
        url: string;
    }) => (
        <ul>
            {componentDemos.map((componentDemo, index) => (
                <li key={index}>
                    <Link to={`${url}/demo/${componentDemo.name}`}>
                        Demo: {componentDemo.name}
                    </Link>
                </li>
            ))}
        </ul>
    ),
);

const ComponentDemosIndexComponent = createGenericSFC(
    <P extends any>({
        componentDemos,
        ...routeComponentProps
    }: {
        componentDemos: ComponentDemos<P>;
    } & RouteComponentProps<ComponentDemosParams>) => (
        <ComponentDemosListComponent
            componentDemos={componentDemos.demos}
            url={routeComponentProps.match.url}
        />
    ),
);

const ComponentDemosRouteComponent = createGenericSFC(
    <P extends any>({
        parentGroup,
        ...routeComponentProps
    }: { parentGroup: Group<P> } & RouteComponentProps<
        ComponentDemosParams
    >) => {
        const { url } = routeComponentProps.match;
        const componentDemos = unsafeGet(
            findFirst(
                parentGroup.children,
                (tree): tree is TreeTaggedComponentDemos<P> =>
                    checkIsComponentDemos(tree) &&
                    tree.value.name ===
                        routeComponentProps.match.params.componentName,
            ),
        ).value;
        return (
            <div>
                <Link to={url}>Component: {componentDemos.name}</Link>
                <Switch>
                    <Route
                        path={`${url}/demo/:demoName`}
                        render={routeComponentProps => (
                            <ComponentDemoRouteComponent
                                parentComponentDemos={componentDemos}
                                {...routeComponentProps}
                            />
                        )}
                    />
                    <Route
                        render={() => (
                            <ComponentDemosIndexComponent
                                componentDemos={componentDemos}
                                {...routeComponentProps}
                            />
                        )}
                    />
                </Switch>
            </div>
        );
    },
);

const TreeListComponent = createGenericSFC(
    <P extends any>({ trees, url }: { trees: Array<Tree<P>>; url: string }) => (
        <ul>
            {trees.map((tree, index) => (
                <li key={index}>
                    {(() => {
                        switch (tree.tag) {
                            case TreeTag.Group:
                                return (
                                    <Link
                                        to={`${url}/group/${tree.value.name}`}
                                    >
                                        Group: {tree.value.name}
                                    </Link>
                                );
                            case TreeTag.ComponentDemos:
                                return (
                                    <Link
                                        to={`${url}/component/${
                                            tree.value.name
                                        }`}
                                    >
                                        Component: {tree.value.name}
                                    </Link>
                                );
                        }
                    })()}
                </li>
            ))}
        </ul>
    ),
);

const GroupIndexComponent = createGenericSFC(
    <P extends any>({
        match,
        group,
    }: { group: Group<P> } & RouteComponentProps<GroupParams>) => (
        <TreeListComponent trees={group.children} url={match.url} />
    ),
);

const GroupComponent = createGenericSFC(
    <P extends any>({
        group,
        ...routeComponentProps
    }: { group: Group<P> } & RouteComponentProps<GroupParams>) => {
        const { url } = routeComponentProps.match;
        return (
            <div>
                <Link to={url}>Group: {group.name}</Link>
                <Switch>
                    <Route
                        path={`${url}/group/:groupName`}
                        render={routeComponentProps => (
                            <GroupRouteComponent
                                parentGroup={group}
                                {...routeComponentProps}
                            />
                        )}
                    />
                    <Route
                        path={`${url}/component/:componentName`}
                        render={routeComponentProps => (
                            <ComponentDemosRouteComponent
                                parentGroup={group}
                                {...routeComponentProps}
                            />
                        )}
                    />
                    <Route
                        render={() => (
                            <GroupIndexComponent
                                group={group}
                                {...routeComponentProps}
                            />
                        )}
                    />
                </Switch>
            </div>
        );
    },
);

const GroupRouteComponent = createGenericSFC(
    <P extends any>({
        parentGroup,
        ...routeComponentProps
    }: { parentGroup: Group<P> } & RouteComponentProps<GroupParams>) => (
        <GroupComponent
            group={
                unsafeGet(
                    findFirst(
                        parentGroup.children,
                        (tree): tree is TreeTaggedGroup<P> =>
                            checkIsGroup(tree) &&
                            tree.value.name ===
                                routeComponentProps.match.params.groupName,
                    ),
                ).value
            }
            {...routeComponentProps}
        />
    ),
);

export const RootRouteComponent: SFC<
    RouteComponentProps<GroupParams>
> = routeComponentProps => {
    const rootGroup = unsafeGet(
        option
            .of(demos)
            .refine(checkIsGroup)
            .map(tagged => tagged.value),
    );
    return <GroupComponent group={rootGroup} {...routeComponentProps} />;
};

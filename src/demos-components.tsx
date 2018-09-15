import { findFirst } from 'fp-ts/lib/Array';
import * as React from 'react';
import { ComponentType, SFC } from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { demos } from './demos-data';
import { unsafeGet } from './helpers';
import { ComponentDemo, ComponentDemos, Group, Tree, TreeTag } from './types';

type GroupParams = { groupName: string };
type ComponentDemosParams = { componentName: string };
type ComponentDemoParams = { demoName: string };

// TODO: How to use SFC type with generic?
const ComponentDemoComponent = <P extends {}>({
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
);

const ComponentDemoRouteComponent: SFC<
    {
        parentComponentDemos: ComponentDemos<{}>;
    } & RouteComponentProps<ComponentDemoParams>
> = ({ parentComponentDemos, ...routeComponentProps }) => (
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
);

const ComponentDemosListComponent: SFC<{
    componentDemos: Array<ComponentDemo<{}>>;
    url: string;
}> = ({ componentDemos, url }) => (
    <ul>
        {componentDemos.map((componentDemo, index) => (
            <li key={index}>
                <Link to={`${url}/demo/${componentDemo.name}`}>
                    Demo: {componentDemo.name}
                </Link>
            </li>
        ))}
    </ul>
);

const ComponentDemosIndexComponent: SFC<
    {
        componentDemos: ComponentDemos<{}>;
    } & RouteComponentProps<ComponentDemosParams>
> = ({ componentDemos, ...routeComponentProps }) => (
    <ComponentDemosListComponent
        componentDemos={componentDemos.demos}
        url={routeComponentProps.match.url}
    />
);

const ComponentDemosRouteComponent: SFC<
    { parentGroup: Group<{}> } & RouteComponentProps<ComponentDemosParams>
> = ({ parentGroup, ...routeComponentProps }) => {
    const { url } = routeComponentProps.match;
    const componentDemos = unsafeGet(
        findFirst(
            parentGroup.children,
            (tree): tree is ComponentDemos<{}> =>
                tree.tag === TreeTag.ComponentDemos &&
                tree.name === routeComponentProps.match.params.componentName,
        ),
    );
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
};

const TreeListComponent: SFC<{ trees: Array<Tree<{}>>; url: string }> = ({
    trees,
    url,
}) => (
    <ul>
        {trees.map((tree, index) => (
            <li key={index}>
                {(() => {
                    switch (tree.tag) {
                        case TreeTag.Group:
                            return (
                                <Link to={`${url}/group/${tree.name}`}>
                                    Group: {tree.name}
                                </Link>
                            );
                        case TreeTag.ComponentDemos:
                            return (
                                <Link to={`${url}/component/${tree.name}`}>
                                    Component: {tree.name}
                                </Link>
                            );
                    }
                })()}
            </li>
        ))}
    </ul>
);

const GroupIndexComponent: SFC<
    { group: Group<{}> } & RouteComponentProps<GroupParams>
> = ({ match, group }) => (
    <TreeListComponent trees={group.children} url={match.url} />
);

const GroupComponent: SFC<
    { group: Group<{}> } & RouteComponentProps<GroupParams>
> = ({ group, ...routeComponentProps }) => {
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
};

const GroupRouteComponent: SFC<
    { parentGroup: Group<{}> } & RouteComponentProps<GroupParams>
> = ({ parentGroup, ...routeComponentProps }) => (
    <GroupComponent
        group={unsafeGet(
            findFirst(
                parentGroup.children,
                (tree): tree is Group<{}> =>
                    tree.tag === TreeTag.Group &&
                    tree.name === routeComponentProps.match.params.groupName,
            ),
        )}
        {...routeComponentProps}
    />
);

export const RootRouteComponent: SFC<
    RouteComponentProps<GroupParams>
> = routeComponentProps => (
    <GroupComponent group={demos} {...routeComponentProps} />
);

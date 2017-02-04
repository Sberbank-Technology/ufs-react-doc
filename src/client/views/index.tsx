import * as React from 'react';
import { DefaultLayout, Component } from '../components';

interface Props {
    title?: string;
    name?: string;
    components?: Component[];
}

const components: Component[] = [
    {
        srcPath: 'components/Component1/index',
        className: 'Component1',
        description: 'very cool component1',
        props: [
            {
                name: 'Component1Prop1',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component1Prop2',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component1Prop3',
                type: null,
                description: 'some prop'
            }
        ]
    },
    {
        srcPath: 'components/Component2/index',
        className: 'Component1',
        description: 'very cool component2',
        props: [
            {
                name: 'Component2Prop1',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component2Prop2',
                type: null,
                description: 'some prop'
            },
            {
                name: 'Component2Prop3',
                type: null,
                description: 'some prop'
            }
        ]
    },
    {
        srcPath: 'components/Component1/SubComponent1/index',
        className: 'SubComponent1',
        description: 'very cool sub sub component1'
    }
];

export default class HelloMessage extends React.Component<Props, {}> {
    render() {
        return (
            <DefaultLayout title={this.props.title}>
                <div>Hello, {this.props.name}!</div>
            </DefaultLayout>
        );
    }
}
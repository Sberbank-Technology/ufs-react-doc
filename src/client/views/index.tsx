import * as React from 'react';
import { DefaultLayout, ComponentType, Component } from '../components';
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

interface Props {
    title?: string;
    components?: ComponentType[];
}

const components: ComponentType[] = [
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
    static deafultProps: Props = {
        title: 'ReactDoc Example',
        components: components
    }

    render() {
        const list = this.props.components || components;
        return (
            <DefaultLayout title={this.props.title}>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h1>{this.props.title}</h1>
                        </Col>
                        <Col xs={8}>
                            <Component {...list[0]} />
                        </Col>
                        <Col xs={4}>
                            Tree
                        </Col>
                    </Row>
                </Grid>
            </DefaultLayout>
        );
    }
}
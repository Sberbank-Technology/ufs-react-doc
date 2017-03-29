import * as React from 'react';
import { DefaultLayout, ComponentType, Component, Tree } from '../components';
import { Row, Col } from 'react-bootstrap';

interface Props {
    title?: string;
    component: ComponentType;
    list: ComponentType[];
    index: number;
}

export default function ComponentView({ title, component, list, index }: Props) {
    return (
        <DefaultLayout title={title}>
            <Row>
                <Col xs={4}>
                    <Tree {...{ list, index }} />
                </Col>
                <Col xs={8}>
                    <Component {...component} />
                </Col>
            </Row>
        </DefaultLayout>
    );
}
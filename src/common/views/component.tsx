import * as React from 'react';
import { ComponentType, Component, Tree } from '../index';
import { Row, Col } from 'react-bootstrap';

interface Props {
    title?: string;
    component: ComponentType;
    list: ComponentType[];
    index: number;
}

export default function ComponentView({ title, component, list, index }: Props) {
    return (
        <Row>
            <Col xs={4}>
                <Tree {...{ list, index }} />
            </Col>
            <Col xs={8}>
                <Component {...component} />
            </Col>
        </Row>
    );
}
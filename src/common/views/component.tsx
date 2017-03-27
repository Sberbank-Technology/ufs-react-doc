import * as React from 'react';
import { DefaultLayout, ComponentType, Component, Tree } from '../components';
import { Row, Col } from 'react-bootstrap';

interface Props {
    title?: string;
    version: string;
    component: ComponentType;
    list: ComponentType[];
    pkgName: string;
    index: number;
}

export default function ComponentView({ title, component, list, version, pkgName, index }: Props) {
    return (
        <DefaultLayout title={title}>
            <Row>
                <Col xs={4}>
                    <Tree {...{ list, version, pkgName, index }} />
                </Col>
                <Col xs={8}>
                    <Component {...component} />
                </Col>
            </Row>
        </DefaultLayout>
    );
}
import * as React from 'react';
import { DefaultLayout, ComponentType, Component, Tree } from '../components';
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

interface Props {
    title: string;
    version: string;
    component: ComponentType;
    list: ComponentType[];
    pkgName: string;
}

export default function ComponentView({ title, component, list, version, pkgName }: Props) {
    console.log(component);
    return (
        <DefaultLayout title={title}>
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{title}</h1>
                    </Col>
                    <Col xs={8}>
                        <Component {...component} />
                    </Col>
                    <Col xs={4}>
                        <Tree {...{ list, version, pkgName }} />
                    </Col>
                </Row>
            </Grid>
        </DefaultLayout>
    );
}
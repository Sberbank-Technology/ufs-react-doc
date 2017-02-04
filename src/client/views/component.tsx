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
}

export default function ComponentView(props: Props) {
    const { title, component, list, version } = props;

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
                        <Tree {...{ list, version }} />
                    </Col>
                </Row>
            </Grid>
        </DefaultLayout>
    );
}
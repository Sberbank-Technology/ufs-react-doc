import * as React from 'react';
import { connect } from 'react-redux';
import { DefaultLayout, ComponentType, Component, Tree } from './components';
import { Row, Col } from 'react-bootstrap';

interface Props {
    title?: string;
    version: string;
    component: ComponentType;
    list: ComponentType[];
    pkgName: string;
    index: number;
}


/*export default function ComponentView({ title, component, list, version, pkgName, index }: Props) {
    return (
        <Row>
            <Col xs={4}>
                <Tree {...{ list, version, pkgName, index }} />
            </Col>
            <Col xs={8}>
                <Component {...component} />
            </Col>
        </Row>
    );
}*/


const ComponentList = props => {
    const list = props.components;
    const index = parseInt(props.match.params.index, 10);
    const component = list[index];

    return (
        <Row>
            <Col xs={4}>
                <Tree {...{ list, version: 'test', pkgName: 'test', index }} />
            </Col>
            <Col xs={8}>
                <Component {...component} />
            </Col>
        </Row>
    );
}


function mapState({ currentId, components }) {
    return { currentId, components };
}


export default connect(mapState)(ComponentList);

import * as React from 'react';
import { connect } from 'react-redux';
import { ComponentType, Component, Tree } from './index';
import { Row, Col } from 'react-bootstrap';


interface Props {
    title?: string;
    component: ComponentType;
    list: ComponentType[];
    index: number;
}


const ComponentList = props => {
    const list = props.components;
    const index = parseInt(props.match.params.index, 10);
    const component = list[index];

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


function mapState({ currentId, components }) {
    return { currentId, components };
}


export default connect(mapState)(ComponentList);

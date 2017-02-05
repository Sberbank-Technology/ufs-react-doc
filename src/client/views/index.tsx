import * as React from 'react';
import { DefaultLayout, Versions } from '../components';
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

interface Props {
    title: string;
    versions: string[];
}

export default function Index(props :Props) {
    const { title, versions } = props;

    return (
        <DefaultLayout {...{ title }}>
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{title}</h1>

                        <h3>Versions</h3>

                        <Versions {...{ versions }} />
                    </Col>
                </Row>
            </Grid>
        </DefaultLayout>
    );
}
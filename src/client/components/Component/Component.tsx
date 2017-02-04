import * as React from 'react';
import { ComponentType } from '../ComponentType';
import {
    Panel,
    Table
} from 'react-bootstrap';

export default function Component(props: ComponentType) {
    const { className, description } = props;
    const selfProps = props.props;

    return (
        <div>
            <h3>{className}</h3>
            <Panel>{description}</Panel>
            {
                selfProps && selfProps.length !== 0 ? (
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>

                        </thead>
                        <tbody>
                            {selfProps.map((prop, key) => (
                                <tr key={key}>
                                    <td>{prop.name}</td>
                                    <td>{prop.type}</td>
                                    <td>{prop.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : null
            }
        </div>
    );
}
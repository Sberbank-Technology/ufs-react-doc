import * as React from 'react';
import { Table } from 'react-bootstrap';

import { markdownToHtml } from '../../../common/utils';
import { PropsType } from '../../types';

export interface Props {
    props: PropsType[];
}

export default class ClassName extends React.Component<Props, {}> {
    render() {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.props.map((prop, key) => (
                        <tr key={key}>
                            <td>{prop.name}</td>
                            <td>{prop.type}</td>
                            <td dangerouslySetInnerHTML={{
                                __html: markdownToHtml(prop.description)
                            }} />
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

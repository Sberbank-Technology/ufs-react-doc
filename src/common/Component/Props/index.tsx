import * as React from 'react';
import { markdownToHtml } from '../../../common/utils';

import { PropsType } from '../../types';
import { Table } from 'react-bootstrap';

interface Props {
    list: PropsType[];
}

export default function Component({ list }: Props) {
    if (!list || list.length === 0) {
        return null;
    }

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
                {list.map((prop, key) => (
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
    );
}

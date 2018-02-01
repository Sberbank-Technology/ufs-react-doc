import * as React from 'react';
import { Table } from 'react-bootstrap';

import { markdownToHtml } from '../../../common/utils';
import { FunctionsType } from '../../types';

export interface Props {
    functions: FunctionsType[];
}

export default class ClassName extends React.Component<Props, {}> {
    render() {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Signature</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.functions.map((prop, key) => (
                        <tr key={key}>
                            <td>{prop.displaySignature}</td>
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

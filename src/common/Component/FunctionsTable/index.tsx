import * as React from 'react';
import { Table } from 'react-bootstrap';

import { markdownToHtml } from '../../../common/utils';
import { FunctionsType } from '../../types';

export interface Props {
    functions: FunctionsType[];
}

export default class ClassName extends React.Component<Props, {}> {

    renderSeparatorIfNeeded(shouldRender: boolean) {
        if (shouldRender) {
            return (
                <div>
                    <br />
                    <hr />
                </div>
            )
        }
    }

    renderStaticIfNeeded(isStatic: boolean) {
        if (isStatic) {
            return (
                <text style={{ color: '#89972e' }}>static </text>
            );
        }
    }

    render() {
        return (
            <div>
                {this.props.functions.map((prop, index, array) => (
                    <div>
                        <h3><code style={{ color: '#204f65', backgroundColor: 'transparent' }}>{prop.name}()</code></h3>
                        <br />
                        <h5><code style={{ color: '#204f65', backgroundColor: '#edf7fd' }}>{this.renderStaticIfNeeded(prop.isStatic)}{prop.displaySignature}</code></h5>
                        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(prop.description) }} />
                        {this.renderSeparatorIfNeeded(index != array.length - 1)}
                    </div>
                ))}
            </div>

        )
    }
}
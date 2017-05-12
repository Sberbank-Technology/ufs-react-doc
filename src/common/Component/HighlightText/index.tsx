import * as React from 'react';
import { highlightAuto, configure } from 'highlight.js';

import * as classNames from 'classnames';

interface Props {
    text: string;
}

export default class CodeExample extends React.Component<Props, {}> {

    render() {
        configure({ languages: ["javascript"] });
        let hl = highlightAuto(this.props.text);
        return (
            <pre
                className={'hljs'}
                dangerouslySetInnerHTML={{ __html: hl.value }} />
        );
    }
}


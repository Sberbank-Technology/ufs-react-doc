import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import { SearchItemProps } from '../types';


export default function SearchItem (props: SearchItemProps) {
    const { className, description, id } = props;

    return (
        <div className="search__item">
            <Link to={`/components/${id}`}>
                <div className="search__item-name" dangerouslySetInnerHTML={{ __html: className }} />
                <div className="search__item-description" dangerouslySetInnerHTML={{ __html: description }} />
            </Link>
        </div>
    );
}
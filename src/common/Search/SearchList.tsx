import * as React from 'react';
import * as classnames from 'classnames';

import Empty from './Empty';
import SearchItem from './SearchItem';
import { SearchItemProps, SearchListProps } from '../types';

export default function SearchList (props: SearchListProps) {
    const { showMatchList, list } = props;
    const classNames = classnames('search__list', showMatchList ? 'search__list_show' : null);

    return (
        <div className={classNames}>
            {list.length === 0 ? <Empty /> : list.map(item => <SearchItem key={item.id} {...item} />)}
        </div>
    );
};
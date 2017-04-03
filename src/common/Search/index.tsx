import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import { PropsType } from '../types';


function findMatches(list, word) {
    let matches = [];
    let classNameMatches = [];
    let descMatches = [];
    const lowerWord = word.toLowerCase().trim();

    list.forEach((item, i) => {
        const className = item.className.toLowerCase();
        const description = item.description.toLowerCase();
        const newItem = Object.assign(item, { id: i });

        if (className.includes(lowerWord)) {
            classNameMatches.push(newItem);
        } else if (description.includes(lowerWord)) {
            descMatches.push(newItem);
        }
    });

    classNameMatches = classNameMatches.sort((a, b) => {
        const startsWithA = a.className.toLowerCase().startsWith(lowerWord);
        const startsWithB = b.className.toLowerCase().startsWith(lowerWord);

        if (startsWithA > startsWithB) { return -1; }
        if (startsWithA < startsWithB) { return 1; }

        return 0;
    });
    descMatches = descMatches.sort((a, b) => {
        const startsWithA = a.description.toLowerCase().startsWith(lowerWord);
        const startsWithB = b.description.toLowerCase().startsWith(lowerWord);

        if (startsWithA > startsWithB) { return -1; }
        if (startsWithA < startsWithB) { return 1; }

        return 0;
    });
    matches = [...classNameMatches, ...descMatches];

    return matches;
}


function selectMatched(list, word) {
    const matches = list.map(item => {
        const newItem = Object.assign({}, item);
        const matchedClassName = item.className.match(new RegExp(`${word}`, 'igm'));
        const matchedDescription = item.description.match(new RegExp(`${word}`, 'igm'));

        newItem.className = item.className.replace(
            new RegExp(`${word}`, 'igm'),
            `<b>${matchedClassName ? matchedClassName[0] : matchedClassName}</b>`
        );
        let pos = item.description.search(new RegExp(`${word}`, 'igm'));

        newItem.description = item.description
            .substring(pos - 20, pos + word.length + 20)
            .replace(
                new RegExp(`${word}`, 'igm'), 
                `<b>${matchedDescription ? matchedDescription[0] : matchedDescription}</b>`
            );

        return newItem;
    });

    return matches;
}


const SearchItem = ({ className, description, id }) => (
    <div className="search__item">
        <Link to={`/components/${id}`}>
            <div className="search__item-name" dangerouslySetInnerHTML={{ __html: className }} />
            <div className="search__item-description" dangerouslySetInnerHTML={{ __html: description }} />
        </Link>
    </div>
);

const Empty = () => <div className="search__not-found">Not found</div>;

const SearchList = ({ list, showMatchList }) => {
    const classNames = classnames('search__list', showMatchList ? 'search__list_show' : '');

    return (
        <div className={classNames}>
            {list.length === 0 ? <Empty /> : list.map(item => <SearchItem key={item.id} {...item} />)}
        </div>
    );
};


interface SearchProps {
    list?: PropsType[];
}

interface SearchState {
    matches?: PropsType[];
    showMatchList: boolean;
}


export default class Search extends React.Component<SearchProps, SearchState> {
    state: SearchState = {
        matches: [],
        showMatchList: false
    }


    changeHandler = e => {
        const findingWord = e.target.value;

        if (findingWord.length > 0) {
            const matches = selectMatched(findMatches(this.props.list, findingWord), findingWord);
            const showMatchList = true;

            this.setState({ matches, showMatchList });
        }
    }


    blurHandler = e => {
        setTimeout(() => {
            this.setState({ showMatchList: false });
        }, 200);
    }


    render() {
        return (
            <div className="search">
                <FormControl
                    type="text"
                    placeholder="Enter text"
                    onChange={this.changeHandler}
                    onBlur={this.blurHandler}
                    onFocus={this.changeHandler}
                />
                <SearchList showMatchList={this.state.showMatchList} list={this.state.matches} />
            </div>
        );
    }
}
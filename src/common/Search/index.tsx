import * as React from 'react';
import { connect } from 'react-redux';
import { FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import { State } from '../../redux/reducers/index';
import { clearMarkdown } from '../utils';

import { SearchItemProps } from '../types';
import SearchList from './SearchList';


function findMatches(list, errors, word) {
    let matches = [];
    let classNameMatches = [];
    let descMatches = [];
    let errorMatches = [];
    const lowerWord = word.toLowerCase().trim();

    list.forEach((item, i) => {
        const className = clearMarkdown(item.className.toLowerCase());
        const description = clearMarkdown(item.description.toLowerCase());
        const newItem = Object.assign(item, { id: i });

        if (className.includes(lowerWord)) {
            classNameMatches.push(newItem);
        } else if (description.includes(lowerWord)) {
            descMatches.push(newItem);
        }
    });

    errors.forEach((item, i) => {
        const code = item.code.toLowerCase();
        const message = item.message.toLowerCase();
        const newItem = {
            className: item.code,
            description: item.message,
            id: i
        };

        if (code.includes(lowerWord) || message.includes(lowerWord)) {
            errorMatches.push(newItem);
        }
    });

    classNameMatches = classNameMatches.sort((a, b) => {
        const startsWithA = clearMarkdown(a.className.toLowerCase()).startsWith(lowerWord);
        const startsWithB = clearMarkdown(b.className.toLowerCase()).startsWith(lowerWord);

        if (startsWithA > startsWithB) { return -1; }
        if (startsWithA < startsWithB) { return 1; }

        return 0;
    });
    descMatches = descMatches.sort((a, b) => {
        const startsWithA = clearMarkdown(a.description.toLowerCase()).startsWith(lowerWord);
        const startsWithB = clearMarkdown(b.description.toLowerCase()).startsWith(lowerWord);

        if (startsWithA > startsWithB) { return -1; }
        if (startsWithA < startsWithB) { return 1; }

        return 0;
    });
    matches = [...classNameMatches, ...descMatches, ...errorMatches];

    return matches;
}


function selectMatched(list, word): SearchItemProps[] {
    const matches = list.map(item => {
        const regExp = new RegExp(word, 'igm');
        const newItem = Object.assign({}, item);
        const matchedClassName = clearMarkdown(item.className).match(regExp);
        const matchedDescription = clearMarkdown(item.description).match(regExp);

        newItem.className = clearMarkdown(item.className).replace(
            regExp,
            `<b>${matchedClassName ? matchedClassName[0] : matchedClassName}</b>`
        );
        let pos = clearMarkdown(item.description).search(regExp);

        newItem.description = clearMarkdown(item.description)
            .substring(pos - 20, pos + word.length + 20)
            .replace(
                new RegExp(word, 'igm'),
                `<b>${matchedDescription ? matchedDescription[0] : matchedDescription}</b>`
            );

        return newItem;
    });

    return matches;
}


interface SearchProps {
    list?: SearchItemProps[];
    errors?: any[];
}

interface SearchState {
    matches?: SearchItemProps[];
    showMatchList: boolean;
}


class Search extends React.Component<SearchProps, SearchState> {
    state: SearchState = {
        matches: [],
        showMatchList: false
    }

    changeHandler = e => {
        const query = e.target.value;

        if (query.length > 0) {
            const matches = selectMatched(findMatches(this.props.list, this.props.errors, query), query.trim());
            const showMatchList = true;
            this.setState({ matches, showMatchList });
        }
    }

    blurHandler = e => {
        this.setState({ showMatchList: false });
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

const mapStateToProps = (state: State) => ({
    list: state.components,
    errors: state.errors.list
});

export default connect(mapStateToProps)(Search);

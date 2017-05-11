import * as React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import * as classnames from 'classnames';

import ComponentList from './ComponentList';
import Search from './Search';


declare var __DEV__: boolean;

interface LayoutProps {
    currentId: number;
    components: any[];
}

const redirect = props => (
    <Redirect to={{pathname: '/components/0'}}></Redirect>
);

let hasPublicPath;

try {
    hasPublicPath = __DEV__ ? '/public/' : '';
} catch (e) {
    hasPublicPath= process.env.NODE_ENV == 'dev' ? '/public/' : '';
}


export default (props: LayoutProps) => {
    return (
        <div className="container layout">
            <header className="header">
                <img className="header__img" src={`${hasPublicPath}UFS_logo.png`} style={{width: 45, height: 45}} />
                <h1 className="header__name">UFS React Doc</h1>
                <Search list={props.components} />
            </header>
            <hr />
            <Route exact path="/components" component={ComponentList} />
            <Route exact path="/components/:index" component={ComponentList} />
            <Route exact path="/" component={ComponentList} />
        </div>
    );
};

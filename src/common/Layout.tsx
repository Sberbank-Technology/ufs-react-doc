import * as React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import * as classnames from 'classnames';

import ComponentList from './ComponentList';
import Search from './Search';


declare var __DEV__: boolean;

let ufsLogoPath;

try {
    ufsLogoPath = __DEV__ ? '/public/' : './public/';
} catch (e) {
    ufsLogoPath = '/public/';
}

ufsLogoPath += 'UFS_logo.png';


export default () => {
    return (
        <div className="container layout">
            <header className="header">
                <img className="header__img" src={ufsLogoPath} style={{width: 45, height: 45}} />
                <h1 className="header__name">UFS React Doc</h1>
                <Search />
            </header>
            <hr />
            <Route exact path="/components" component={ComponentList} />
            <Route exact path="/components/:index" component={ComponentList} />
            <Route exact path="/" component={ComponentList} />
        </div>
    );
};

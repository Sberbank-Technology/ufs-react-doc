import * as React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import ComponentList from './ComponentList';

const redirect = props => (
    <Redirect to={{pathname: '/component/0'}}></Redirect>
);


export default () => {
    return (
        <div className="container">
            <h1>
                <img src="/public/UFS_logo.png" style={{width: 45, marginTop: -7}} />
                UFS React Doc
            </h1>
            <hr />
            <Route exact path="/components" component={ComponentList} />
            <Route exact path="/components/:index" component={ComponentList} />
            <Route exact path="/" component={ComponentList} />
        </div>
    );
};

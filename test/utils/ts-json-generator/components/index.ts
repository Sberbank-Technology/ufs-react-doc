import * as React from 'react';
import CompA from './CompA'; // importing "default" value
import CompB from './CompB'; // importing "default" value with different component name inside file
import { CompC } from './CompС'; // named import
import { CompD as CompD2 } from './CompD'; // importing component and changing it's name in import
import CompE from './CompE'; // importing component with index.* filename from the directory
import { CompF1, CompF2 } from './CompF'; // importing components from file that exporting it from another files
import { CompG1, CompG2 } from './CompG'; // same thing but using another export construction export { ... } from '...'
import StatelessComp from './StatelessComp'; // importing stateless component
import DontExist from './DontExist';

export { CompA as CompAA }; // export with another name

export {
    CompB,
    CompC,
    CompD2,
    CompE,
    CompF2, // CompF1 is not exported
    StatelessComp,
    CompG1
};

export default CompG2;

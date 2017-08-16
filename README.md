UFS React Doc
============

Generator for React & TypeScript based UIKits.

## Installation
```
npm install -g ufs-react-doc
```

## Configuration
Create config file `.reacttsdoc.config.js` at the root of your project.

## Example
1. Go to "examples/simple" directory
2. Run ufs-react-doc
3. Open http://localhost:3000

## Generate static files
ufs-react-doc --to-static destinationDir

## Full Reload
By default, ufs-react-doc don't watch new components. To change it, add --full-reload flag.
```ufs-react-doc --full-reload```

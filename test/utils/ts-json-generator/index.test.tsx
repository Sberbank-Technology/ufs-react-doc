import * as path from 'path';
import * as React from 'react';
import { createStore } from 'redux';
import * as generator from '../../../src/utils/json-generators/typescript';

const createImportNode = (type, source) => {
    return { type, source };
}

const createExportNode = (type) => {
    return { type };
}

const createReExportNode = (type, sourceType, body) => {
    return { type, sourceType, ...body };
}


describe('Helpers functions', () => {
    it('isImportNode', () => {
        const importNode = createImportNode('ImportDeclaration', { value: '/some/url' });
        const notImportNode = createImportNode('ImportDeclaration', null);
        const notImportNode2 = createImportNode('badType', { value: '/some/url' });

        expect(generator.isImportNode(importNode)).toBe(true);
        expect(generator.isImportNode(notImportNode)).toBe(false);
        expect(generator.isImportNode(notImportNode2)).toBe(false);
    });

    it('isExportNode', () => {
        const exportNode = createExportNode('ExportAllDeclaration');
        const exportNode2 = createExportNode('ExportNamedDeclaration');
        const exportNode3 = createExportNode('ExportDefaultDeclaration');
        const notExportNode = createExportNode('ImportDeclaration');

        expect(generator.isExportNode(exportNode)).toBe(true);
        expect(generator.isExportNode(exportNode2)).toBe(true);
        expect(generator.isExportNode(exportNode3)).toBe(true);
        expect(generator.isExportNode(notExportNode)).toBe(false);
    });

    it('isReExportNode', () => {
        const reExportBody = { body: [{ source: './url', type: 'ExportNamedDeclaration' }] };
        const reExportNode = createReExportNode('Program', 'module', reExportBody);
        const notReExportNode = createReExportNode('NotProgram', 'module', reExportBody);
        const notReExportNode2 = createReExportNode('Program', 'module', {});
        const notReExportNode3 = createReExportNode('Program', 'notModule', reExportBody);

        expect(generator.isReExportNode(reExportNode)).toBe(true);
        expect(generator.isReExportNode(notReExportNode)).toBe(false);
        expect(generator.isReExportNode(notReExportNode2)).toBe(false);
        expect(generator.isReExportNode(notReExportNode3)).toBe(false);
    });

    it('isFileExist', () => {
        expect(generator.isFileExist('./')).toBe(false);
        expect(generator.isFileExist('../ts-json-generator')).toBe(false);
        expect(generator.isFileExist(__dirname + '/index.test.tsx')).toBe(true);
    });

    it('getSource', () => {
        const src = __dirname + '/index.test.tsx';

        expect(generator.getSource(src)).toBe(src);
        expect(generator.getSource(__dirname + '/components')).toBe(__dirname + '/components/index.ts');
        expect(generator.getSource(__dirname + '/index.test')).toBe(src);
    });

    describe('getComponentInfo return component list with', () => {
        const testData = {
            CompAA: {
                className: 'CompAA',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompA.tsx',
                description: 'CompA description',
                examples: [
                    '/ufs-react-doc/test/utils/ts-json-generator/components/url/to/example'
                ],
                category: 'A Category',
            },
            CompB: {
                className: 'CompB',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompB.tsx',
                description: 'SomeCompB description',
                examples: [
                    '/ufs-react-doc/test/utils/ts-json-generator/components/url/to/example'
                ],
                category: 'B Category'
            },
            CompC: {
                className: 'CompC',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompС.tsx',
                description: 'CompC description',
                examples: [
                    '/ufs-react-doc/test/utils/ts-json-generator/components/url/to/example'
                ],
                category: 'C Category'
            },
            CompD2: {
                className: 'CompD2',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompD.tsx',
                description: 'CompD description',
                examples: [
                    '/ufs-react-doc/test/utils/ts-json-generator/components/url/to/example'
                ],
                category: 'D Category'
            },
            CompE: {
                className: 'CompE',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompE/index.tsx',
                description: 'CompE description',
                examples: [
                    '/ufs-react-doc/test/utils/ts-json-generator/components/CompE/url/to/example'
                ],
                category: 'E Category'
            },
            CompF2: {
                className: 'CompF2',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompF/CompF2.tsx',
                description: '',
                examples: [],
                category: ''
            },
            StatelessComp: {
                className: 'StatelessComp',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/StatelessComp.tsx',
                description: '',
                examples: [],
                category: ''
            },
            CompG1: {
                className: 'CompG1',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompG/CompG1.tsx',
                description: '',
                examples: [],
                category: ''
            },
            CompG2: {
                className: 'CompG2',
                srcPath: '/ufs-react-doc/test/utils/ts-json-generator/components/CompG/CompG2.tsx',
                description: '',
                examples: [],
                category: ''
            }
        };
        const list = generator.generateComponentsJson(path.join(__dirname, './components/index.ts')).reactComponents;

        it('right amount', () => {
            expect(list.length).toBe(9);
        });

        it('right classNames', () => {
            for (const item of list) {
                expect(testData[item.className]).toBeTruthy();
            }
        });

        it('right srcPath', () => {
            for (const item of list) {
                expect(item.srcPath.indexOf(testData[item.className].srcPath)).toBeGreaterThan(-1);
            }
        });

        it('right description', () => {
            for (const item of list) {
                expect(item.description).toBe(testData[item.className].description);
            }
        });

        it('right examples paths', () => {
            for (const item of list) {
                expect(item.examples.length).toBe(testData[item.className].examples.length);

                item.examples.forEach(example => {
                    expect(example.indexOf(testData[item.className].examples)).toBeGreaterThan(-1);
                });
            }
        });

        it('right catigories', () => {
            for (const item of list) {
                expect(item.category).toBe(testData[item.className].category);
            }
        });

    });
});

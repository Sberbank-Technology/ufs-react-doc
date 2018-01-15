import generator from '../utils/generate-components-json';

export default function exportToJson(exportPath: string) {
    generator(false, exportPath);
}

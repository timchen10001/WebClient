export default function strip(str: string, charsToStrip: string[]): string {
    let stripStr = str;
    charsToStrip.map(c => {
        stripStr = stripStr.replaceAll(c, '');
    })
    return stripStr;
}
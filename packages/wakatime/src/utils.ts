/**
 * from WakaTime vscode plugin
 * https://github.com/wakatime/vscode-wakatime/blob/master/src/utils.ts
 */

export function apiKeyVertify(key?: string): boolean {
    const re = new RegExp(
        '^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
        'i',
    );
    return re.test(key)
}

export function formatDate(date: Date): String {
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let ampm = 'AM';
    let hour = date.getHours();
    if (hour > 11) {
        ampm = 'PM';
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    let minute = date.getMinutes();
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hour}:${minute < 10 ? `0${minute}` : minute
        } ${ampm}`;
}

export function obfuscateKey(key: string): string {
    let newKey = '';
    if (key) {
        newKey = key;
        if (key.length > 4)
            newKey = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX' + key.substring(key.length - 4);
    }
    return newKey;
}

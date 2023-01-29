export function quote(str: string): string {
    if (str.includes(' ')) return `"${str.replace('"', '\\"')}"`;
    return str;
}

export function apiKeyInvalid(key?: string): string {
    const err = 'Invalid api key... check https://wakatime.com/settings for your key';
    if (!key) return err;
    const re = new RegExp(
        '^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
        'i',
    );
    if (!re.test(key)) return err;
    return '';
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

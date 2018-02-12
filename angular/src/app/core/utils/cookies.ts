export function getCookie(cookieName: string) {
    const regex = new RegExp(/(?:(?:^|.*;\s*) + cookieName + \s*\=\s*([^;]*).*$)|^.*$/);
    return document.cookie.replace(regex, '$1');
}

export function hasCookie(cookieName: string) {
    return document.cookie.includes('connect.sid');
}

export function isAbsoluteUrl(url: string): boolean {
    if (typeof url !== 'string') {
        return false;
    }

    // Don't match Windows paths `c:\`
    if (/^[a-zA-Z]:\\/.test(url)) {
        return false;
    }

    // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
    // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
    return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}

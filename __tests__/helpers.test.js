const {format_date, format_plural, format_url} = require('../utils/helpers');

const { format } = require("express/lib/response")

test ('format_date() returnns a date string', () => {
    const date = new Date('2021-12-24 16:12:02');

    expect(format_date(date)).toBe('12/24/2021');
})

test('format_plural return the word with or without "s" on the end, depending on the second argument passed in', () => {
    expect(format_plural('point', 2)).toBe('points');
})

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});
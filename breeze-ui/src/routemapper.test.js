import { getMatchedRoute, getUrlFromRoute } from './routemapper';

test('simple url', () => {
  expect(getMatchedRoute('/path1', [{path: '/not_path'}])).toBeNull();
  expect(getMatchedRoute('/path1', [{path: '/not_path'}, {path: '/path1'}]))
    .toMatchObject({route: {path: '/path1'}});
});

test('parametrized url', () => {
  expect(getMatchedRoute('/page/10', [{path: '/page/:id'}])).toHaveProperty('params', {id: '10'});
});

test('build simple url', () => {
  expect(getUrlFromRoute('/path1', {})).toBe('/path1');
});

test('build parametrized url', () => {
  expect(getUrlFromRoute('/user/:id/name/:name', {id: 11, name: 'Ivan'})).toBe('/user/11/name/Ivan');
});

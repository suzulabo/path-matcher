import { Match, pathMatcher } from '.';

it('basic', () => {
  type RouteMatch = Match & {
    tag: string;
  };

  const matches: RouteMatch[] = [
    {
      pattern: '',
      tag: 'index',
    },
    {
      pattern: 'about',
      tag: 'about',
    },
    {
      pattern: /^[0-9A-Z]{5}$/,
      tag: 'post',
      name: 'postID',
      nexts: [
        {
          pattern: /^[0-9]{4}$/,
          tag: 'comment',
          name: 'commentID',
        },
        {
          pattern: 'share',
          tag: 'share',
        },
      ],
    },
  ];

  expect(pathMatcher(matches, '/')).toEqual({ match: matches[0], params: {} });
  expect(pathMatcher(matches, '/about')).toEqual({
    match: matches[1],
    params: {},
  });
  expect(pathMatcher(matches, '/ABC12')).toEqual({
    match: matches[2],
    params: {
      postID: 'ABC12',
    },
  });
  expect(pathMatcher(matches, '/ABC12/share')).toEqual({
    match: matches[2]?.nexts?.[1],
    params: {
      postID: 'ABC12',
    },
  });
  expect(pathMatcher(matches, '/ABC12/0001')).toEqual({
    match: matches[2]?.nexts?.[0],
    params: {
      postID: 'ABC12',
      commentID: '0001',
    },
  });

  expect(pathMatcher(matches, '')).toBeUndefined();
  expect(pathMatcher(matches, '/notfound')).toBeUndefined();
  expect(pathMatcher(matches, '/abc12')).toBeUndefined();
  expect(pathMatcher(matches, '/ABC12/A001')).toBeUndefined();

  // README
  {
    const assert = (b: boolean) => {
      if (!b) throw Error();
    };

    const path = '/ABC12/0001';
    const m = pathMatcher(matches, path);
    if (m) {
      assert(m.match.tag == 'comment');
      assert(m.params['postID'] == 'ABC12');
      assert(m.params['commentID'] == '0001');
    }
  }
});

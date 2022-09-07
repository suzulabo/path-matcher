# @suzulabo/path-matcher

## Install

```shell
pnpm add @suzulabo/path-matcher
```

## Example

```typescript
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
    ],
  },
];

const path = '/ABC12/0001';
const m = pathMatcher(matches, path);
if (m) {
  assert(m.match.tag == 'comment');
  assert(m.params['postID'] == 'ABC12');
  assert(m.params['commentID'] == '0001');
}
```

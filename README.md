# Git Commit Bomb

A commit bomb that distributes commits on different dates, painting your activity chart green

## Start

```sh
npm run start
```
or
```sh
yarn start
```

## Dependencies
package.json

```sh
"dependencies": {
    "jsonfile": "^6.1.0",
    "moment": "^2.29.1",
    "random": "^2.2.0",
    "simple-git": "^2.31.0"
  }
```

| Plugin | README |
| ------ | ------ |
| jsonfile | [jsonfile/README](https://www.npmjs.com/package/jsonfile) |
| moment | [moment/README](https://www.npmjs.com/package/moment) |
| random | [random/README](https://www.npmjs.com/package/random) |
| simple-git | [simple-git/README](https://www.npmjs.com/package/simple-git) |

## Instructions
- Fork this repos to your git
- Run start using npm or yarn
- (opcional) change `COMMIT_COUNT` value to the number of commits you want to "explode"

```js
const COMMIT_COUNTS = 1000;
```

## Example
### Before
[![Empty](https://i.ibb.co/SPb514C/empty.png)](https://github.com/Krauzy)
### After
[![Full](https://i.ibb.co/fSK5P9X/full.png)](https://github.com/Krauzy)

# License
Free

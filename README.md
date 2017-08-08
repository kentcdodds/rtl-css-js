# rtl-css-js

RTL conversion for CSS in JS objects

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

For some locales, it's necessary to change `padding-left` to `padding-right` when your text direction is right to left.
There are tools like this for CSS ([`cssjanus`](https://github.com/cssjanus/cssjanus) for example) which manipulate
strings of CSS to do this, but none for CSS in JS where your CSS is represented by an object.

## This solution

This is a function which accepts a CSS in JS object and can convert `padding-left` to `padding-right` as well as all
other properties where it makes sense to do that (at least, that's what it's going to be when it's done... This is a
work in progress).

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should
be installed as one of your project's `dependencies`:

```
npm install --save rtl-css-js
```

## Usage

This module is exposed via [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) as well as
[UMD](https://github.com/umdjs/umd) with the global as `rtlCSSJS`

CommonJS:

```javascript
const rtlCSSJS = require('rtl-css-js')
const styles = rtlCSSJS({paddingLeft: 23})
console.log(styles) // logs {paddingRight: 23}
```

You can also just include a script tag in your browser and use the `rtlCSSJS` variable:

```html
<script src="https://unpkg.com/rtl-css-js@1.0.0-beta.1"></script>
<script>
const styles = rtlCSSJS({paddingRight: 23})
console.log(styles) // logs {paddingLeft: 23}
</script>
```

You can also control which rules you don't want to flip by adding a `/* @noflip */` CSS comment to your rule

```javascript
const rtlCSSJS = require('rtl-css-js')
const styles = rtlCSSJS({paddingLeft: '20px /* @noflip */'})
console.log(styles) // logs {paddingLeft: '20px /* @noflip */' }
```

## Caveats

### `background`

Right now `background` and `backgroundImage` just replace all instances of `ltr` with `rtl` and `right` with `left`.
This is so you can have a different image for your LTR and RTL. Note that this is case sensitive! Must be lower case.
Note also that it *will not* change `bright` to `bleft`. It's a _little_ smarter than that. But this is definitely
something to consider with your URLs.

## Inspiration

[CSSJanus](https://github.com/cssjanus/cssjanus) was a major inspiration.

## Other Solutions

I'm not aware of any, if you are please [make a pull request](http://makeapullrequest.com) and add it here!

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/rtl-css-js/commits?author=kentcdodds) [⚠️](https://github.com/kentcdodds/rtl-css-js/commits?author=kentcdodds) 🚇 | [<img src="https://avatars.githubusercontent.com/u/63876?v=3" width="100px;"/><br /><sub>Ahmed El Gabri</sub>](https://gabri.me)<br />[💻](https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri) [📖](https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri) [⚠️](https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri) | [<img src="https://avatars1.githubusercontent.com/u/1383861?v=4" width="100px;"/><br /><sub>Maja Wichrowska</sub>](https://github.com/majapw)<br /> |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/rtl-css-js.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/rtl-css-js
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/rtl-css-js.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/rtl-css-js
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/rtl-css-js/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/rtl-css-js
[version-badge]: https://img.shields.io/npm/v/rtl-css-js.svg?style=flat-square
[package]: https://www.npmjs.com/package/rtl-css-js
[downloads-badge]: https://img.shields.io/npm/dm/rtl-css-js.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=rtl-css-js&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/rtl-css-js.svg?style=flat-square
[license]: https://github.com/kentcdodds/rtl-css-js/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/rtl-css-js/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/rtl-css-js/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/rtl-css-js/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/rtl-css-js.svg?style=social
[github-watch]: https://github.com/kentcdodds/rtl-css-js/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/rtl-css-js.svg?style=social
[github-star]: https://github.com/kentcdodds/rtl-css-js/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20rtl-css-js!%20https://github.com/kentcdodds/rtl-css-js%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/rtl-css-js.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors

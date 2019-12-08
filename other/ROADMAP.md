# Project Roadmap

## Want to do

- Cover all cases where it makes sense to convert an object from LTR to RTL or
  vice versa
- Support multiple values for some properties (as in those separated by a comma)

## Might do

- Make plugins for CSS in JS tools like [`glamor`](http://npm.im/glamor). Maybe
  that would live in a different repo though...

## Wont do

- Encode specifics of certain frameworks into the tool itself.
- Preserve formatting of strings (for example `1px 2px !important` will be
  reformatted to `1px 2px !important`, we don't care about losing the extra
  spaces)

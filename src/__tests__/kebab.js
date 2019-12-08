/**
 * This tests kebab-case support for rtl-css-js
 */

import convert from '../'

// These are the same as the short tests only with kebab-casing
const kebabTests = [
  [[{'padding-left': 23}], {'padding-right': 23}],
  [[{'padding-right': 23}], {'padding-left': 23}],
  [[{'padding-left': 0}], {'padding-right': 0}],
  [[{'margin-left': 0}], {'margin-right': 0}],
  [[{'margin-right': 0}], {'margin-left': 0}],
  [[{'text-align': 'left'}], {'text-align': 'right'}],
  [[{'text-shadow': 'red 2px 0'}], {'text-shadow': 'red -2px 0'}],
  [[{'text-shadow': 'red -2px 0'}], {'text-shadow': 'red 2px 0'}],
  [[{'text-shadow': '2px 0 red'}], {'text-shadow': '-2px 0 red'}],
  [[{'text-shadow': '-2px 0 red'}], {'text-shadow': '2px 0 red'}],
  [
    [{'box-shadow': '-6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {'box-shadow': '6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [
    [{'box-shadow': 'inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {'box-shadow': 'inset 6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [
    [{'box-shadow': 'inset .5em 0 0 white'}],
    {'box-shadow': 'inset -.5em 0 0 white'},
  ],
  [
    [{'box-shadow': 'inset 0.5em 0 0 white'}],
    {'box-shadow': 'inset -0.5em 0 0 white'},
  ],
  [
    [{'box-shadow': '-1px 2px 3px 3px red'}],
    {'box-shadow': '1px 2px 3px 3px red'},
  ],
  [
    [{'box-shadow': '-1px 2px 3px 3px red'}],
    {'box-shadow': '1px 2px 3px 3px red'},
  ],
  [
    [{'-webkit-box-shadow': '-1px 2px 3px 3px red'}],
    {'-webkit-box-shadow': '1px 2px 3px 3px red'},
  ],
  [
    [{'-moz-box-shadow': '-1px 2px 3px 3px red'}],
    {'-moz-box-shadow': '1px 2px 3px 3px red'},
  ],
  [[{'border-left': 0}], {'border-right': 0}],
  [[{'border-left': '1px solid red'}], {'border-right': '1px solid red'}],
  [[{'border-left-color': 'red'}], {'border-right-color': 'red'}],
  [[{'border-left-style': 'red'}], {'border-right-style': 'red'}],
  [[{'border-left-width': '2px'}], {'border-right-width': '2px'}],
  [
    [{'border-color': 'red green blue white'}],
    {'border-color': 'red white blue green'},
  ],
  [
    [{'border-color': 'red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'}],
    {'border-color': 'red rgba(255, 0, 0, 0.5) rgb(255, 0, 0) #f00'},
  ],
  [
    [{'border-color': 'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)'}],
    {'border-color': 'red hsla(0, 100%, 50%, 0.5) hsl(0, 100%, 50%) #f00'},
  ],
  [[{'border-width': '1px 2px 3px 4px'}], {'border-width': '1px 4px 3px 2px'}],
  [
    [{'border-style': 'none dotted dashed solid'}],
    {'border-style': 'none solid dashed dotted'},
  ],
  [[{'border-top-left-radius': 0}], {'border-top-right-radius': 0}],
  [[{'border-bottom-left-radius': 0}], {'border-bottom-right-radius': 0}],
  [[{'border-radius': '1px 2px'}], {'border-radius': '2px 1px'}],
  [
    [{'border-radius': '1px 2px 3px 4px'}],
    {'border-radius': '2px 1px 4px 3px'},
  ],
  [
    [{'border-radius': '1px 2px 3px 4px'}],
    {'border-radius': '2px 1px 4px 3px'},
  ],
  [[{'border-radius': '15px / 0 20px'}], {'border-radius': '15px / 20px 0'}],
  [
    [{'border-radius': '1px 2px 3px 4px / 5px 6px 7px 8px'}],
    {'border-radius': '2px 1px 4px 3px / 6px 5px 8px 7px'},
  ],
  [
    [{'border-radius': '1px 2px 3px 4px !important'}],
    {'border-radius': '2px 1px 4px 3px !important'},
  ],
  [
    [{'border-radius': '1px 2px 3px 4px'}],
    {'border-radius': '2px 1px 4px 3px'},
  ],
  [
    [{'border-radius': '1px 2px 3px calc(calc(2*2) * 3px)'}],
    {'border-radius': '2px 1px calc(calc(2*2) * 3px) 3px'},
  ],
  [
    [{'background-image': 'url(/foo/bar-rtl.png)'}],
    {'background-image': 'url(/foo/bar-ltr.png)'},
  ],
  [
    [{'background-image': 'linear-gradient(to left top, blue, red)'}],
    {'background-image': 'linear-gradient(to right top, blue, red)'},
  ],
  [
    [{'background-image': 'linear-gradient(to right top, blue, red)'}],
    {'background-image': 'linear-gradient(to left top, blue, red)'},
  ],
  [
    [
      {
        'background-image':
          'linear-gradient(to left, #00ff00 0%, #ff0000 100%)',
      },
    ],
    {'background-image': 'linear-gradient(to right, #00ff00 0%, #ff0000 100%)'},
  ],
  [
    [{'background-image': 'repeating-linear-gradient(to left top, blue, red)'}],
    {'background-image': 'repeating-linear-gradient(to right top, blue, red)'},
  ],
  [
    [
      {
        'background-image':
          'repeating-linear-gradient(to right top, blue, red)',
      },
    ],
    {'background-image': 'repeating-linear-gradient(to left top, blue, red)'},
  ],
  [
    [
      {
        'background-image':
          'repeating-linear-gradient(to left, #00ff00 0%, #ff0000 100%)',
      },
    ],
    {
      'background-image':
        'repeating-linear-gradient(to right, #00ff00 0%, #ff0000 100%)',
    },
  ],
  [[{'background-position': 'left top'}], {'background-position': 'right top'}],
  [
    [{'background-position': 'left -5px'}],
    {'background-position': 'right -5px'},
  ],
  [[{'background-position': '77% 40%'}], {'background-position': '23% 40%'}],
  [[{'background-position': '2.3% 40%'}], {'background-position': '97.7% 40%'}],
  [
    [{'background-position': '2.3210% 40%'}],
    {'background-position': '97.6790% 40%'},
  ],
  [[{'background-position': '0% 100%'}], {'background-position': '100% 100%'}],
  [[{'background-position': '77% -5px'}], {'background-position': '23% -5px'}],
  [
    [{'background-position': '0% 100% !important'}],
    {'background-position': '100% 100% !important'},
  ],
  [[{'background-position': '0% 100%'}], {'background-position': '100% 100%'}],
  [[{'background-position': '0% 100%'}], {'background-position': '100% 100%'}],
  [[{'background-position-x': '77%'}], {'background-position-x': '23%'}],
  [
    [{'background-position-x': '77% !important'}],
    {'background-position-x': '23% !important'},
  ],
  [[{'margin-left': null}], {'margin-right': null}],
  [[{'padding-left': undefined}], {'padding-right': undefined}],
  [[{':active': {'margin-left': null}}], {':active': {'margin-right': null}}],
  [
    [{':active': {'padding-left': undefined}}],
    {':active': {'padding-right': undefined}},
  ],
  [
    [{'-webkit-transform': 'translateX(30px)'}],
    {'-webkit-transform': 'translateX(-30px)'},
  ],
  [
    [{'-moz-transform': 'translateX(30px)'}],
    {'-moz-transform': 'translateX(-30px)'},
  ],
  [
    [{'transition-property': 'margin-right'}],
    {'transition-property': 'margin-left'},
  ],
  [
    [{'transition-property': 'padding-right, right'}],
    {'transition-property': 'padding-left, left'},
  ],
]

// Same as unchanged, except for kebab-casing
const unchangedKebab = [
  [{'text-align': 'center'}],
  [{'x-unknown': 'a b c d'}],
  [{'x-unknown': '1px 2px 3px 4px'}],
  [{'x-unknown': '1px 2px 3px 4px 5px'}],
  [{'text-shadow': 'red 0 2px'}],
  [{'box-shadow': 'none'}],
  [{'border-radius': 1}],
  [{'border-radius': '10px / 20px'}],
  [{'border-radius': '0 !important'}],
  [{'border-radius': '1px 2px 3px 4px 5px'}],
  [{'background-position': '0 5px'}],
  [{'background-position': '10px 20px'}],
  [{'background-position': '10px 40%'}],
  [{'background-position': '10px 2.3%'}],
  [{'background-position-x': '10px'}],
  [{'background-position-x': 10}],
  [{'background-position-y': '40%'}],
  [{'background-image': 'linear-gradient(#eb01a5, #d13531)'}],
  [{'background-image': 'linear-gradient(45deg, blue, red)'}],
  [{'background-image': 'repeating-linear-gradient(#eb01a5, #d13531)'}],
  [{'background-image': 'repeating-linear-gradient(45deg, blue, red)'}],
  [{'xx-left': 10}],
  [{'xx-right': 10}],
  [{'background-image': 'mozLinearGradient(#326cc1, #234e8c)'}],
  [
    {
      'background-image':
        'webkitGradient(linear, 100% 0%, 0% 0%, from(#666666), to(#ffffff))',
    },
  ],
  [
    {
      'border-color':
        'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5) /* @noflip */',
    },
  ],
  [{padding: undefined, 'line-height': 0.2}],
  [{'transition-property': 'display'}],
]

const tests = {}

kebabTests.forEach(kebabTest => {
  const [input, output, modifier] = kebabTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(
    output,
  )} (kebab-case)`
  tests[title] = {input, output, modifier}
})

unchangedKebab.forEach(kebabTest => {
  const input = kebabTest
  const [output] = input
  const title = `does not change ${JSON.stringify(output)} (kebab-case)`
  tests[title] = {input, output}
})

const hasBalrog = Object.keys(tests).some(
  title => tests[title].modifier === 'balrog',
)

Object.keys(tests)
  .filter(title => !hasBalrog || tests[title].modifier === 'balrog')
  .forEach(title => {
    const testObj = tests[title]
    const {modifier, input, output} = testObj
    if (modifier && modifier !== 'balrog') {
      test[modifier](title, testFn)
    } else {
      // eslint-disable-next-line jest/valid-title
      test(title, testFn)
    }

    function testFn() {
      expect(convert(...input)).toEqual(output)
    }
  })

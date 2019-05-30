/**
 * This tests a ton of cases for rtl-css-js
 * Because there are so many test cases, there's a bit of an abstraction to make authoring/adding/maintaining tests a
 * little more ergonomic.
 *
 * The main idea is the `tests` object. The other arrays ultimately get added to the tests object.
 *
 * One special thing about all this is the `balrog` modifier. If you add that modifier that basically tells the
 * abstraction to not even register the other tests with Jest. This makes it easier to focus on one or two tests.
 *
 * And we have a coverage threshold which should (hopefully) prevent you from accidentally adding a modifier that's
 * incorrect.
 */

import convert from '../'

// use this object for bigger tests
// the key is the test title
// the objects each have an input (array that's spread on a call to convert) and an output which is the resulting object
// if you want to run `.only` or `.skip` for one of the tests
// specify `modifier: 'only'` or `modifier: 'skip'` 👍
// Oh, and don't forget the `balrog` modifier you can add as mentioned above
const tests = {
  'handles nested objects because many CSS in JS solutions allow for this': {
    input: [{footer: {':hover': {paddingLeft: 23}}}],
    output: {footer: {':hover': {paddingRight: 23}}},
  },
}

// we'll probably have a lot of these :)
// the first item in each array is the input (an array which is spread on a call to convert)
// the second item is the resulting object from the convert call
// the title will JSON.stringify these
// you can specify a modifier as a third item in the array
const shortTests = [
  [[{paddingLeft: 23}], {paddingRight: 23}],
  [[{paddingRight: 23}], {paddingLeft: 23}],
  [[{direction: 'ltr'}], {direction: 'rtl'}],
  [[{direction: 'rtl'}], {direction: 'ltr'}],
  [[{left: 10}], {right: 10}],
  [[{left: '10px !important'}], {right: '10px !important'}],
  [[{right: '-1.5em'}], {left: '-1.5em'}],
  [[{left: '-.75em'}], {right: '-.75em'}],
  [[{padding: '1px 2px 3px -4px'}], {padding: '1px -4px 3px 2px'}],
  [[{padding: '.25em 0ex 0pt 15px'}], {padding: '.25em 15px 0pt 0ex'}],
  [[{padding: '1px 2% 3px 4.1grad'}], {padding: '1px 4.1grad 3px 2%'}],
  [[{padding: '1px auto 3px 2px'}], {padding: '1px 2px 3px auto'}],
  [
    [{padding: '1.1px 2.2px 3.3px 4.4px'}],
    {padding: '1.1px 4.4px 3.3px 2.2px'},
  ],
  [[{padding: '1px auto 3px inherit'}], {padding: '1px inherit 3px auto'}],
  [
    [{padding: '1px 2px 3px 4px !important'}],
    {padding: '1px 4px 3px 2px !important'},
  ],
  [
    [{padding: '1px 2px 3px 4px !important'}],
    {padding: '1px 4px 3px 2px !important'},
  ],
  [[{padding: '1px 2px 3px 4px'}], {padding: '1px 4px 3px 2px'}],
  [[{padding: '1px  2px   3px    4px'}], {padding: '1px 4px 3px 2px'}],
  [[{padding: '1px 2px 3px 4px'}], {padding: '1px 4px 3px 2px'}],
  [
    [{padding: '1px 2px 3px 4px !important', color: 'red'}],
    {padding: '1px 4px 3px 2px !important', color: 'red'},
  ],
  [[{padding: 10, direction: 'rtl'}], {padding: 10, direction: 'ltr'}],
  [[{margin: '1px 2px 3px 4px'}], {margin: '1px 4px 3px 2px'}],
  [[{float: 'left'}], {float: 'right'}],
  [[{float: 'left !important'}], {float: 'right !important'}],
  [[{clear: 'left'}], {clear: 'right'}],
  [[{paddingLeft: 0}], {paddingRight: 0}],
  [[{marginLeft: 0}], {marginRight: 0}],
  [[{cursor: 'w-resize'}], {cursor: 'e-resize'}],
  [[{cursor: 'sw-resize'}], {cursor: 'se-resize'}],
  [[{cursor: 'nw-resize'}], {cursor: 'ne-resize'}],
  [[{textAlign: 'left'}], {textAlign: 'right'}],
  [[{textShadow: 'red 2px 0'}], {textShadow: 'red -2px 0'}],
  [[{textShadow: 'red -2px 0'}], {textShadow: 'red 2px 0'}],
  [[{textShadow: '2px 0 red'}], {textShadow: '-2px 0 red'}],
  [[{textShadow: '-2px 0 red'}], {textShadow: '2px 0 red'}],
  [
    [{boxShadow: '-6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {boxShadow: '6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [
    [{boxShadow: 'inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {boxShadow: 'inset 6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [[{boxShadow: 'inset .5em 0 0 white'}], {boxShadow: 'inset -.5em 0 0 white'}],
  [
    [{boxShadow: 'inset 0.5em 0 0 white'}],
    {boxShadow: 'inset -0.5em 0 0 white'},
  ],
  [[{boxShadow: '-1px 2px 3px 3px red'}], {boxShadow: '1px 2px 3px 3px red'}],
  [[{boxShadow: '-1px 2px 3px 3px red'}], {boxShadow: '1px 2px 3px 3px red'}],
  [
    [{webkitBoxShadow: '-1px 2px 3px 3px red'}],
    {webkitBoxShadow: '1px 2px 3px 3px red'},
  ],
  [
    [{mozBoxShadow: '-1px 2px 3px 3px red'}],
    {mozBoxShadow: '1px 2px 3px 3px red'},
  ],
  [
    [{WebkitBoxShadow: '-1px 2px 3px 3px red'}],
    {WebkitBoxShadow: '1px 2px 3px 3px red'},
  ],
  [
    [{MozBoxShadow: '-1px 2px 3px 3px red'}],
    {MozBoxShadow: '1px 2px 3px 3px red'},
  ],
  [[{borderLeft: 0}], {borderRight: 0}],
  [[{borderLeft: '1px solid red'}], {borderRight: '1px solid red'}],
  [[{borderLeftColor: 'red'}], {borderRightColor: 'red'}],
  [[{borderLeftStyle: 'red'}], {borderRightStyle: 'red'}],
  [[{borderLeftWidth: '2px'}], {borderRightWidth: '2px'}],
  [
    [{borderColor: 'red green blue white'}],
    {borderColor: 'red white blue green'},
  ],
  [
    [{borderColor: 'red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'}],
    {borderColor: 'red rgba(255, 0, 0, 0.5) rgb(255, 0, 0) #f00'},
  ],
  [
    [{borderColor: 'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)'}],
    {borderColor: 'red hsla(0, 100%, 50%, 0.5) hsl(0, 100%, 50%) #f00'},
  ],
  [[{borderWidth: '1px 2px 3px 4px'}], {borderWidth: '1px 4px 3px 2px'}],
  [
    [{borderStyle: 'none dotted dashed solid'}],
    {borderStyle: 'none solid dashed dotted'},
  ],
  [[{borderTopLeftRadius: 0}], {borderTopRightRadius: 0}],
  [[{borderBottomLeftRadius: 0}], {borderBottomRightRadius: 0}],
  [[{borderRadius: '1px 2px'}], {borderRadius: '2px 1px'}],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [[{borderRadius: '15px / 0 20px'}], {borderRadius: '15px / 20px 0'}],
  [
    [{borderRadius: '1px 2px 3px 4px / 5px 6px 7px 8px'}],
    {borderRadius: '2px 1px 4px 3px / 6px 5px 8px 7px'},
  ],
  [
    [{borderRadius: '1px 2px 3px 4px !important'}],
    {borderRadius: '2px 1px 4px 3px !important'},
  ],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [
    [{borderRadius: '1px 2px 3px calc(calc(2*2) * 3px)'}],
    {borderRadius: '2px 1px calc(calc(2*2) * 3px) 3px'},
  ],
  [
    [{background: 'url(/foo/bar.png) left top'}],
    {background: 'url(/foo/bar.png) right top'},
  ],
  [
    [{background: 'url(/foo/bar.png) no-repeat left top'}],
    {background: 'url(/foo/bar.png) no-repeat right top'},
  ],
  [
    [{background: '#000 url(/foo/bar.png) no-repeat left top'}],
    {background: '#000 url(/foo/bar.png) no-repeat right top'},
  ],
  [
    [{background: 'url(/foo/bar-ltr.png)'}],
    {background: 'url(/foo/bar-rtl.png)'},
  ],
  [
    [{background: 'url(/foo/bar-rtl.png)'}],
    {background: 'url(/foo/bar-ltr.png)'},
  ],
  [
    [{backgroundImage: 'url(/foo/bar-rtl.png)'}],
    {backgroundImage: 'url(/foo/bar-ltr.png)'},
  ],
  [
    [{backgroundImage: 'linear-gradient(to left top, blue, red)'}],
    {backgroundImage: 'linear-gradient(to right top, blue, red)'},
  ],
  [
    [{backgroundImage: 'linear-gradient(to right top, blue, red)'}],
    {backgroundImage: 'linear-gradient(to left top, blue, red)'},
  ],
  [
    [{backgroundImage: 'linear-gradient(to left, #00ff00 0%, #ff0000 100%)'}],
    {backgroundImage: 'linear-gradient(to right, #00ff00 0%, #ff0000 100%)'},
  ],
  [
    [{backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'}],
    {backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'},
  ],
  [
    [{backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'}],
    {backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'},
  ],
  [
    [
      {
        backgroundImage:
          'repeating-linear-gradient(to left, #00ff00 0%, #ff0000 100%)',
      },
    ],
    {
      backgroundImage:
        'repeating-linear-gradient(to right, #00ff00 0%, #ff0000 100%)',
    },
  ],
  [
    [{background: '#000 linear-gradient(to left top, blue, red)'}],
    {background: '#000 linear-gradient(to right top, blue, red)'},
  ],
  [[{backgroundPosition: 'left top'}], {backgroundPosition: 'right top'}],
  [[{backgroundPosition: 'left -5px'}], {backgroundPosition: 'right -5px'}],
  [[{backgroundPosition: '77% 40%'}], {backgroundPosition: '23% 40%'}],
  [[{backgroundPosition: '2.3% 40%'}], {backgroundPosition: '97.7% 40%'}],
  [[{backgroundPosition: '2.3210% 40%'}], {backgroundPosition: '97.6790% 40%'}],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{backgroundPosition: '77% -5px'}], {backgroundPosition: '23% -5px'}],
  [
    [{backgroundPosition: '0% 100% !important'}],
    {backgroundPosition: '100% 100% !important'},
  ],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{backgroundPositionX: '77%'}], {backgroundPositionX: '23%'}],
  [
    [{backgroundPositionX: '77% !important'}],
    {backgroundPositionX: '23% !important'},
  ],
  [
    [{background: 'url(/foo/bar.png) 77% 40%'}],
    {background: 'url(/foo/bar.png) 23% 40%'},
  ],
  [
    [{background: 'url(/foo/bar.png) 77%'}],
    {background: 'url(/foo/bar.png) 23%'},
  ],
  [
    [{background: 'url(/foo/bar.png) no-repeat 77% 40%'}],
    {background: 'url(/foo/bar.png) no-repeat 23% 40%'},
  ],
  [
    [{background: '#000 url(/foo/bar.png) no-repeat 77% 40%'}],
    {background: '#000 url(/foo/bar.png) no-repeat 23% 40%'},
  ],
  [
    [{background: 'url(/foo/bar.png) 77% 40% !important'}],
    {background: 'url(/foo/bar.png) 23% 40% !important'},
  ],
  [[{marginLeft: null}], {marginRight: null}],
  [[{paddingLeft: undefined}], {paddingRight: undefined}],
  [[{':active': {marginLeft: null}}], {':active': {marginRight: null}}],
  [
    [{':active': {paddingLeft: undefined}}],
    {':active': {paddingRight: undefined}},
  ],
  [[{transform: 'translate(30px)'}], {transform: 'translate(-30px)'}],
  [[{transform: 'translate( 30px )'}], {transform: 'translate( -30px )'}],
  [[{transform: 'translate(30%)'}], {transform: 'translate(-30%)'}],
  [[{transform: 'translate(30%, 20%)'}], {transform: 'translate(-30%, 20%)'}],
  [[{transform: 'translateX(-30px)'}], {transform: 'translateX(30px)'}],
  [[{transform: 'translateX( 30px )'}], {transform: 'translateX( -30px )'}],
  [[{transform: 'translateX(30%)'}], {transform: 'translateX(-30%)'}],
  [
    [{transform: 'translateY(30px) scale(2) translateX(10px)'}],
    {transform: 'translateY(30px) scale(2) translateX(-10px)'},
  ],
  [
    [{transform: 'translateX(30px) scale(2) translateY(10px)'}],
    {transform: 'translateX(-30px) scale(2) translateY(10px)'},
  ],
  [
    [{transform: 'translate3d(30%, 20%, 10%)'}],
    {transform: 'translate3d(-30%, 20%, 10%)'},
  ],
  [[{transform: 'rotate(100deg)'}], {transform: 'rotate(-100deg)'}],
  [[{transform: 'rotateZ(100deg)'}], {transform: 'rotateZ(-100deg)'}],
  [[{transform: 'rotateY(100deg)'}], {transform: 'rotateY(-100deg)'}],
  [
    [{transform: 'perspective(500px) translate3d(30%, 20%, 10%)'}],
    {transform: 'perspective(500px) translate3d(-30%, 20%, 10%)'},
  ],
  [
    [{webkitTransform: 'translateX(30px)'}],
    {webkitTransform: 'translateX(-30px)'},
  ],
  [[{mozTransform: 'translateX(30px)'}], {mozTransform: 'translateX(-30px)'}],
  [
    [{WebkitTransform: 'translateX(30px)'}],
    {WebkitTransform: 'translateX(-30px)'},
  ],
  [[{MozTransform: 'translateX(30px)'}], {MozTransform: 'translateX(-30px)'}],
  [[{transformOrigin: '10% 50%'}], {transformOrigin: '90% 50%'}],
  [[{webkitTransformOrigin: '10% 50%'}], {webkitTransformOrigin: '90% 50%'}],
  [[{WebkitTransformOrigin: '10% 50%'}], {WebkitTransformOrigin: '90% 50%'}],
  [[{mozTransformOrigin: '10% 50%'}], {mozTransformOrigin: '90% 50%'}],
  [[{MozTransformOrigin: '10% 50%'}], {MozTransformOrigin: '90% 50%'}],
  [
    [
      {
        animationName: [
          {
            from: {transform: 'rotate(100deg)'},
            to: {transform: 'rotate(-100deg)'},
          },
        ],
      },
    ],
    {
      animationName: [
        {
          from: {transform: 'rotate(-100deg)'},
          to: {transform: 'rotate(100deg)'},
        },
      ],
    },
  ],
  [[{transition: 'margin-right 4s'}], {transition: 'margin-left 4s'}],
  [
    [{transition: 'padding-left 4s ease-in-out'}],
    {transition: 'padding-right 4s ease-in-out'},
  ],
  [[{transition: 'all 0.5s ease-out'}], {transition: 'all 0.5s ease-out'}],
  [
    [{transition: 'transform: 300ms, left 300ms'}],
    {transition: 'transform: 300ms, right 300ms'},
  ],
  [[{transitionProperty: 'margin-right'}], {transitionProperty: 'margin-left'}],
  [
    [{transitionProperty: 'padding-right, right'}],
    {transitionProperty: 'padding-left, left'},
  ],
]

// put short tests that should be skipped here
// you can specify a modifier as a third item in the array
const shortTestsTodo = []

// put tests here where rtl-css-js should not change the input
// unfortunately no way to add a modifier to this 😿
const unchanged = [
  [{}],
  [{textAlign: 'center'}],
  [{opacity: 0}],
  [{xUnknown: 'a b c d'}],
  [{xUnknown: '1px 2px 3px 4px'}],
  [{xUnknown: '1px 2px 3px 4px 5px'}],
  [{xUnknown: {}}],
  [{xUnknown: []}],
  [{padding: 1}],
  [{padding: '1px 2px'}],
  [{padding: '1px 2px 3px'}],
  [{padding: '1px 2px 3px 4px 5px'}],
  [{padding: '1px 2px 3px 4px 5px 6px'}],
  [{textShadow: 'red 0 2px'}],
  [{boxShadow: 'none'}],
  [{borderRadius: 1}],
  [{borderRadius: '10px / 20px'}],
  [{borderRadius: '0 !important'}],
  [{borderRadius: '1px 2px 3px 4px 5px'}],
  [{backgroundPosition: '0 5px'}],
  [{backgroundPosition: '10px 20px'}],
  [{backgroundPosition: '10px 40%'}],
  [{backgroundPosition: '10px 2.3%'}],
  [{backgroundPositionX: '10px'}],
  [{backgroundPositionX: 10}],
  [{backgroundPositionY: '40%'}],
  [{backgroundImage: 'linear-gradient(#eb01a5, #d13531)'}],
  [{backgroundImage: 'linear-gradient(45deg, blue, red)'}],
  [{backgroundImage: 'repeating-linear-gradient(#eb01a5, #d13531)'}],
  [{backgroundImage: 'repeating-linear-gradient(45deg, blue, red)'}],
  [{background: 'url(/foo/bright.png)'}],
  [{background: 'url(/foo/leftovers.png)'}],
  [{background: 'url("http'}],
  [{background: "url('http"}],
  [{background: "url('http"}],
  [{xxLeft: 10}],
  [{xxRight: 10}],
  [{leftxx: 10}],
  [{rightxx: 10}],
  [{backgroundImage: 'mozLinearGradient(#326cc1, #234e8c)'}],
  [{backgroundImage: 'MozLinearGradient(#326cc1, #234e8c)'}],
  [
    {
      backgroundImage:
        'webkitGradient(linear, 100% 0%, 0% 0%, from(#666666), to(#ffffff))',
    },
  ],
  [
    {
      backgroundImage:
        'WebkitGradient(linear, 100% 0%, 0% 0%, from(#666666), to(#ffffff))',
    },
  ],
  [{background: '#000 url(/foo/bar.png) no-repeat 77% 40% /* @noflip */'}],
  [{padding: '1px 2px 3px 4px !important /* @noflip */'}],
  [{float: 'left /* @noflip */'}],
  [
    {
      borderColor:
        'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5) /* @noflip */',
    },
  ],
  [{margin: null}],
  [{padding: undefined, lineHeight: 0.2}],
  [{':active': {border: null, color: 'blue'}}],
  [{':active': {border: undefined, color: 'blue'}}],
  [{transform: 'translateX(0px)'}],
  [{transform: 'translateY(30px)'}],
  [{transform: 'translateZ(30px)'}],
  [{transform: 'rotateX(100deg)'}],
  [{transformOrigin: '10px 100%'}],
  [{transformOrigin: '50% 50%'}],
  [{content: 'left'}],
  [{content: 'right'}],
  [{foo: true}],
  [{foo: false}],
  [{animationName: [{from: {opacity: 0}, to: {opacity: 1}}]}],
  [{transition: 'inherit'}],
  [{transition: 'initial'}],
  [{transition: 'unset'}],
  [{transitionProperty: 'display'}],
]

shortTests.forEach(shortTest => {
  const [input, output, modifier] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(
    output,
  )}`
  tests[title] = {input, output, modifier}
})

shortTestsTodo.forEach(shortTest => {
  const [input, output, modifier = 'skip'] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(
    output,
  )}`
  tests[title] = {input, output, modifier}
})

unchanged.forEach(shortTest => {
  const input = shortTest
  const [output] = input
  const title = `does not change ${JSON.stringify(output)}`
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
      test(title, testFn)
    }

    function testFn() {
      expect(convert(...input)).toEqual(output)
    }
  })

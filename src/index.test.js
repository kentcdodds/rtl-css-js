import convert from './'

// use this object for bigger tests
// the key the test title
// the objects each have an input (array that's spread on a call to convert) and an output which is the resulting object
// if you want to run `.only` or `.skip` for one of the tests
// specify `modifier: 'only'` or `modifier: 'skip'` 👍
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
const shortTests = [
  [[{paddingLeft: 23}], {paddingRight: 23}],
  [[{paddingRight: 23}], {paddingLeft: 23}],
  [[{direction: 'ltr'}], {direction: 'rtl'}],
  [[{direction: 'rtl'}], {direction: 'ltr'}],
  [[{left: 10}], {right: 10}],
  [[{left: '10px !important'}], {right: '10px !important'}],
  [[{left: '-1.5em'}], {right: '-1.5em'}],
  [[{left: '-.75em'}], {right: '-.75em'}],
  [[{padding: '1px 2px 3px -4px'}], {padding: '1px -4px 3px 2px'}],
  [[{padding: '.25em 0ex 0pt 15px'}], {padding: '.25em 15px 0pt 0ex'}],
  [[{padding: '1px 2% 3px 4.1grad'}], {padding: '1px 4.1grad 3px 2%'}],
  [[{padding: '1px auto 3px 2px'}], {padding: '1px 2px 3px auto'}],
  [[{padding: '1.1px 2.2px 3.3px 4.4px'}], {padding: '1.1px 4.4px 3.3px 2.2px'}],
  [[{padding: '1px auto 3px inherit'}], {padding: '1px inherit 3px auto'}],
  [[{padding: '1px 2px 3px 4px !important'}], {padding: '1px 4px 3px 2px !important'}],
  [[{padding: '1px 2px 3px 4px !important'}], {padding: '1px 4px 3px 2px !important'}],
  [[{padding: '1px 2px 3px 4px'}], {padding: '1px 4px 3px 2px'}],
  [[{padding: '1px  2px   3px    4px'}], {padding: '1px 4px 3px 2px'}],
  [[{padding: '1px 2px 3px 4px'}], {padding: '1px 4px 3px 2px'}],
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
  [[{boxShadow: '-6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}], {boxShadow: '6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [[{boxShadow: 'inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}], {boxShadow: 'inset 6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [[{boxShadow: 'inset .5em 0 0 white'}], {boxShadow: 'inset -.5em 0 0 white'}],
  [[{boxShadow: 'inset 0.5em 0 0 white'}], {boxShadow: 'inset -0.5em 0 0 white'}],
  [[{boxShadow: '-1px 2px 3px 3px red'}], {boxShadow: '1px 2px 3px 3px red'}],
  [[{boxShadow: '-1px 2px 3px 3px red'}], {boxShadow: '1px 2px 3px 3px red'}],
  [[{webkitBoxShadow: '-1px 2px 3px 3px red'}], {webkitBoxShadow: '1px 2px 3px 3px red'}],
  [[{mozBoxShadow: '-1px 2px 3px 3px red'}], {mozBoxShadow: '1px 2px 3px 3px red'}],
]

// put short tests that should be skipped here
const shortTestsTodo = [
  [[{borderLeft: 0}], {borderRight: 0}],
  [[{borderLeft: '1px solid red'}], {borderRight: '1px solid red'}],
  [[{borderLeftColor: 'red'}], {borderRightColor: 'red'}],
  [[{borderLeftStyle: 'red'}], {borderRightStyle: 'red'}],
  [[{borderColor: 'red green blue white'}], {borderColor: 'red white blue green'}],
  [[{borderColor: 'red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'}], {borderColor: 'red rgba(255, 0, 0, 0.5) rgb(255, 0, 0) #f00'}],
  [[{borderColor: 'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)'}], {borderColor: 'red hsla(0, 100%, 50%, 0.5) hsl(0, 100%, 50%) #f00'}],
  [[{borderWidth: '1px 2px 3px 4px'}], {borderWidth: '1px 4px 3px 2px'}],
  [[{borderStyle: 'none dotted dashed solid'}], {borderStyle: 'none solid dashed dotted'}],
  [[{borderRadius: '1px 2px'}], {borderRadius: '2px 1px'}],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [[{borderRadius: '15px / 0 20px'}], {borderRadius: '15px / 20px 0'}],
  [[{borderRadius: '1px 2px 3px 4px / 5px 6px 7px 8px'}], {borderRadius: '2px 1px 4px 3px / 6px 5px 8px 7px'}],
  [[{borderRadius: '1px 2px 3px 4px  !important'}], {borderRadius: '2px 1px 4px 3px  !important'}],
  [[{borderRadius: '1px 2px 3px 4px'}], {borderRadius: '2px 1px 4px 3px'}],
  [[{borderTopLeftRadius: 0}], {borderTopRightRadius: 0}],
  [[{borderBottomLeftRadius: 0}], {borderBottomRightRadius: 0}],
  [[{backgroundPosition: 'left top'}], {backgroundPosition: 'right top'}],
  [[{background: 'url(/foo/bar.png) left top'}], {background: 'url(/foo/bar.png) right top'}],
  [[{background: 'url(/foo/bar.png) no-repeat left top'}], {background: 'url(/foo/bar.png) no-repeat right top'}],
  [[{background: '#000 url(/foo/bar.png) no-repeat left top'}], {background: '#000 url(/foo/bar.png) no-repeat right top'}],
  [[{backgroundPosition: 'left -5px'}], {backgroundPosition: 'right -5px'}],
  [[{backgroundPosition: '77% 40%'}], {backgroundPosition: '23% 40%'}],
  [[{backgroundPosition: '2.3% 40%'}], {backgroundPosition: '97.7% 40%'}],
  [[{backgroundPosition: '2.3210% 40%'}], {backgroundPosition: '97.6790% 40%'}],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{backgroundPosition: '77% -5px'}], {backgroundPosition: '23% -5px'}],
  [[{backgroundPosition: '0% 100% !important'}], {backgroundPosition: '100% 100% !important'}],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{backgroundPosition: '0% 100%'}], {backgroundPosition: '100% 100%'}],
  [[{background: 'url(/foo/bar.png) 77% 40%'}], {background: 'url(/foo/bar.png) 23% 40%'}],
  [[{background: 'url(/foo/bar.png) 77%'}], {background: 'url(/foo/bar.png) 23%'}],
  [[{background: 'url(/foo/bar.png) no-repeat 77% 40%'}], {background: 'url(/foo/bar.png) no-repeat 23% 40%'}],
  [[{background: '#000 url(/foo/bar.png) no-repeat 77% 40%'}], {background: '#000 url(/foo/bar.png) no-repeat 23% 40%'}],
  [[{background: '#000 url(/foo/bar.png) no-repeat 77% 40%'}], {background: '#000 url(/foo/bar.png) no-repeat 23% 40%'}],
  [[{background: 'url(/foo/bar.png) 77% 40% !important'}], {background: 'url(/foo/bar.png) 23% 40% !important'}],
  [[{background: 'url(/foo/bar.png) 77% 40%'}], {background: 'url(/foo/bar.png) 23% 40%'}],
  [[{background: 'url(/foo/bar.png) 77% 40%'}], {background: 'url(/foo/bar.png) 23% 40%'}],
  [[{backgroundPositionX: '77%'}], {backgroundPositionX: '23%'}],
  [[{backgroundPositionX: '77% !important'}], {backgroundPositionX: '23% !important'}],
  [[{backgroundPositionX: '77%'}], {backgroundPositionX: '23%'}],
  [[{backgroundPositionX: '77%'}], {backgroundPositionX: '23%'}],
  [[{background: 'url(/foo/bar-right.png)'}], {background: 'url(/foo/bar-left.png)'}],
  [[{background: 'url(/foo/right-bar.png)'}], {background: 'url(/foo/left-bar.png)'}],
  [[{background: 'url("http'}], {background: 'url("http'}],
  [[{background: "url('http"}], {background: "url('http"}],
  [[{background: "url('http"}], {background: "url('http"}],
  [[{background: 'url(/foo/bar.right.png)'}], {background: 'url(/foo/bar.left.png)'}],
  [[{background: 'url(/foo/bar-ltr.png)'}], {background: 'url(/foo/bar-rtl.png)'}],
  [[{padding: '1px 2px 3px 4px !important', color: 'red'}], {padding: '1px 4px 3px 2px !important', color: 'red'}],
  [[{padding: 10, direction: 'rtl'}], {padding: 10, direction: 'ltr'}],
  [[{background: 'url(/foo/bar-rtl.png)', right: 10}], {background: 'url(/foo/bar-rtl.png)', left: 10}],
  [[{background: 'url(/foo/bar-right.png)', direction: 'ltr'}], {background: 'url(/foo/bar-right.png)', direction: 'rtl'}],
  [[{background: 'url(/foo/bar-ltr.png)', right: 10}], {background: 'url(/foo/bar-rtl.png)', left: 10}],
  [[{background: 'url(/foo/bar-left.png)', direction: 'ltr'}], {background: 'url(/foo/bar-right.png)', direction: 'rtl'}],
  [[{background: 'url(/foo/bar-rtl_right.png)', right: 10, direction: 'ltr'}], {background: 'url(/foo/bar-rtl_right.png)', left: 10, direction: 'rtl'}],
  [[{background: 'url(/foo/bar-ltr_left.png)', right: 10, direction: 'ltr'}], {background: 'url(/foo/bar-rtl_right.png)', left: 10, direction: 'rtl'}],
]

// put tests here where rtl-css-js should not change the input
const unchanged = [
  [{}],
  [{textAlign: 'center'}],
  [{opacity: 0}],
  [{xUnknown: 'a b c d'}],
  [{xUnknown: '1px 2px 3px 4px'}],
  [{xUnknown: '1px 2px 3px 4px 5px'}],
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
  [{backgroundPositionY: '40%'}],
  [{background: 'url(/foo/bar-left.png)'}],
  [{background: 'url(/foo/left-bar.png)'}],
  [{background: 'url("http://www.example.com/img/triangle_ltr.gif")'}],
  [{background: 'url(/foo/bar.left.png)'}],
  [{background: 'url(/foo/bar-rtl.png)'}],
  [{background: 'url(/foo/bright.png)'}],
  [{xxLeft: 10}],
  [{xxRight: 10}],
  [{leftxx: 10}],
  [{rightxx: 10}],
  [{backgroundImage: 'mozLinearGradient(#326cc1, #234e8c)'}],
  [{backgroundImage: 'webkitGradient(linear, 100% 0%, 0% 0%, from(#666666), to(#ffffff))'}],
]

shortTests.forEach(shortTest => {
  const [input, output] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(output)}`
  tests[title] = {input, output}
})

shortTestsTodo.forEach(shortTest => {
  const [input, output] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(output)}`
  tests[title] = {input, output, modifier: 'skip'}
})

unchanged.forEach(shortTest => {
  const input = shortTest
  const [output] = input
  const title = `does not change ${JSON.stringify(output)}`
  tests[title] = {input, output}
})

Object.keys(tests).forEach(title => {
  const testObj = tests[title]
  const {modifier, input, output} = testObj
  if (modifier) {
    test[modifier](title, testFn)
  } else {
    test(title, testFn)
  }
  
  function testFn() {
    expect(convert(...input)).toEqual(output)
  }
})

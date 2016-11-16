import convert from './'

// use this object for bigger tests
// the key the test title
// the objects each have an input (array that's spread on a call to convert) and an output which is the resulting object
// if you want to run `.only` or `.skip` for one of the tests
// specify `modifier: 'only'` or `modifier: 'skip'` 👍
const tests = {}

// we'll probably have a lot of these :)
// the first item in each array is the input (an array which is spread on a call to convert)
// the second item is the resulting object from the convert call
// the title will JSON.stringify these
const shortTests = [
  [[{paddingLeft: 23}], {paddingRight: 23}],
  [[{paddingRight: 23}], {paddingLeft: 23}],
]

// put short tests that should be skipped here
const shortTestsTodo = [
  [[{direction: 'ltr'}], {direction: 'rtl'}],
]

// put tests here where rtl-css-js should not change the input
const unchanged = [
  [{textAlign: 'center'}],
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

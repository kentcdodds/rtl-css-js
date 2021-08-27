import {
  includes,
  isNumber,
  calculateNewBackgroundPosition,
  flipTransformSign,
  handleQuartetValues,
  getValuesAsList,
} from './utils'

// some values require a little fudging, that fudging goes here.
const propertyValueConverters = {
  padding({value}) {
    if (isNumber(value)) {
      return value
    }
    return handleQuartetValues(value)
  },
  textShadow({value}) {
    // intentionally leaving off the `g` flag here because we only want to change the first number (which is the offset-x)
    return value.replace(/(-*)([.|\d]+)/, (match, negative, number) => {
      if (number === '0') {
        return match
      }
      const doubleNegative = negative === '' ? '-' : ''
      return `${doubleNegative}${number}`
    })
  },
  borderColor({value}) {
    return handleQuartetValues(value)
  },
  borderRadius({value}) {
    if (isNumber(value)) {
      return value
    }
    if (includes(value, '/')) {
      const [radius1, radius2] = value.split('/')
      const convertedRadius1 = propertyValueConverters.borderRadius({
        value: radius1.trim(),
      })
      const convertedRadius2 = propertyValueConverters.borderRadius({
        value: radius2.trim(),
      })
      return `${convertedRadius1} / ${convertedRadius2}`
    }
    const splitValues = getValuesAsList(value)
    switch (splitValues.length) {
      case 2: {
        return splitValues.reverse().join(' ')
      }
      case 4: {
        const [topLeft, topRight, bottomRight, bottomLeft] = splitValues
        return [topRight, topLeft, bottomLeft, bottomRight].join(' ')
      }
      default: {
        return value
      }
    }
  },
  background({
    value,
    valuesToConvert,
    isRtl,
    bgImgDirectionRegex,
    bgPosDirectionRegex,
  }) {
    if (isNumber(value)) {
      return value
    }

    // Yeah, this is in need of a refactor 🙃...
    // but this property is a tough cookie 🍪
    // get the backgroundPosition out of the string by removing everything that couldn't be the backgroundPosition value
    const backgroundPositionValue = value
      .replace(
        /(url\(.*?\))|(rgba?\(.*?\))|(hsl\(.*?\))|(#[a-fA-F0-9]+)|((^| )(\D)+( |$))/g,
        '',
      )
      .trim()
    // replace that backgroundPosition value with the converted version
    value = value.replace(
      backgroundPositionValue,
      propertyValueConverters.backgroundPosition({
        value: backgroundPositionValue,
        valuesToConvert,
        isRtl,
        bgPosDirectionRegex,
      }),
    )
    // do the backgroundImage value replacing on the whole value (because why not?)
    return propertyValueConverters.backgroundImage({
      value,
      valuesToConvert,
      bgImgDirectionRegex,
    })
  },
  backgroundImage({value, valuesToConvert, bgImgDirectionRegex}) {
    if (!includes(value, 'url(') && !includes(value, 'linear-gradient(')) {
      return value
    }
    return value.replace(bgImgDirectionRegex, (match, g1, group2) => {
      return match.replace(group2, valuesToConvert[group2])
    })
  },
  backgroundPosition({value, valuesToConvert, isRtl, bgPosDirectionRegex}) {
    return (
      value
        // intentionally only grabbing the first instance of this because that represents `left`
        .replace(isRtl ? /^((-|\d|\.)+%)/ : null, (match, group) =>
          calculateNewBackgroundPosition(group),
        )
        .replace(bgPosDirectionRegex, match => valuesToConvert[match])
    )
  },
  backgroundPositionX({value, valuesToConvert, isRtl, bgPosDirectionRegex}) {
    if (isNumber(value)) {
      return value
    }
    return propertyValueConverters.backgroundPosition({
      value,
      valuesToConvert,
      isRtl,
      bgPosDirectionRegex,
    })
  },
  transition({value, propertiesToConvert}) {
    return value
      .split(/,\s*/g)
      .map(transition => {
        const values = transition.split(' ')

        // Property is always defined first
        values[0] = propertiesToConvert[values[0]] || values[0]

        return values.join(' ')
      })
      .join(', ')
  },
  transitionProperty({value, propertiesToConvert}) {
    return value
      .split(/,\s*/g)
      .map(prop => propertiesToConvert[prop] || prop)
      .join(', ')
  },
  transform({value}) {
    // This was copied and modified from CSSJanus:
    // https://github.com/cssjanus/cssjanus/blob/4a40f001b1ba35567112d8b8e1d9d95eda4234c3/src/cssjanus.js#L152-L153
    const nonAsciiPattern = '[^\\u0020-\\u007e]'
    const unicodePattern = '(?:(?:\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)'
    const numPattern = '(?:[0-9]*\\.[0-9]+|[0-9]+)'
    const unitPattern = '(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)'
    const escapePattern = `(?:${unicodePattern}|\\\\[^\\r\\n\\f0-9a-f])`
    const nmstartPattern = `(?:[_a-z]|${nonAsciiPattern}|${escapePattern})`
    const nmcharPattern = `(?:[_a-z0-9-]|${nonAsciiPattern}|${escapePattern})`
    const identPattern = `-?${nmstartPattern}${nmcharPattern}*`
    const quantPattern = `${numPattern}(?:\\s*${unitPattern}|${identPattern})?`
    const signedQuantPattern = `((?:-?${quantPattern})|(?:inherit|auto))`
    const translateXRegExp = new RegExp(
      `(translateX\\s*\\(\\s*)${signedQuantPattern}(\\s*\\))`,
      'gi',
    )
    const translateRegExp = new RegExp(
      `(translate\\s*\\(\\s*)${signedQuantPattern}((?:\\s*,\\s*${signedQuantPattern}){0,1}\\s*\\))`,
      'gi',
    )
    const translate3dRegExp = new RegExp(
      `(translate3d\\s*\\(\\s*)${signedQuantPattern}((?:\\s*,\\s*${signedQuantPattern}){0,2}\\s*\\))`,
      'gi',
    )
    const rotateRegExp = new RegExp(
      `(rotate[ZY]?\\s*\\(\\s*)${signedQuantPattern}(\\s*\\))`,
      'gi',
    )
    return value
      .replace(translateXRegExp, flipTransformSign)
      .replace(translateRegExp, flipTransformSign)
      .replace(translate3dRegExp, flipTransformSign)
      .replace(rotateRegExp, flipTransformSign)
  },
}

propertyValueConverters.objectPosition =
  propertyValueConverters.backgroundPosition
propertyValueConverters.margin = propertyValueConverters.padding
propertyValueConverters.borderWidth = propertyValueConverters.padding
propertyValueConverters.boxShadow = propertyValueConverters.textShadow
propertyValueConverters.webkitBoxShadow = propertyValueConverters.boxShadow
propertyValueConverters.mozBoxShadow = propertyValueConverters.boxShadow
propertyValueConverters.WebkitBoxShadow = propertyValueConverters.boxShadow
propertyValueConverters.MozBoxShadow = propertyValueConverters.boxShadow
propertyValueConverters.borderStyle = propertyValueConverters.borderColor
propertyValueConverters.webkitTransform = propertyValueConverters.transform
propertyValueConverters.mozTransform = propertyValueConverters.transform
propertyValueConverters.WebkitTransform = propertyValueConverters.transform
propertyValueConverters.MozTransform = propertyValueConverters.transform
propertyValueConverters.transformOrigin =
  propertyValueConverters.backgroundPosition
propertyValueConverters.webkitTransformOrigin =
  propertyValueConverters.transformOrigin
propertyValueConverters.mozTransformOrigin =
  propertyValueConverters.transformOrigin
propertyValueConverters.WebkitTransformOrigin =
  propertyValueConverters.transformOrigin
propertyValueConverters.MozTransformOrigin =
  propertyValueConverters.transformOrigin
propertyValueConverters.webkitTransition = propertyValueConverters.transition
propertyValueConverters.mozTransition = propertyValueConverters.transition
propertyValueConverters.WebkitTransition = propertyValueConverters.transition
propertyValueConverters.MozTransition = propertyValueConverters.transition
propertyValueConverters.webkitTransitionProperty =
  propertyValueConverters.transitionProperty
propertyValueConverters.mozTransitionProperty =
  propertyValueConverters.transitionProperty
propertyValueConverters.WebkitTransitionProperty =
  propertyValueConverters.transitionProperty
propertyValueConverters.MozTransitionProperty =
  propertyValueConverters.transitionProperty

// kebab-case versions

propertyValueConverters['text-shadow'] = propertyValueConverters.textShadow
propertyValueConverters['border-color'] = propertyValueConverters.borderColor
propertyValueConverters['border-radius'] = propertyValueConverters.borderRadius
propertyValueConverters['background-image'] =
  propertyValueConverters.backgroundImage
propertyValueConverters['background-position'] =
  propertyValueConverters.backgroundPosition
propertyValueConverters['background-position-x'] =
  propertyValueConverters.backgroundPositionX
propertyValueConverters['object-position'] =
  propertyValueConverters.objectPosition
propertyValueConverters['border-width'] = propertyValueConverters.padding
propertyValueConverters['box-shadow'] = propertyValueConverters.textShadow
propertyValueConverters['-webkit-box-shadow'] =
  propertyValueConverters.textShadow
propertyValueConverters['-moz-box-shadow'] = propertyValueConverters.textShadow
propertyValueConverters['border-style'] = propertyValueConverters.borderColor
propertyValueConverters['-webkit-transform'] = propertyValueConverters.transform
propertyValueConverters['-moz-transform'] = propertyValueConverters.transform
propertyValueConverters['transform-origin'] =
  propertyValueConverters.transformOrigin
propertyValueConverters['-webkit-transform-origin'] =
  propertyValueConverters.transformOrigin
propertyValueConverters['-moz-transform-origin'] =
  propertyValueConverters.transformOrigin
propertyValueConverters['-webkit-transition'] =
  propertyValueConverters.transition
propertyValueConverters['-moz-transition'] = propertyValueConverters.transition
propertyValueConverters['transition-property'] =
  propertyValueConverters.transitionProperty
propertyValueConverters['-webkit-transition-property'] =
  propertyValueConverters.transitionProperty
propertyValueConverters['-moz-transition-property'] =
  propertyValueConverters.transitionProperty

export default propertyValueConverters

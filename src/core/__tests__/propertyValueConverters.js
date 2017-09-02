/**
 * These are tests for core functionality that isn't used by the canonical
 * implementation and therefore cannot be tested in the main test file.
 */

import {propertyValueConverters} from '../'

describe('Extended core functionality', () => {
  describe('propertyValueConverters', () => {
    it('should not calculate new background position when "isRtl" is "false"', () => {
      const value = '77% 40%'
      const newValue = propertyValueConverters.backgroundPosition({
        value,
        valuesToConvet: {left: 'right', right: 'left'},
        isRtl: false,
        bgPosDirectionRegex: new RegExp('(left)|(right)'),
      })

      expect(value).toEqual(newValue)
    })
  })
})

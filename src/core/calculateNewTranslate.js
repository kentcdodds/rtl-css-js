import flipSign from './flipSign'

export default function calculateNewTranslate(match, prefix, offset, suffix) {
  return prefix + flipSign(offset) + suffix
}

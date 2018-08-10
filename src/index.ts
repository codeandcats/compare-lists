export interface BaseCompareOptions<TLeft, TRight> {
  compare: (left: TLeft, right: TRight) => number
  onMissingFromLeft?: (right: TRight) => void
  onMissingFromRight?: (left: TLeft) => void
  onMatch?: (left: TLeft, right: TRight) => void
}

export interface CompareListsOptions<TLeft, TRight> extends BaseCompareOptions<TLeft, TRight> {
  left: Iterable<TLeft>
  right: Iterable<TRight>
}

export interface CompareListsReport<TLeft, TRight> {
  missingFromLeft: TRight[]
  missingFromRight: TLeft[]
  matches: [TLeft, TRight][]
}

export function compareLists<TLeft, TRight>(
  options: CompareListsOptions<TLeft, TRight>
): void
export function compareLists<TLeft, TRight>(
  options: CompareListsOptions<TLeft, TRight> & { returnReport: true }
): CompareListsReport<TLeft, TRight>

/**
 * Efficiently compares two lists (arrays, strings, Maps, etc - anything that implements the iterable protocol).
 * Both iterables must have their values presorted in ascending order or the function will behave unexpectedly.
 */
export function compareLists<TLeft, TRight>(
  options: CompareListsOptions<TLeft, TRight> & { returnReport?: boolean }
): void | CompareListsReport<TLeft, TRight> {
  const leftIterator = options.left[Symbol.iterator]()
  const rightIterator = options.right[Symbol.iterator]()

  const { compare, returnReport, onMissingFromLeft, onMissingFromRight, onMatch } = options;

  const result = compareIterators({
    left: leftIterator,
    right: rightIterator,
    compare,
    returnReport: returnReport || undefined,
    onMatch,
    onMissingFromLeft,
    onMissingFromRight
  })

  return result
}

export interface CompareIteratorsOptions<TLeft, TRight> extends BaseCompareOptions<TLeft, TRight> {
  left: Iterator<TLeft>
  right: Iterator<TRight>
}

export function compareIterators<TLeft, TRight>(
  options: CompareIteratorsOptions<TLeft, TRight>
): void
export function compareIterators<TLeft, TRight>(
  options: CompareIteratorsOptions<TLeft, TRight> & { returnReport: true }
): CompareListsReport<TLeft, TRight>

/**
 * Efficiently compares two lists (arrays, strings, Maps, etc - anything that implements the iterable protocol).
 * Both iterables must have their values presorted in ascending order or the function will behave unexpectedly.
 */
export function compareIterators<TLeft, TRight>(
  options: CompareIteratorsOptions<TLeft, TRight> & { returnReport?: boolean }
): void | CompareListsReport<TLeft, TRight> {
  const leftIterator = options.left
  const rightIterator = options.right
  const { compare, onMissingFromLeft, onMissingFromRight, onMatch, returnReport } = options;

  const result = (
    returnReport ?
    {
      missingFromLeft: [],
      missingFromRight: [],
      matches: []
    } as CompareListsReport<TLeft, TRight> :
    undefined
  )

  let left: { done: boolean, value: TLeft }
  let right: { done: boolean, value: TRight }

  const nextLeft = () => left = leftIterator.next()
  const nextRight = () => right = rightIterator.next()

  const handleMissingFromLeft = () => {
    if (returnReport) {
      result.missingFromLeft.push(right.value)
    }
    if (onMissingFromLeft) {
      onMissingFromLeft(right.value)
    }
    nextRight()
  }

  const handleMissingFromRight = () => {
    if (returnReport) {
      result.missingFromRight.push(left.value)
    }
    if (onMissingFromRight) {
      onMissingFromRight(left.value)
    }
    nextLeft()
  }

  const handleMatch = () => {
    if (returnReport) {
      result.matches.push([left.value, right.value])
    }
    if (onMatch) {
      onMatch(left.value, right.value)
    }
    nextLeft()
    nextRight()
  }

  nextLeft()
  nextRight()

  while (!left.done || !right.done) {
    const result =
      left.done ? 1 :
      right.done ? -1 :
      compare(left.value, right.value);

    if (result < 0) {
      handleMissingFromRight()
    } else if (result > 0) {
      handleMissingFromLeft()
    } else {
      handleMatch()
    }
  }

  return result
}

export interface BaseCompareOptions<TLeft, TRight> {
  compare: (left: TLeft, right: TRight) => number
  onMissingInLeft?: (right: TRight) => void
  onMissingInRight?: (left: TLeft) => void
  onMatch?: (left: TLeft, right: TRight) => void
}

export interface CompareListsOptions<TLeft, TRight> extends BaseCompareOptions<TLeft, TRight> {
  left: Iterable<TLeft>
  right: Iterable<TRight>
}

export interface CompareListsReport<TLeft, TRight> {
  missingInLeft: TRight[]
  missingInRight: TLeft[]
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

  const { compare, returnReport, onMissingInLeft, onMissingInRight, onMatch } = options;

  const result = compareIterators({
    left: leftIterator,
    right: rightIterator,
    compare,
    returnReport: returnReport || undefined,
    onMatch,
    onMissingInLeft,
    onMissingInRight
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
  const { compare, onMissingInLeft, onMissingInRight, onMatch, returnReport } = options;

  const result = (
    returnReport ?
    {
      missingInLeft: [],
      missingInRight: [],
      matches: []
    } as CompareListsReport<TLeft, TRight> :
    undefined
  )

  let left: { done: boolean, value: TLeft }
  let right: { done: boolean, value: TRight }

  const nextLeft = () => left = leftIterator.next()
  const nextRight = () => right = rightIterator.next()

  const handleMissingInLeft = () => {
    if (returnReport) {
      result.missingInLeft.push(right.value)
    }
    if (onMissingInLeft) {
      onMissingInLeft(right.value)
    }
    nextRight()
  }

  const handleMissingInRight = () => {
    if (returnReport) {
      result.missingInRight.push(left.value)
    }
    if (onMissingInRight) {
      onMissingInRight(left.value)
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
      handleMissingInRight()
    } else if (result > 0) {
      handleMissingInLeft()
    } else {
      handleMatch()
    }
  }

  return result
}

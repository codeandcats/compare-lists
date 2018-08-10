import { compareLists } from './index';

describe('index', () => {
  describe('compareLists', () => {
    it('should return a report object when returnReport is true', () => {
      const left = ['a', 'b', 'c']
      const right = ['a', 'c', 'd']

      const report = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right),
        returnReport: true
      })

      expect(report).toBeDefined()
      expect(report).toHaveProperty('missingFromLeft', ['d'])
      expect(report).toHaveProperty('missingFromRight', ['b'])
      expect(report).toHaveProperty('matches', [
        ['a', 'a'],
        ['c', 'c']
      ])
    })

    it('should compare string arrays', () => {
      const left = ['a', 'b', 'c']
      const right = ['a', 'c', 'd']

      const onMatch = jest.fn()
      const onMissingFromLeft = jest.fn()
      const onMissingFromRight = jest.fn()

      const result = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right),
        onMatch,
        onMissingFromLeft,
        onMissingFromRight
      })

      expect(result).toBeUndefined()

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('a', 'a')
      expect(onMatch).toHaveBeenCalledWith('c', 'c')

      expect(onMissingFromLeft).toHaveBeenCalledTimes(1)
      expect(onMissingFromLeft).toHaveBeenCalledWith('d')

      expect(onMissingFromRight).toHaveBeenCalledTimes(1)
      expect(onMissingFromRight).toHaveBeenCalledWith('b')
    })

    it('should compare strings', () => {
      const left = 'abc'
      const right = 'acd'

      const onMatch = jest.fn()
      const onMissingFromLeft = jest.fn()
      const onMissingFromRight = jest.fn()

      const result = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right),
        onMatch,
        onMissingFromLeft,
        onMissingFromRight
      })

      expect(result).toBeUndefined()

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('a', 'a')
      expect(onMatch).toHaveBeenCalledWith('c', 'c')

      expect(onMissingFromLeft).toHaveBeenCalledTimes(1)
      expect(onMissingFromLeft).toHaveBeenCalledWith('d')

      expect(onMissingFromRight).toHaveBeenCalledTimes(1)
      expect(onMissingFromRight).toHaveBeenCalledWith('b')
    })

    it('should compare arrays of different types', () => {
      const left = ['1', '3', '4']
      const right = [1, 2, 3]

      const onMatch = jest.fn()
      const onMissingFromLeft = jest.fn()
      const onMissingFromRight = jest.fn()

      const report = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right.toString()),
        returnReport: true,
        onMatch,
        onMissingFromLeft,
        onMissingFromRight
      })

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('1', 1)
      expect(onMatch).toHaveBeenCalledWith('3', 3)

      expect(onMissingFromLeft).toHaveBeenCalledTimes(1)
      expect(onMissingFromLeft).toHaveBeenCalledWith(2)

      expect(onMissingFromRight).toHaveBeenCalledTimes(1)
      expect(onMissingFromRight).toHaveBeenCalledWith('4')

      expect(report).toBeDefined()
      expect(report).toHaveProperty('missingFromLeft', [2])
      expect(report).toHaveProperty('missingFromRight', ['4'])
      expect(report).toHaveProperty('matches', [
        ['1', 1],
        ['3', 3]
      ])
    })
  })
})

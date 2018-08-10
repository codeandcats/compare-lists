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
      expect(report).toHaveProperty('missingInLeft', ['d'])
      expect(report).toHaveProperty('missingInRight', ['b'])
      expect(report).toHaveProperty('matches', [
        ['a', 'a'],
        ['c', 'c']
      ])
    })

    it('should compare string arrays', () => {
      const left = ['a', 'b', 'c']
      const right = ['a', 'c', 'd']

      const onMatch = jest.fn()
      const onMissingInLeft = jest.fn()
      const onMissingInRight = jest.fn()

      const result = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right),
        onMatch,
        onMissingInLeft,
        onMissingInRight
      })

      expect(result).toBeUndefined()

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('a', 'a')
      expect(onMatch).toHaveBeenCalledWith('c', 'c')

      expect(onMissingInLeft).toHaveBeenCalledTimes(1)
      expect(onMissingInLeft).toHaveBeenCalledWith('d')

      expect(onMissingInRight).toHaveBeenCalledTimes(1)
      expect(onMissingInRight).toHaveBeenCalledWith('b')
    })

    it('should compare strings', () => {
      const left = 'abc'
      const right = 'acd'

      const onMatch = jest.fn()
      const onMissingInLeft = jest.fn()
      const onMissingInRight = jest.fn()

      const result = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right),
        onMatch,
        onMissingInLeft,
        onMissingInRight
      })

      expect(result).toBeUndefined()

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('a', 'a')
      expect(onMatch).toHaveBeenCalledWith('c', 'c')

      expect(onMissingInLeft).toHaveBeenCalledTimes(1)
      expect(onMissingInLeft).toHaveBeenCalledWith('d')

      expect(onMissingInRight).toHaveBeenCalledTimes(1)
      expect(onMissingInRight).toHaveBeenCalledWith('b')
    })

    it('should compare arrays of different types', () => {
      const left = ['1', '3', '4']
      const right = [1, 2, 3]

      const onMatch = jest.fn()
      const onMissingInLeft = jest.fn()
      const onMissingInRight = jest.fn()

      const report = compareLists({
        left,
        right,
        compare: (left, right) => left.localeCompare(right.toString()),
        returnReport: true,
        onMatch,
        onMissingInLeft,
        onMissingInRight
      })

      expect(onMatch).toHaveBeenCalledTimes(2)
      expect(onMatch).toHaveBeenCalledWith('1', 1)
      expect(onMatch).toHaveBeenCalledWith('3', 3)

      expect(onMissingInLeft).toHaveBeenCalledTimes(1)
      expect(onMissingInLeft).toHaveBeenCalledWith(2)

      expect(onMissingInRight).toHaveBeenCalledTimes(1)
      expect(onMissingInRight).toHaveBeenCalledWith('4')

      expect(report).toBeDefined()
      expect(report).toHaveProperty('missingInLeft', [2])
      expect(report).toHaveProperty('missingInRight', ['4'])
      expect(report).toHaveProperty('matches', [
        ['1', 1],
        ['3', 3]
      ])
    })
  })
})

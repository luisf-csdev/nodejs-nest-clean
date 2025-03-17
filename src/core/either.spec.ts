import { left, right, type Either } from './either'

const doSomething = (shouldSuccess: boolean): Either<string, number> => {
  if (shouldSuccess) {
    return right(1)
  }

  return left('error')
}

describe('Either handling', () => {
  it('should return right in case of success', () => {
    const result = doSomething(true)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
  })

  test('should return right in case of failure', () => {
    const result = doSomething(false)

    expect(result.isRight()).toBe(false)
    expect(result.isLeft()).toBe(true)
  })
})

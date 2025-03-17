import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

describe('Fetch Answer Comments', () => {
  let answerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityID('answer-1')

    await answerCommentsRepository.create(makeAnswerComment({ answerId }))
    await answerCommentsRepository.create(makeAnswerComment({ answerId }))
    await answerCommentsRepository.create(makeAnswerComment({ answerId }))

    const result = await sut.execute({
      answerId: answerId.toValue(),
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityID('answer-1')

    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(makeAnswerComment({ answerId }))
    }

    const result = await sut.execute({
      answerId: answerId.toValue(),
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

describe('Fetch Question Comments', () => {
  let questionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: FetchQuestionCommentsUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityID('question-1')

    await questionCommentsRepository.create(makeQuestionComment({ questionId }))
    await questionCommentsRepository.create(makeQuestionComment({ questionId }))
    await questionCommentsRepository.create(makeQuestionComment({ questionId }))

    const result = await sut.execute({
      questionId: questionId.toValue(),
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityID('question-1')

    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId }),
      )
    }

    const result = await sut.execute({
      questionId: questionId.toValue(),
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})

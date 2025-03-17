import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

describe('Fetch Question Answers', () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: FetchQuestionAnswersUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityID('question-1')

    await answersRepository.create(makeAnswer({ questionId }))
    await answersRepository.create(makeAnswer({ questionId }))
    await answersRepository.create(makeAnswer({ questionId }))

    const result = await sut.execute({
      questionId: questionId.toValue(),
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityID('question-1')

    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(makeAnswer({ questionId }))
    }

    const result = await sut.execute({
      questionId: questionId.toValue(),
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})

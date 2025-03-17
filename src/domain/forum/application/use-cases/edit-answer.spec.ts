import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { EditAnswerUseCase } from './edit-answer'

describe('Edit Answer', () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit an answer', async () => {
    const authorId = 'author-1'
    const answerId = 'answer-1'
    const answerContent = 'Edited content'

    const answerToEdit = makeAnswer(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToEdit)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answerToEdit.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: answerToEdit.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId,
      authorId,
      content: answerContent,
      attachmentsIds: ['1', '3'],
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: answerContent,
    })

    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit an answer from another user', async () => {
    const answerId = 'answer-1'

    const answerToEdit = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToEdit)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId,
      content: 'Some content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

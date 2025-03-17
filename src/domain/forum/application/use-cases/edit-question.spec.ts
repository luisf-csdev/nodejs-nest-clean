import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { EditQuestionUseCase } from './edit-question'

describe('Edit Question', () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const authorId = 'author-1'
    const questionId = 'question-1'
    const questionTitle = 'Edited title'
    const questionContent = 'Edited content'

    const questionToEdit = makeQuestion(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToEdit)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: questionToEdit.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: questionToEdit.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId,
      authorId,
      title: questionTitle,
      content: questionContent,
      attachmentsIds: ['1', '3'],
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: questionTitle,
      content: questionContent,
    })

    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    )

    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const questionId = 'question-1'

    const questionToEdit = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToEdit)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId,
      title: 'Some title',
      content: 'Some content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

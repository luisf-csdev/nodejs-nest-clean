import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

describe('Comment on Question', () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  let questionsRepository: InMemoryQuestionsRepository
  let questionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: CommentOnQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const questionCommentContent = 'Test comment'

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: questionCommentContent,
    })

    expect(questionCommentsRepository.items[0].content).toEqual(
      questionCommentContent,
    )
  })
})

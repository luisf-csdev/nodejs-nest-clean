import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { MockInstance } from 'vitest'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionsRepository

  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answersRepository: InMemoryAnswersRepository

  let notificationsRepository: InMemoryNotificationsRepository
  let sendNotificationUseCase: SendNotificationUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )

    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    question.bestAnswerId = answer.id

    await questionsRepository.save(question)

    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})

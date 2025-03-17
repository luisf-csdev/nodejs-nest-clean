import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

describe('Authenticate Student', () => {
  let studentsRepository: InMemoryStudentsRepository
  let hasher: FakeHasher
  let encrypter: FakeEncrypter

  let sut: AuthenticateStudentUseCase

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(studentsRepository, hasher, encrypter)
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await hasher.hash('123456'),
    })

    studentsRepository.items.push(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})

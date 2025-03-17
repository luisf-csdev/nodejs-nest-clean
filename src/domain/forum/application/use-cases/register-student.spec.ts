import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

describe('Register Student', () => {
  let studentsRepository: InMemoryStudentsRepository
  let hasher: FakeHasher
  let sut: RegisterStudentUseCase

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    sut = new RegisterStudentUseCase(studentsRepository, hasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: studentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await hasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(studentsRepository.items[0].password).toEqual(hashedPassword)
  })
})

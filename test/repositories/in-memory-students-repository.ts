import { DomainEvents } from '@/core/events/domain-events'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  constructor() {}

  public items: Student[] = []

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    return student ?? null
  }

  async create(student: Student) {
    this.items.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }
}

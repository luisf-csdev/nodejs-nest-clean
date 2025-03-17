import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber registered (listening to event "created aggregate")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Aggregate initially created, but not ready for dispatch
    const aggregate = CustomAggregate.create()

    // Asserts that the event was created but it wasn't dispatched
    expect(aggregate.domainEvents).toHaveLength(1)

    // Actually dispatching event after the all the steps were concluded (in a real scenario this is called after saving in the DB)
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber listens the event and handle it
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})

import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/auth/current-user-decorator.js'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js'
import type { UserPayload } from '@/auth/jwt.strategy.js'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe.js'
import { PrismaService } from '@/prisma/prisma.service.js'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: this.convertToSlug(title),
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}

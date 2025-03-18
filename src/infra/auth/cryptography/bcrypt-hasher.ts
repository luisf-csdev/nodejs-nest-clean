import { Injectable } from '@nestjs/common'
import bcryptjs from 'bcryptjs'
import { HasherComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HasherGenerator, HasherComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return bcryptjs.hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(plain, hash)
  }
}

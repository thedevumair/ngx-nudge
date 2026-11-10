import { Injectable, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UsersRepository } from '../repositories/users.repository';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly repo = inject(UsersRepository);
  readonly users = signal<User[]>(this.repo.list());
}

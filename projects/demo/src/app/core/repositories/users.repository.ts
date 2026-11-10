import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export abstract class UsersRepository {
  abstract list(): User[];
}

@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  private readonly rows: User[] = [
    { name: 'Ayesha Khan', email: 'ayesha@acme.pk', role: 'Admin' },
    { name: 'Bilal Ahmed', email: 'bilal@acme.pk', role: 'User' },
    { name: 'Sana Malik', email: 'sana@acme.pk', role: 'User' },
    { name: 'Usman Raza', email: 'usman@acme.pk', role: 'User' },
  ];

  list(): User[] {
    return [...this.rows];
  }
}

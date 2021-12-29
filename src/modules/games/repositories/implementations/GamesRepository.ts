import { createQueryBuilder, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const qb = this.repository
    .createQueryBuilder('game')
    .where(`LOWER(game.title) like '%${param.toLowerCase()}%'`)

    return qb.getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(*) FROM games;');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const qb = await createQueryBuilder<User>('users', 'user')
      .leftJoinAndSelect('user.games', 'game')
      .loadAllRelationIds()
      .where('game.id = :id', { id })

    return qb.getMany();
  }
}

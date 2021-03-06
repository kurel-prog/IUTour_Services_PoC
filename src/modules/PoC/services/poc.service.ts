import { BadRequestException, Injectable } from '@nestjs/common';
import { PoCEntity } from '../entities/poc.entity';
import { PoCRepository } from '../repositories/poc.repository';

@Injectable()
export class PoCService {
  constructor(private poCRepository: PoCRepository) {}
  async getData(): Promise<PoCEntity[]> {
    return this.poCRepository.find({ select: ['id', 'username', 'status'] });
  }

  async createData(dataEntity: PoCEntity): Promise<PoCEntity> {
    const userExistedQuery = await this.poCRepository.findOne({
      where: { username: dataEntity.username },
    });
    if (!userExistedQuery) {
      return this.poCRepository.save(dataEntity);
    }
    throw new BadRequestException();
  }

  async getDataById(PoCId: number): Promise<PoCEntity> {
    const userExistQuery = await this.poCRepository.findOne({
      where: { id: PoCId },
    });
    if (!userExistQuery) {
      throw new BadRequestException();
    }
    return userExistQuery;
  }

  async updateDataById(
    PoCId: number,
    dataEntity: PoCEntity
  ): Promise<PoCEntity> {
    const userExistedQuery = await this.poCRepository.findOne({
      where: { id: PoCId },
    });
    if (
      !userExistedQuery ||
      (userExistedQuery.username == dataEntity.username &&
        userExistedQuery.status == dataEntity.status)
    ) {
      throw new BadRequestException();
    }
    await this.poCRepository.update({ id: PoCId }, dataEntity);
    return this.poCRepository.findOne({ where: { id: PoCId } });
  }

  async removeDataById(PoCId: number) {
    const userExistedQuery = await this.poCRepository.findOne({
      where: { id: PoCId },
    });
    if (!userExistedQuery) {
      throw new BadRequestException();
    }
    return this.poCRepository.delete(PoCId);
  }
}

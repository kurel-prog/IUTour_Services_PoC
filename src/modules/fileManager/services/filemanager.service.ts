import { Injectable, BadRequestException } from '@nestjs/common';
import { PoCRepository } from '../../PoC/repositories/poc.repository';
import { plainToClass } from 'class-transformer';
import { FileManagerEntity } from '../entities/filemanager.entity';
import { FileManagerRepository } from '../repositories/filemanager.repository';

@Injectable()
export class FileManagerService {
  constructor(
    private fileManagerRepository: FileManagerRepository,
    private poCRepository: PoCRepository
  ) {}
  async getAllImage(user_id: number): Promise<FileManagerEntity[]> {
    const userQuery = await this.poCRepository.findOne({
      where: { id: user_id },
    });
    if (!userQuery) {
      throw new BadRequestException();
    }
    return this.fileManagerRepository.find({ where: { user: userQuery } });
  }

  async upImage(
    file: Express.Multer.File,
    user_id: number
  ): Promise<FileManagerEntity> {
    const userQuery = await this.poCRepository.findOne({
      where: { id: user_id },
    });
    if (!userQuery) {
      throw new BadRequestException();
    }
    const newPhotoEntity = this.fileManagerRepository.create({
      id: file.filename,
    });
    newPhotoEntity.user = userQuery;
    return await this.fileManagerRepository.save(newPhotoEntity);
  }

  async updateImage(
    file: Express.Multer.File,
    image: string,
    user_id: number
  ): Promise<FileManagerEntity> {
    const willBeUpdatedImage = await this.fileManagerRepository.findOne({
      where: { id: image },
      relations: ['user'],
    });
    if (!willBeUpdatedImage || willBeUpdatedImage.user.id !== Number(user_id)) {
      throw new BadRequestException();
    }
    const imageInfor = plainToClass(FileManagerEntity, { id: file.filename });
    await this.fileManagerRepository.update({ id: image }, imageInfor);
    return this.fileManagerRepository.findOne({
      where: { id: file.filename },
      relations: ['user'],
    });
  }

  async removeImage(image: string, user_id: number) {
    const willBeRemovedImage = await this.fileManagerRepository.findOne({
      where: { id: image },
      relations: ['user'],
    });
    if (!willBeRemovedImage || willBeRemovedImage.user.id !== Number(user_id)) {
      throw new BadRequestException();
    }
    return this.fileManagerRepository.delete(image);
  }
}

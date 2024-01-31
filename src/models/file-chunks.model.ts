import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';

import type { CreationOptional, NonAttribute } from '@sequelize/core';

import {
  Table,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Index,
  Attribute,
  BelongsTo,
} from '@sequelize/core/decorators-legacy';
import File from './file.model';

@Table({
  freezeTableName: true,
  tableName: 'fileChunks',
})
export default class FileChunk extends Model<
  InferAttributes<FileChunk>,
  InferCreationAttributes<FileChunk>
> {
  @Attribute(DataTypes.BIGINT)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.TEXT)
  declare telegramId: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare order: number;

  /* FileChunk M <----> 1 File */
  @BelongsTo(() => File, {
    foreignKey: 'fileId',
    foreignKeyConstraints: false,
    targetKey: 'id',
  })
  declare file?: NonAttribute<File>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare fileId: number;
}

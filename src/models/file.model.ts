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
  HasMany,
} from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import FileChunk from './file-chunks.model';

@Table({
  freezeTableName: true,
  tableName: 'files',
})
export default class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
  @Attribute(DataTypes.BIGINT)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare type: string;

  @Attribute(DataTypes.BIGINT)
  declare parentId?: number;

  /* File M <----> 1 User */
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    foreignKeyConstraints: false,
    targetKey: 'id',
  })
  declare user?: NonAttribute<User>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number;

  /* File 1 <----> M FileChunk */
  @HasMany(() => FileChunk, { foreignKey: 'fileId', sourceKey: 'id' })
  declare fileChunks?: NonAttribute<File[]>;
}

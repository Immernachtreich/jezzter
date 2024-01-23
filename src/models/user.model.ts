import { DataTypes, Model, InferAttributes, InferCreationAttributes } from '@sequelize/core';

import type { CreationOptional, NonAttribute } from '@sequelize/core';

import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  Index,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import File from './file.model';

@Table({
  freezeTableName: true,
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password'] } },
  scopes: { passwordIncluded: { attributes: { include: ['password'] } } },
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Index({ unique: true })
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  /* User 1 <----> M File */
  @HasMany(() => File, { foreignKey: 'userId', sourceKey: 'id' })
  declare files?: NonAttribute<File[]>;
}

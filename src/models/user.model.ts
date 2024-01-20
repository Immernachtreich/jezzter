import { DataTypes, Model, InferAttributes, InferCreationAttributes } from '@sequelize/core';

import type { CreationOptional } from '@sequelize/core';

import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  Index,
} from '@sequelize/core/decorators-legacy';

@Table({ freezeTableName: true, tableName: 'users' })
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
}

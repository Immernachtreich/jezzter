import { sequelize } from '@/lib/sequelize';
import { User } from './user.model';
import File from './file.model';
import FileChunk from './file-chunks.model';

export { User, File, FileChunk, sequelize };

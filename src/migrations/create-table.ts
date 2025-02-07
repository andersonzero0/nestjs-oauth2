import { MikroORM } from '@mikro-orm/core';
import { UserEntity } from '../modules/users/entity/users.entity';
import { PostEntity } from '../modules/posts/entity/posts.entity';
import { SqliteDriver } from '@mikro-orm/sqlite';

(async () => {
  const orm = await MikroORM.init({
    entities: [UserEntity, PostEntity],
    dbName: 'db.sqlite3',
    driver: SqliteDriver,
  });
  const generator = orm.schema;

  const dropDump = await generator.getDropSchemaSQL();
  console.log(dropDump);

  const createDump = await generator.getCreateSchemaSQL();
  console.log(createDump);

  const updateDump = await generator.getUpdateSchemaSQL();
  console.log(updateDump);

  // You can run those queries directly
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  // In tests it can be handy to use those:
  await generator.refreshDatabase(); // Ensure db exists and is fresh
  await generator.clearDatabase(); // Removes all data

  await orm.close(true);
})();

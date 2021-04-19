import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'queries_challenge_6'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database: process.env.NODE_ENV === 'test'
        ? 'queries_challenge_6'
        : defaultOptions.database,
    }),
  );
};
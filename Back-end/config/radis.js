import { createClient } from "redis";

export const useRedis = () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on("error", (err) => console.error("Redis Error:", err));
  client.on('connect', () => console.log('Redis client connected'));

  const start = async () => {
    await client.connect();
  }

  return {start, Redis: client};
}

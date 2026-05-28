import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const messages = await redis.lrange("wedding_messages", 0, -1);
      return res.status(200).json(messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, message, attendance } = req.body;
      if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required" });
      }

      const newMessage = {
        name,
        message,
        attendance: attendance || 'Tidak Hadir',
        timestamp: new Date().toISOString()
      };

      await redis.lpush("wedding_messages", newMessage);
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      return res.status(500).json({ error: "Failed to save message" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

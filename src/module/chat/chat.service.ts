import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { ChatRepository } from "../../DB";

class ChatService {
  private readonly chatRepository = new ChatRepository();
  getChat = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userLoginId = req.user._id;
    const chat = await this.chatRepository.getOne(
      { users: { $all: [userLoginId, userId] } },
      {},
      {
        populate: [
          { path: "users", select: "fullName firstName lastName" },
          {
            path: "messages",
            populate: { path: "sender", select: "fullName firstName lastName" },
            select: "content sender",
          },
        ],
      }
    );
    return res.status(200).json({
      message: "done",
      success: true,
      data: { chat },
    });
  };
}

export default new ChatService();

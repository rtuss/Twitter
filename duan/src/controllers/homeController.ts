import { Request, Response } from 'express';

export const getHomeData = (req: Request, res: Response) => {
  const data = {
    message: 'Chào mừng đến với trang chủ!',
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(data);
};
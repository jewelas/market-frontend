import Bidder from 'models/Bidder';
import connectMongo from 'utils/mongodb';

export default async (req: any, res: any) => {
  await connectMongo();

  const {media_id, bidder, price} = req.body;
  console.log(req.body);
  try {
    const bidderInstance = new Bidder({
      media_id,
      bidder,
      price,
    });
    const result = await bidderInstance.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }

  res.end();
};

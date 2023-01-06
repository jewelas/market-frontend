import Bidder from 'models/Bidder';
import Media from 'models/Media';
import {NextApiRequest, NextApiResponse} from 'next';
import connectMongo from 'utils/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectMongo();
  const {
    query: {id},
  } = req;

  try {
    if (id) {
      const media = await Media.findOne({_id: id}).populate('media');
      const bids = await Bidder.find({media_id: media.media_id});
      if (!media) {
        return res.status(400).json({success: false});
      }
      return res.status(200).json({success: true, data: {media, bids}});
    }
    return res.status(400).json({success: false});
  } catch (error) {
    return res.status(400).json({success: false});
  }
};

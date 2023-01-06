import Media from 'models/Media';
import connectMongo from 'utils/mongodb';

export default async (req: any, res: any) => {
  await connectMongo();

  const {
    query: {id},
  } = req;

  try {
    if (id) {
      const media = await Media.findById(id).populate('users');
      if (!media) {
        res.status(400).json({success: false});
      }
      res.status(200).json({success: true, data: media});
    } else {
      const media = await Media.find().populate('users');
      res.status(200).json({success: true, data: media});
    }
  } catch (error) {
    res.status(400).json({success: false});
  }
  res.end();
};

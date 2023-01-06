import {NextApiRequest, NextApiResponse} from 'next';
// import User from 'models/User';
import connectMongo from 'utils/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectMongo();
  const {
    query: {id},
  } = req;

  console.log(id);
  res.status(200).json({message: 'Hello World'});
  // try {
  //   // if (id) {
  //   //   const user = await User.findOne({address: id}).populate('media');
  //   //   console.log('User ', user);
  //   //   if (!user) {
  //   //     res.status(400).json({success: false});
  //   //   }
  //   //   res.status(200).json({success: true, data: user});
  //   // }
  //   // res.status(400).json({success: false});
  // } catch (error) {
  //   res.status(400).json({success: false});
  // }
  res.end();
};

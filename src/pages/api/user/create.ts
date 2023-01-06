import User from 'models/User';
import connectMongo from 'utils/mongodb';

export default async (req: any, res: any) => {
  await connectMongo();

  const {
    address,
    name,
    username,
    bio,
    website,
    image_url,
    is_verified,
  } = req.body;

  try {
    const user = new User({
      address,
      name,
      username,
      bio,
      website,
      image_url,
      is_verified,
    });
    const result = await user.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
  res.end();
};

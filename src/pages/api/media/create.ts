import Media from 'models/Media';
// import User from 'models/User';
import connectMongo from 'utils/mongodb';

export default async (req: any, res: any) => {
  await connectMongo();

  const {
    title,
    description,
    media_url,
    metadata_url,
    mimeType,
    contentHash,
    metadataHash,
    tokenId,
    creator,
  } = req.body;
  try {
    const media = new Media({
      metadata: {
        title,
        description,
        mime_type: mimeType,
      },
      media_id: tokenId,
      media_url,
      metadata_url,
      content_hash: contentHash,
      metadata_hash: metadataHash,
      creator_address: creator,
    });
    const result = await media.save();
    // const owner: any = await User.findById({_id: creatorId});
    // owner.owned_media.push(media);
    // await owner.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }

  res.end();
};

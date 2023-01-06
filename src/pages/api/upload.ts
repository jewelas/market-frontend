import fs from 'fs';
import {promisify} from 'util';
import {v4 as uuid} from 'uuid';
import formidable from 'formidable';
import fleekStorage from '@fleekhq/fleek-storage-js';

const fleekAuth = {
  apiKey: process.env.FLEEK_API_KEY!,
  apiSecret: process.env.FLEEK_API_SECRET!,
};

const readFileAsync = promisify(fs.readFile);

export default async (req: any, res: any) => {
  const form = new formidable.IncomingForm({keepExtensions: true});

  const data: any = await new Promise((res, rej) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) return rej(err);
      res({fields, files});
    });
  });

  const {name, metadata} = data.fields;

  const {upload: file} = data.files;
  const fileData = await readFileAsync(file.path);

  if (fileData && name && metadata) {
    const {hashV0: fileUrl} = await fleekStorage.upload({
      ...fleekAuth,
      key: uuid(),
      data: fileData,
    });

    const {hashV0: metadataUrl} = await fleekStorage.upload({
      ...fleekAuth,
      key: uuid(),
      data: metadata,
    });

    res.send({
      fileUrl: `https://ipfs.io/ipfs/${fileUrl}`,
      metadataUrl: `https://ipfs.io/ipfs/${metadataUrl}`,
    });
  } else {
    res.status(501);
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

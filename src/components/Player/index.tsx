import {FC} from 'react';

type PlayerProps = {
  mimetype?: string;
  url?: string;
};

export const PlayerComponent: FC<PlayerProps> = ({mimetype, url}) => {
  return (
    <div>
      {mimetype?.startsWith('image') ? (
        <img width={300} className="object-cover h-64" src={url} />
      ) : mimetype?.startsWith('audio') ? (
        <audio className="object-cover h-64" controls>
          <source src={url} type={mimetype} />
        </audio>
      ) : mimetype?.startsWith('video') ? (
        <video className="w-full" autoPlay playsInline loop>
          <source src={url} type={mimetype} />
        </video>
      ) : mimetype === '' ? (
        <div
          style={{
            width: 300,
          }}
          className="flex justify-center items-center h-64">
          <div className="px-3 py-12">No media selected.</div>
        </div>
      ) : (
        <div
          style={{
            width: 300,
          }}
          className="flex justify-center items-center h-64">
          <div className="px-3 py-12">
            Unsupported file type ({mimetype}). <br />
            <a href={mimetype} target="_blank" rel="noopener noreferrer">
              Direct link
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

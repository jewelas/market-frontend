
type TableProps = {
  title?: string;
  data?: any[];
  acceptBid: (id: string) => void;
  isOwner: string;
};

export const Table: React.FC<TableProps> = ({
  title,
  data,
  acceptBid,
  isOwner,
}) => {
  return (
    <div className="my-4 w-full">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="text-md font-bold pb-2">{title}</div>
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Address
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    {isOwner && (
                      <th
                        scope="col"
                        className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr className={'bg-white'} key={index}>
                      <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.bidder}
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price} KET
                      </td>
                      {isOwner && (
                        <td>
                          <button
                            type="button"
                            onClick={() => acceptBid(item)}
                            className="px-6 outline-none font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                            Accept
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

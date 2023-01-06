export const Textarea = () => {
  return (
    <div>
      <label
        htmlFor="about"
        className="block text-sm font-medium text-gray-700">
        About artwork
      </label>
      <div className="mt-1">
        <textarea
          id="about"
          name="about"
          rows={3}
          className="shadow-sm h-40 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-indigo-300 rounded-md"
          style={{resize: 'none'}}
          defaultValue={''}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Write a few sentences about the artwork you want to create.
      </p>
    </div>
  );
};

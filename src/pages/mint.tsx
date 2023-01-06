import React, {useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Layout} from 'components/Layout';
import Dropzone from 'react-dropzone';
import {ExclamationCircleIcon} from '@heroicons/react/outline';
import {GetStaticProps} from 'next';
import {useMedia} from 'contexts/Media.context';
import {Media} from 'components/Media';
import {useWeb3React} from '@web3-react/core';
import { useToasts } from 'react-toast-notifications';

const validationSchema = Yup.object().shape({
  media: Yup.mixed().required(),
  token_name: Yup.string().required(),
  token_description: Yup.string().required(),
});

const share = 1;

const Mint = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
    watch,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });
  const {account} = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const { addToast } = useToasts();

  const [, createMedia] = useMedia();

  const watchTokenName: string[] = watch(['token_name']);
  const watchTokenDescription: string[] = watch(['token_description']);

  const onSubmit = async ({token_name, token_description, media}: any) => {
    setLoading(true);
    try {
      await createMedia(media, token_name, token_description, share, account);
      addToast('Successfully created an artwork', { appearance: 'success' });
    } catch (e) {
      addToast(e.message || 'An error occured', { appearance: 'error' });
    }
    setLoading(false);
  };

  const dropHandler = useCallback(
    async (acceptedFiles: any[]) => {
      const [File] = acceptedFiles;
      const fileName = File.name;
      setValue('media', File);
      setFile(File);
      setValue('token_name', fileName);
    },
    [setValue],
  );

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType={'multipart/form-data'}
        className="container mx-auto justify-items-center grid grid-cols-1 lg:grid-cols-2 mt-1 pt-5 py-4 lg:pt-24">
        <div className="flex flex-col justify-center items-center max-w-3xl sm:px-6">
          <section aria-labelledby="media-information" className="w-full">
            <div className="pb-10">
              <div className="px-4 py-2 sm:px-6">
                <div className="mt-1 cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <Dropzone
                        maxFiles={1}
                        accept={[
                          'image/png',
                          'image/jpeg',
                          'image/gif',
                          'video/mp4',
                          'video/quicktime',
                          'audio/mpeg',
                          'audio/wav',
                          'audio/mp3',
                        ]}
                        onDrop={acceptedFiles => dropHandler(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                          <section>
                            <div {...getRootProps()}>
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload a file </span>{' '}
                              </label>
                              <input {...getInputProps()} />
                              <span>{' You can drag and drop file here.'}</span>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 3MB
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                </div>
                {errors.media && (
                  <p className="text-xs text-red-600" id="media-error">
                    {errors.media.message}
                  </p>
                )}
              </div>
              <div className="px-4 py-2 sm:px-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="token_name"
                    {...register('token_name')}
                    className="shadow-sm px-3 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-indigo-300 rounded-md"
                    placeholder="Title of Artwork(s)"
                  />{' '}
                  {errors.token_name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.token_name && (
                  <p className="text-xs text-red-600" id="email-error">
                    {errors.token_name.message}
                  </p>
                )}
              </div>
              <div className="px-4 py-2 sm:px-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700">
                  About artwork
                </label>
                <div className="mt-1 relative">
                  <textarea
                    id="token_description"
                    {...register('token_description')}
                    rows={3}
                    className="shadow-sm px-3 py-1 h-40 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-indigo-300 rounded-md"
                    style={{resize: 'none'}}
                    defaultValue={''}
                  />
                  {errors.token_description && (
                    <div
                      className={`absolute ${errors.token_description &&
                        'border-red-300 text-red-900'} inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Write a few sentences about the artwork you want to create.
                </p>
                {errors.token_description && (
                  <p className="text-xs text-red-600" id="email-error">
                    {errors.token_description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="px-4 sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center py-3 px-32 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {loading ? 'Creating media...' : 'Create Media'}
              </button>
            </div>
          </section>
        </div>
        <div className="hidden lg:block">
          <div className="flex flex-col justify-center items-center w-full sm:p-6">
            <Media
              media={{
                metadata: {
                  mime_type: file ? file.type : '',
                  title: watchTokenName.toString(),
                  description: watchTokenDescription.toString(),
                },
                media_url: file ? URL.createObjectURL(file) : '',
                creator_address: account!,
              }}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: {},
    },
  };
};

export default Mint;

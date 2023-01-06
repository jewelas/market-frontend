import {API_ENDPOINT} from 'config';

export const fetcher = (url: string) =>
  fetch(`${API_ENDPOINT}${url}`).then(res => res.json());

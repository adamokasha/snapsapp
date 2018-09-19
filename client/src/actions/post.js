import axios from 'axios';

export const submitPost = (post, file, history) => async dispatch => {
  console.log('called submitPost');
  console.log(history);

  // Get pre-signed url
  const uploadConfig = await axios.get('/api/upload');

  // PUT to S3 bucket
  await axios.put(uploadConfig.data.url, file, {
    'Content-Type': file.type
  });

  await axios.post('/api/posts', {
    ...post,
    imgUrl: uploadConfig.data.key,
  });
  history.push('/');
}
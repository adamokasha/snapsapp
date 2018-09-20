export const submitPost = (post, file, history) => async dispatch => {
  const data = new FormData();
    // name must match multer upload('name')
    data.append('image', file);
  data.append('data', JSON.stringify(post));

  fetch('/api/upload', {
    mode: 'no-cors',
    method: "POST",
    body: data
  }).then(res => console.log(res)).catch(e => console.log(e))
}

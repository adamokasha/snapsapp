# SnapsApp

[Link to live demo](https://snapsapp.herokuapp.com)

SnapsApp is an image-sharing app built with the MERN stack and styled with the Material-UI library.

This is an on-going project that is updated on a semi-regular basis.

## Features

- Infinite scroll
- Faving
- Commenting
- Sharing profiles, posts and albums
- Feeds: Following, popular and new
- Searching
- Albums
- Follower system
- Direct messaging
- Profiles
- Authentication using Google or Facebook

## Getting Started

SnapsApp makes use of the following third party services:

- Amazon AWS
  - S3, IAM and serverless image handling
- Google Oauth
- Facebook Oauth
- MongoDB (mLab)

To run the app in development or production mode, you must sign up to these services and configure the necessary keys in the config directory.

To view the keys required open `/config/prod.js`. Note you will have to create your own `dev.js` file in the config folder.

### Development

`npm run dev`

### Production

The app is configured to build for production on Heroku.

## Component Design

The component design follows the practices recommended in the React docs of having stateful class-based container component that interact with stateless presentational components.

The `client/src/pages` folder houses most of the container components while most of the presentational components are housed in the `client/src/components`.

The nomenclature helps to find component "families". For examples, most of the presentational components used in the `ProfilePage` component are located in `components/profile` folder.

## License

MIT License

Copyright (c) 2018 Sam Okasha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

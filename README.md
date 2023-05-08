# Frontend of the Picky Home Assignment

I decided to use create-react-app to create the UI of this app because I'm more familiar with React than Next.js.

## Create

1. "Add Image" button and preview box.
2. Page title
3. Compress button
4. Upload progress (processing) indicator
5. Result/Compressed image preview box
6. Download button

## Though process

- Use a simple input of type "file" to open the native file selector.
- After selecting the file, a preview of the image should render. I should use a state to hold a reference to the selected image.
- I should validate to make sure the file selected is a valid image. Valid file types are jpeg and PNG.
- I use another state to hold the image file object itself. That will be used for uploading.
- When the 'COMPRESS' button is pressed, an HTTP request should be made to the API endpoint that I created.
- Ideally the API endpoint should be in localhost for dev environment and some other URL for production, therefore, I should handle that with environment variables (.env file) and scripts in package.json. I will leave this for last.
- I am having a cross-platform issue when trying to send requests to my API.
- I solved it in the backend.
- The post request is working correctly! Now I need to handle the response which has the compressed image in the body as a ReadableStream.
- I'm going to be honest, I've never worked with a ReadableStream before so I used MDN web docs (https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams) as a reference in order to handle it.
- As a final touch I'd like for the user to be able to download the compressed image.
- I also need to add error handling for when the response is not what's expected.
- This app only accesses 1 endpoint which is POST "/". Next I can implement a delete functionality.

## How to run

Create a .env file with the API url, eg: 'http://localhost:8000'

```
REACT_APP_API_URL=<SERVER-API-URL>
```

Then run:

```
npm start
```

## TODO

1. Docker

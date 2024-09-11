# Image Description App

## Overview

The Image Description App is a web-based tool designed to streamline the process of adding descriptions to images. It's particularly useful for content creators, web developers, and digital asset managers who need to improve the accessibility and searchability of their image collections.

I built this app especially to help me tag and annotate images for useage in AI ImageGen creation (and a bit to help me learn more about the [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) frameworks.)

## Features list

- Display images from a local folder (/images), put your images there.
- Add and edit descriptions for each image
- Prefix support for consistent tagging
- Word frequency analysis for quick tagging
- Character count for descriptions
- Automatic saving of descriptions as text files

## Installation

### Prerequisites

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/your-username/image-description-app.git
   cd image-description-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create an `images` folder in the root directory if it doesn't exist:
   ```
   mkdir images
   ```

4. Place your images in the `images` folder.

## Usage

1. Start the server:
   ```
   node server.js
   ```

2. Open your web browser and navigate to `http://localhost:3000` (or the port number displayed in the console).

3. You'll see the first image from your `images` folder displayed.

4. Use the textarea to add or edit the description for the current image.

5. The prefix field allows you to add a consistent prefix to all descriptions.

6. Click on words in the left sidebar to quickly add common tags to your description.

7. Click "Next" to save the current description and move to the next image.

8. Descriptions are automatically saved as text files in the `images` folder with the same name as the image file (e.g., `image1.jpg` will have a corresponding `image1.txt`).

## Configuration

- To change the port number, modify the `startPort` value in the `findAvailablePort` function call in `server.js`.
- To modify the list of stop words for the word frequency analysis, edit the `stopWords` array in `server.js`.

## Troubleshooting

- If images are not displaying, ensure they are placed directly in the `images` folder and have common image file extensions (.jpg, .jpeg, .png, .gif).
- If the server fails to start, check if the port is already in use and modify as needed.

## Contributing
Tom Hermans

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

# QR Code Reader for Venezuela Elections 2024

This project is designed to read QR codes from election act images in Venezuela and extract the relevant data for processing and saving in JSON format.

## Requirements

- Node.js v20.6.0 or higher
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

2. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

## Configuration

Create a `.env` file in the root of the project and define the path to the image directory:

```env
Imgroot=/path/to/image/directory
Jsonroot=/path/to/json/directory
```

## Obtaining Images

You can download the images using the following torrent link:

```
magnet:?xt=urn:btih:593db592ed517e0f829666cd03be9c9b58a1c46d&dn=actas&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337
```

## Usage

To run the script and process the images:

```bash
node index.mjs
```

The script will perform the following tasks:

1. Read all images in the specified directory.
2. Crop the bottom part of each image (one-fifth of the image).
3. Process the image to enhance QR code detection.
4. Read and decode the QR code.
5. Extract the information and save it in a JSON file in the `json` directory.

## Project Structure

- `index.mjs`: Main file containing the logic to read and process QR codes from images.
- `.env`: Configuration file to define the path to the image directory.
- `package.json`: npm configuration file listing the project's dependencies and scripts.

## Code Details

### Dependencies

- `qrCodeReader`: Library to read QR codes.
- `Jimp`: Library to process images.
- `fs`, `path`, `util`: Native Node.js modules to handle file systems and paths.

### Main Functions

#### `readQr(imagePath)`

- Reads an image and processes it to decode the QR code.
- Crops the image to keep the bottom one-fifth.
- Converts the image to grayscale and adjusts the contrast.
- Decodes the QR code and saves the extracted data in a JSON file.

#### `listFiles()`

- Reads all files in the specified directory.
- Filters the files to process only JPEG files.
- Calls `readQr` for each file.

#### `formJson(data, imageName)`

- Formats the extracted QR code data into a JSON object.

#### `setPartido(index, votes)`

- Associates the votes with the corresponding party according to the index.

### Execution

1. Define the path to the image directory in the `.env` file.
2. Run the main script:

```bash
node index.mjs
```

3. The generated JSON files will be saved in the `json` directory within the specified image directory.

## Contributions

Contributions are welcome. Please open an issue or a pull request to discuss any changes you wish to make.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
```

This README now includes information about how to obtain the images via the provided torrent link, along with all the other necessary details for installing, configuring, and running your project.
import qrCodeReader from 'qrcode-reader';
import Jimp from 'jimp';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const partidos = [
    {
        name: 'PSUV',
        codigo: 269,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'PCV',
        codigo: 9,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'TUPAMARO',
        codigo: 931,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'PPT',
        codigo: 276,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'MSV',
        codigo: 1017,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'PODEMOS',
        codigo: 514,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'MEP',
        codigo: 6,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'APC',
        codigo: 219,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'ORA',
        codigo: 906,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'UPV',
        codigo: 513,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'EV',
        codigo: 1089,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'PVV',
        codigo: 1090,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'PFV',
        codigo: 1093,
        candidato: 'Nicolas Maduro',
    },
    {
        name: 'AD',
        codigo: 1,
        candidato: 'Luis Martinez',
    },
    {
        name: 'COPEI',
        codigo: 2,
        candidato: 'Luis Martinez',
    },
    {
        name: 'MR',
        codigo: 1065,
        candidato: 'Luis Martinez',
    },
    {
        name: 'BR',
        codigo: 1066,
        candidato: 'Luis Martinez',
    },
    {
        name: 'DDP',
        codigo: 1091,
        candidato: 'Luis Martinez',
    },
    {
        name: 'UNE',
        codigo: 1095,
        candidato: 'Luis Martinez',
    },
    {
        name: 'EL CAMBIO',
        codigo: 1048,
        candidato: 'Javier Bertucci',
    },
    {
        name: 'PV',
        codigo: 1063,
        candidato: 'Jose Brito',
    },
    {
        name: 'VU',
        codigo: 868,
        candidato: 'Jose Brito',
    },
    {
        name: 'UVV',
        codigo: 1096,
        candidato: 'Jose Brito',
    },
    {
        name: 'MPJ',
        codigo: 458,
        candidato: 'Jose Brito',
    },
    {
        name: 'AP',
        codigo: 814,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'MOVEV',
        codigo: 878,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'CMC',
        codigo: 1050,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'FV',
        codigo: 1062,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'Alianza del Lapiz',
        codigo: 1051,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'MIN UNIDAD',
        codigo: 1068,
        candidato: 'Antonio Ecarri',
    },
    {
        name: 'SPV',
        codigo: 1049,
        candidato: 'Claudio Fermin',
    },
    {
        name: 'VPA',
        codigo: 236,
        candidato: 'Daniel Ceballos',
    },
    {
        name: 'AREPA',
        codigo: 1094,
        candidato: 'Daniel Ceballos',
    },
    {
        name: 'UNTC',
        codigo: 460,
        candidato: 'Edmundo Gonzalez',
    },
    {
        name: 'MPV',
        codigo: 1069,
        candidato: 'Edmundo Gonzalez',
    },
    {
        name: 'MUD',
        codigo: 1075,
        candidato: 'Edmundo Gonzalez',
    },
    {
        name: 'CENTRADOS',
        codigo: 1073,
        candidato: 'Enrique Marquez',
    },
    {
        name: 'CONDE',
        codigo: 1092,
        candidato: 'Benjamin Rausseo',
    },
];
const readQr = async (imagePath) => {
    // __ Read the image and create a buffer __ \\
    const buffer = fs.readFileSync(imagePath);

    // __ Parse the image using Jimp.read() __ \\
    const image = await Jimp.read(buffer);

    // Obtener las dimensiones de la imagen
    const { width, height } = image.bitmap;

    const cropHeight = Math.floor(height / 10);
    const cropTop = height - cropHeight;

    image.crop(0, cropTop, width, cropHeight);

    // Guardar la imagen cortada (opcional)

    // Convertir a escala de grises para mejorar la detección del código QR
    image.greyscale();

    // Aplicar contraste para hacer el código QR más visible
    image.contrast(1); // Ajusta el valor según sea necesario
    await image.writeAsync('qrcortado.jpg');
    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = function(err, value) {
        console.log(imagePath);
        if (err) {
            console.error(err);
            return;
        }
    // __ Printing the decrypted value __ \\
        console.log(value.result);
        const imageName = imagePath.replace(process.env.Imgroot+'/', '');
        try {
            const data = formJson(value.result, imageName);
            // save folder
            const jsonPath = path.join(process.env.Jsonroot, `${data.image.replace('jpg', 'json')}`);
            fs.writeFileSync(jsonPath, JSON.stringify(data));
        } catch (error) {
            console.error(error);
            return
        }
    };

    // __ Decoding the QR code __ \\
    qrCodeInstance.decode(image.bitmap);
}

// get list files
const listFiles = async () => {
    const files = await readdir(process.env.Imgroot);

    for (const file of files) {
        if (path.extname(file) !== '.jpg') {
            continue;
        }
        if (file.startsWith('._')) {
            continue;
        }
        const filePath = path.join(process.env.Imgroot, file);
        const stats = await stat(filePath);
        if (!stats.isFile()) {
            continue;
        }
        try {
            await readQr(filePath);
        } catch (error) {
            console.error(error);
            continue;
        }
    }
}

const formJson = (data, imageName) => {
    const info = data.split('!');
    const result = {};
    result['mesa'] = info[0];
    const listRawVotes = info[1].split(',');
    const listPartidos = [];
    if (listRawVotes.length !== partidos.length) {
        throw new Error('Invalid number of votes');
    }
    listRawVotes.forEach((votes, index) => {
        listPartidos.push(setPartido(index, votes));
    });
    result['votes'] = listPartidos;
    result['image'] = imageName;
    return result;
}

const setPartido = (index,votes) => {
    const partido = {};
    const { name, candidato, code } = partidos[index];
    partido['nombre'] = name;
    partido['candidato'] = candidato;
    partido['votos'] = votes;
    partido['code'] = code
    return partido;
}
listFiles();
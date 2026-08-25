import fs from "node:fs";
import zlib from "node:zlib";

const inputPath = "/home/ubuntu/upload/pasted_file_gTheSS_image.png";
const outputPath = "/home/ubuntu/webdev-static-assets/mg-logo-transparent-exact.png";

const png = fs.readFileSync(inputPath);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (!png.subarray(0, 8).equals(signature)) throw new Error("Input is not a PNG");

let offset = 8;
let width;
let height;
let bitDepth;
let colorType;
const idat = [];
while (offset < png.length) {
  const length = png.readUInt32BE(offset);
  const type = png.toString("ascii", offset + 4, offset + 8);
  const data = png.subarray(offset + 8, offset + 8 + length);
  offset += 12 + length;
  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
    if (bitDepth !== 8 || ![2, 6].includes(colorType) || data[12] !== 0) {
      throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}, interlace=${data[12]}`);
    }
  } else if (type === "IDAT") {
    idat.push(data);
  } else if (type === "IEND") {
    break;
  }
}
if (!width || !height || idat.length === 0) throw new Error("PNG metadata or image data missing");

const sourceBpp = colorType === 6 ? 4 : 3;
const sourceStride = width * sourceBpp;
const inflated = zlib.inflateSync(Buffer.concat(idat));
const rgba = Buffer.alloc(width * height * 4);
let sourceOffset = 0;
let previous = Buffer.alloc(sourceStride);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

for (let y = 0; y < height; y += 1) {
  const filter = inflated[sourceOffset++];
  const row = Buffer.alloc(sourceStride);
  for (let x = 0; x < sourceStride; x += 1) {
    const raw = inflated[sourceOffset++];
    const left = x >= sourceBpp ? row[x - sourceBpp] : 0;
    const up = previous[x] ?? 0;
    const upLeft = x >= sourceBpp ? previous[x - sourceBpp] : 0;
    if (filter === 0) row[x] = raw;
    else if (filter === 1) row[x] = (raw + left) & 255;
    else if (filter === 2) row[x] = (raw + up) & 255;
    else if (filter === 3) row[x] = (raw + Math.floor((left + up) / 2)) & 255;
    else if (filter === 4) row[x] = (raw + paeth(left, up, upLeft)) & 255;
    else throw new Error(`Unsupported PNG filter: ${filter}`);
  }
  for (let x = 0; x < width; x += 1) {
    const sourceIndex = x * sourceBpp;
    const targetIndex = (y * width + x) * 4;
    rgba[targetIndex] = row[sourceIndex];
    rgba[targetIndex + 1] = row[sourceIndex + 1];
    rgba[targetIndex + 2] = row[sourceIndex + 2];
    rgba[targetIndex + 3] = colorType === 6 ? row[sourceIndex + 3] : 255;
  }
  previous = row;
}

function isExteriorBackground(index) {
  const r = rgba[index];
  const g = rgba[index + 1];
  const b = rgba[index + 2];
  return rgba[index + 3] > 0 && r >= 220 && g >= 220 && b >= 220 && Math.max(r, g, b) - Math.min(r, g, b) <= 55;
}

const queue = [];
const visited = new Uint8Array(width * height);
function seed(x, y) {
  const pixel = y * width + x;
  if (visited[pixel]) return;
  const index = pixel * 4;
  if (!isExteriorBackground(index)) return;
  visited[pixel] = 1;
  queue.push(pixel);
}
for (let x = 0; x < width; x += 1) {
  seed(x, 0);
  seed(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  seed(0, y);
  seed(width - 1, y);
}

let head = 0;
while (head < queue.length) {
  const pixel = queue[head++];
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  rgba[pixel * 4 + 3] = 0;
  if (x > 0) seed(x - 1, y);
  if (x + 1 < width) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y + 1 < height) seed(x, y + 1);
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buffer) {
  let c = 0xffffffff;
  for (const value of buffer) c = crcTable[(c ^ value) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const result = Buffer.alloc(12 + data.length);
  result.writeUInt32BE(data.length, 0);
  typeBuffer.copy(result, 4);
  data.copy(result, 8);
  result.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return result;
}

const scanlines = Buffer.alloc(height * (1 + width * 4));
for (let y = 0; y < height; y += 1) {
  const rowStart = y * (1 + width * 4);
  scanlines[rowStart] = 0;
  rgba.copy(scanlines, rowStart + 1, y * width * 4, (y + 1) * width * 4);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;
const output = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(scanlines, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
fs.writeFileSync(outputPath, output);
const transparentPixels = rgba.reduce((count, _, index) => index % 4 === 3 && rgba[index] === 0 ? count + 1 : count, 0);
console.log(JSON.stringify({ inputPath, outputPath, width, height, transparentPixels, totalPixels: width * height }, null, 2));

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
let MP4Box;
try { MP4Box = require("mp4box"); }
catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
  MP4Box = require("../.tmp/video-export/node_modules/mp4box/dist/mp4box.all.cjs");
}

function finalize(buffer) {
  const file = MP4Box.createFile();
  const input = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  input.fileStart = 0;
  file.appendBuffer(input);
  file.flush();
  const info = file.getInfo();
  assert.equal(info.tracks.length, 1, "Expected one silent video track");
  assert.equal(info.videoTracks.length, 1);
  assert.ok(info.isFragmented);
  const track = file.getTrackById(info.videoTracks[0].id);
  const samples = track.samples;
  assert.ok(samples.length > 2000);
  let end = 0;
  for (const sample of samples) {
    assert.ok(sample.dts >= 0 && sample.duration > 0);
    end = Math.max(end, sample.dts + sample.duration);
  }
  const seconds = end / track.mdia.mdhd.timescale;
  assert.ok(seconds >= 100 && seconds <= 104, `Unexpected length: ${seconds}`);
  const movieDuration = Math.round(seconds * file.moov.mvhd.timescale);
  const output = Buffer.from(buffer);
  // Update only fixed-width duration fields. All fragment/data offsets stay intact.
  function duration(box, value, version0Offset, version1Offset) {
    assert.ok(box.version === 0 || box.version === 1);
    const offset = box.start + 8 + (box.version === 1 ? version1Offset : version0Offset);
    const width = box.version === 1 ? 8 : 4;
    assert.ok(offset + width <= box.start + box.size);
    if (width === 8) output.writeBigUInt64BE(BigInt(value), offset);
    else output.writeUInt32BE(value, offset);
  }
  duration(file.moov.mvhd, movieDuration, 16, 24);
  duration(track.tkhd, movieDuration, 20, 28);
  duration(track.mdia.mdhd, end, 16, 24);
  assert.equal(output.length, buffer.length);
  return { buffer: output, seconds, samples: samples.length };
}

if (require.main === module) {
  const filename = path.resolve(__dirname, "../assets/tutorials/workbench-start.mp4");
  const result = finalize(fs.readFileSync(filename));
  fs.writeFileSync(filename, result.buffer);
  console.log(`PASS: MP4 duration finalized: ${result.seconds.toFixed(3)} seconds, ${result.samples} frames.`);
}
module.exports = { finalize };

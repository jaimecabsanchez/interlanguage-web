// Convierte un vídeo cualquiera en un clip para las tarjetas: recorte vertical 4:5, sin audio, H.264 ligero y listo para reproducir al instante.
// Uso: mkclip entrada salida.mp4 [inicio_s=0] [duración_s=10] [foco_x=0.5] [foco_y=0.5] [ancho=480] [bitrate_kbps=420]
import Foundation
import AVFoundation
import CoreGraphics

let a = CommandLine.arguments
guard a.count >= 3 else { print("uso: mkclip entrada salida.mp4 [inicio] [duración] [foco_x] [foco_y] [ancho] [kbps]"); exit(1) }
func arg(_ i: Int, _ d: Double) -> Double { a.count > i ? (Double(a[i]) ?? d) : d }
let start = arg(3, 0), dur = arg(4, 10), fx = arg(5, 0.5), fy = arg(6, 0.5)
let W = Int(arg(7, 480)), H = W * 5 / 4, kbps = Int(arg(8, 420))
let fps: Int32 = 24

let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let sem0 = DispatchSemaphore(value: 0)
var track: AVAssetTrack?; var total = 0.0; var nat = CGSize.zero; var pt = CGAffineTransform.identity
Task {
    track = try? await asset.loadTracks(withMediaType: .video).first
    if let t = track { nat = (try? await t.load(.naturalSize)) ?? .zero; pt = (try? await t.load(.preferredTransform)) ?? .identity }
    total = ((try? await asset.load(.duration)) ?? .zero).seconds
    sem0.signal()
}
sem0.wait()
guard let vt = track else { print("sin pista de vídeo"); exit(1) }
let d = min(dur, max(0.5, total - start))

let rect = CGRect(origin: .zero, size: nat).applying(pt)
let w = rect.width, h = rect.height
let s = max(Double(W) / Double(w), Double(H) / Double(h))
let sw = Double(w) * s, sh = Double(h) * s
let ox = min(0, max(Double(W) - sw, -(fx * sw - Double(W) / 2)))
let oy = min(0, max(Double(H) - sh, -(fy * sh - Double(H) / 2)))
let tf = pt.concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY)).concatenating(CGAffineTransform(scaleX: s, y: s)).concatenating(CGAffineTransform(translationX: ox, y: oy))

let comp = AVMutableVideoComposition()
comp.renderSize = CGSize(width: W, height: H); comp.frameDuration = CMTime(value: 1, timescale: fps)
let ins = AVMutableVideoCompositionInstruction()
ins.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: vt); layer.setTransform(tf, at: .zero)
ins.layerInstructions = [layer]; comp.instructions = [ins]

let reader = try! AVAssetReader(asset: asset)
reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), duration: CMTime(seconds: d, preferredTimescale: 600))
let ro = AVAssetReaderVideoCompositionOutput(videoTracks: [vt], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
ro.videoComposition = comp
reader.add(ro)

try? FileManager.default.removeItem(atPath: a[2])
let writer = try! AVAssetWriter(outputURL: URL(fileURLWithPath: a[2]), fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let wi = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel, AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2]])
writer.add(wi)
reader.startReading(); writer.startWriting()
let t0 = CMTime(seconds: start, preferredTimescale: 600)
writer.startSession(atSourceTime: .zero)
let sem = DispatchSemaphore(value: 0)
var n = 0
wi.requestMediaDataWhenReady(on: DispatchQueue(label: "w")) {
    while wi.isReadyForMoreMediaData {
        if let sb = ro.copyNextSampleBuffer() {
            var timing = CMSampleTimingInfo(); CMSampleBufferGetSampleTimingInfo(sb, at: 0, timingInfoOut: &timing)
            timing.presentationTimeStamp = CMTimeSubtract(timing.presentationTimeStamp, t0); timing.decodeTimeStamp = .invalid
            var out: CMSampleBuffer?; CMSampleBufferCreateCopyWithNewTiming(allocator: nil, sampleBuffer: sb, sampleTimingEntryCount: 1, sampleTimingArray: &timing, sampleBufferOut: &out)
            if let o = out, wi.append(o) { n += 1 } else { break }
        } else { wi.markAsFinished(); writer.finishWriting { sem.signal() }; return }
    }
}
sem.wait()
print("ok \(a[2]) \(n) fotogramas, \(String(format: "%.1f", d)) s, \(W)x\(H)")

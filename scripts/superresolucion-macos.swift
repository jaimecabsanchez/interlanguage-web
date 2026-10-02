// Reescala una foto 4x con el modelo de super-resolución de Apple (VideoToolbox, macOS 26 o posterior).
// Añade detalle real y elimina los bloques de compresión; sin filtros de color, la foto sigue natural.
// Uso:  swiftc -O scripts/superresolucion-macos.swift -o /tmp/sr && /tmp/sr entrada.jpg salida.png
// (la primera vez macOS descarga el modelo; entrada máx. 1920 x 1920 px). Lo usa scripts/generar-hero-colegio.py.
import Foundation
import VideoToolbox
import CoreImage
import CoreVideo

let args = CommandLine.arguments
guard args.count >= 3 else { print("uso: sr entrada.jpg salida.png"); exit(2) }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])

let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CIContext(options: [.workingColorSpace: srgb, .outputColorSpace: srgb])
guard let ci = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else { print("no se puede leer"); exit(1) }
let W = Int(ci.extent.width), H = Int(ci.extent.height)
print("entrada", W, "x", H)

guard let cfg = VTSuperResolutionScalerConfiguration(frameWidth: W, frameHeight: H, scaleFactor: 4, inputType: .image,
        usePrecomputedFlow: false, qualityPrioritization: .normal,
        revision: VTSuperResolutionScalerConfiguration.defaultRevision) else { print("configuración no válida"); exit(1) }

print("estado del modelo:", cfg.configurationModelStatus.rawValue)
if cfg.configurationModelStatus != .ready {
    let sem = DispatchSemaphore(value: 0)
    var dlError: Error? = nil
    cfg.downloadConfigurationModel { err in dlError = err; sem.signal() }
    while sem.wait(timeout: .now() + 3) == .timedOut {
        print("  descargando… \(Int(cfg.configurationModelPercentageAvailable * 100)) %")
    }
    if let e = dlError { print("fallo en la descarga:", e); exit(1) }
    print("modelo listo, estado:", cfg.configurationModelStatus.rawValue)
}

func makeBuffer(_ attrs: [String: Any], _ w: Int, _ h: Int) -> CVPixelBuffer {
    var pb: CVPixelBuffer?
    let fmt = ((attrs["PixelFormatType"] as? [NSNumber])?.first?.uint32Value) ?? (attrs["PixelFormatType"] as? NSNumber)?.uint32Value ?? kCVPixelFormatType_64RGBAHalf
    let st = CVPixelBufferCreate(kCFAllocatorDefault, w, h, fmt, attrs as CFDictionary, &pb)
    precondition(st == kCVReturnSuccess, "CVPixelBufferCreate \(st)")
    return pb!
}
let src = makeBuffer(cfg.sourcePixelBufferAttributes, W, H)
ctx.render(ci, to: src, bounds: CGRect(x: 0, y: 0, width: W, height: H), colorSpace: srgb)
let dst = makeBuffer(cfg.destinationPixelBufferAttributes, W * 4, H * 4)

let proc = VTFrameProcessor()
try proc.startSession(configuration: cfg)
let sf = VTFrameProcessorFrame(buffer: src, presentationTimeStamp: .zero)!
let df = VTFrameProcessorFrame(buffer: dst, presentationTimeStamp: .zero)!
let params = VTSuperResolutionScalerParameters(sourceFrame: sf, previousFrame: nil, previousOutputFrame: nil,
        opticalFlow: nil, submissionMode: .random, destinationFrame: df)!
let t0 = Date()
let sem2 = DispatchSemaphore(value: 0)
var perr: Error? = nil
proc.process(parameters: params) { _, err in perr = err; sem2.signal() }
sem2.wait()
if let e = perr { print("error al procesar:", e); exit(1) }
print("procesado en", String(format: "%.1f", Date().timeIntervalSince(t0)), "s")
proc.endSession()

let outCI = CIImage(cvPixelBuffer: dst)
try ctx.writePNGRepresentation(of: outCI, to: outURL, format: .RGBA8, colorSpace: srgb)
print("guardado", outURL.path, Int(outCI.extent.width), "x", Int(outCI.extent.height))

import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count == 4, let seconds = Double(args[3]) else {
    print("usage: swift frame.swift <in.mp4> <out.png> <seconds>"); exit(1)
}
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = CMTime(seconds: 0.5, preferredTimescale: 600)
let time = CMTime(seconds: seconds, preferredTimescale: 600)
let cg = try gen.copyCGImage(at: time, actualTime: nil)
let rep = NSBitmapImageRep(cgImage: cg)
guard let data = rep.representation(using: .png, properties: [:]) else { exit(2) }
try data.write(to: URL(fileURLWithPath: args[2]))
print("wrote \(args[2]) \(cg.width)x\(cg.height)")

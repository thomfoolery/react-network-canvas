const AudioSources = [
  "AudioScheduledSourceNode",
  "OscillatorNode",
  "AudioBufferSourceNode",
  "MediaElementAudioSourceNode",
  "MediaStreamAudioSourceNode",
  "MediaStreamTrackAudioSourceNode",
];

const EffectAndFilters = [
  "BiquadFilterNode",
  "ConvolverNode",
  "DelayNode",
  "DynamicsCompressorNode",
  "GainNode",
  "WaveShaperNode",
  "IIRFilterNode",
];

const Destinations = [
  "AudioDestinationNode",
  "MediaStreamAudioDestinationNode",
];

const Analyzers = ["AnalyserNode"];

const ChannelSplitters = ["ChannelSplitterNode", "ChannelMergerNode"];

const AudioSpatializer = ["PannerNode", "StereoPannerNode"];

const AudioProcessors = ["AudioWorkletNode", "AudioWorkletProcessor"];

const OfflineProcessing = ["OfflineAudioContext"];

const categories = [
  "AudioSources",
  "EffectAndFilters",
  "Destinations",
  "Analyzers",
  "ChannelSplitters",
  "AudioSpatializer",
  "AudioProcessors",
  "OfflineProcessing",
];

export {
  AudioSources,
  EffectAndFilters,
  Destinations,
  Analyzers,
  ChannelSplitters,
  AudioSpatializer,
  AudioProcessors,
  OfflineProcessing,
  categories,
};

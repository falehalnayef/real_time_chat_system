export type Message = {
  type: String; // 'text', 'file', 'video', 'voice'
  text?: String; // For text messages
  file?: {
    name: String;
    type: String;
    filePath: String; // Or store file path/URL
  };
  video?: {
    name: String;
    type: String;
    videoPath: String; // Or store video path/URL
  };
  voice?: {
    name: String;
    type: String;
    voicePath: String; // Or store audio path/URL
  };
};

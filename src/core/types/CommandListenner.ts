export interface CommandListenner<MessageProps> {
  readonly command: string;

  readonly exec: (payload: MessageProps) => void;
}

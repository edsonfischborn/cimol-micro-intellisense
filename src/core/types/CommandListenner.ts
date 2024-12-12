export interface CommandListenner<MessageProps> {
  readonly command: string;

  readonly registerInVsCode?: () => void;

  readonly exec: (payload: MessageProps) => void;
}

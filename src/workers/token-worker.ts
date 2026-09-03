import { encode } from "gpt-tokenizer";

type TokenRequest = {
  id: number;
  text: string;
};

self.onmessage = (event: MessageEvent<TokenRequest>) => {
  const { id, text } = event.data;

  try {
    self.postMessage({ id, count: encode(text).length });
  } catch (error) {
    self.postMessage({
      id,
      count: 0,
      error: error instanceof Error ? error.message : "Unable to count tokens.",
    });
  }
};

export {};


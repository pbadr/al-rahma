export async function delay(miliseconds: number): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve()
    }, miliseconds);
  });
}

export async function* simulateResponse() {
  const streamingMessage = "Hello. How are you doing today?";

  let index = 0;
  while (index != streamingMessage.length) {
    yield streamingMessage[index];

    await delay(10);
    index++;
  }
}

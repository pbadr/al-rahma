export async function delay(miliseconds: number): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve()
    }, miliseconds);
  });
}

export async function* simulateResponse() {
  const streamingMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor, ex id condimentum tincidunt, urna sem lacinia ante, vitae faucibus arcu sem ullamcorper massa. Donec congue ut leo ut porta. Aliquam lacinia dictum nunc. Mauris venenatis est laoreet, cursus est vel, posuere justo. Vivamus in posuere libero, id viverra massa. In ut ligula et ex vulputate posuere. Nulla porttitor elementum vehicula. Pellentesque vitae ullamcorper justo. In hac habitasse platea dictumst. Ut sodales risus vitae purus venenatis tincidunt. Duis sed varius tortor. Donec id tempor risus, sed vehicula nisi. Sed non interdum odio, sed auctor turpis. Integer tincidunt erat nec nisl mattis dictum. Etiam dignissim odio enim, in fringilla turpis hendrerit eget. Suspendisse quis lobortis libero.";

  let index = 0;
  while (index != streamingMessage.length) {
    yield streamingMessage[index];

    await delay(1);
    index++;
  }
}

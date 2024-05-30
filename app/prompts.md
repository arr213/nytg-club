Given the records below, I am writing a typescript method processGame shown below.

I would like the function to

    processGame(gr: GameRecord): ProcessedGameRecord {
    const gameType = gr.text.split(/\W+/)[0];
    const gameNumber = Number(gr.text.split(/\W+/));
    const dt = DateTime.fromObject({
      month: Number(gr.date.split('/')[0]),
      day: Number(gr.date.split('/')[1]),
      year: Number(gr.date.split('/')[2])
    });

    return {
      ...gr,
      gameType,
      gameNumber,
      dt
    }
  }

sample records below:
[
    {
        "id": 1,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Connections\r\nPuzzle #318\r\n🟪🟨🟩🟨\r\n🟩🟩🟩🟩\r\n🟦🟦🟦🟦\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 2,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Wordle 1,044 5/6*\r\n\r\n⬛⬛⬛🟨🟩\r\n⬛🟩⬛🟨🟩\r\n🟩🟩⬛⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 3,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Connections\r\nPuzzle #322\r\n🟦🟦🟦🟦\r\n🟩🟩🟩🟩\r\n🟪🟪🟪🟪\r\n🟨🟨🟨🟨\r\n"
    },
    {
        "id": 4,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/28/2024",
        "text": "Strands #56\r\n“Coming clean”\r\n🔵🔵🔵🔵\r\n🟡🔵🔵\r\n"
    },
    {
        "id": 5,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Wordle 1,045 5/6*\r\n\r\n⬛🟨🟩🟨⬛\r\n🟨🟩🟩⬛⬛\r\n⬛🟩🟩⬛🟩\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 6,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Connections\r\nPuzzle #323\r\n🟪🟩🟦🟪\r\n🟩🟩🟩🟩\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 7,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Strands #57\r\n“Name dropping”\r\n🔵🔵🔵🔵\r\n🟡🔵🔵🔵\r\n"
    },
    {
        "id": 8,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "4/30/2024",
        "text": "Connections\r\nPuzzle #324\r\n🟦🟦🟦🟦\r\n🟩🟩🟩🟩\r\n🟨🟪🟨🟨\r\n🟪🟨🟨🟨\r\n🟨🟨🟨🟨\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 9,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/1/2024",
        "text": "Wordle 1,047 3/6*\r\n\r\n⬛⬛🟩🟩⬛\r\n⬛⬛🟩🟩⬛\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 10,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/2/2024",
        "text": "Wordle 1,048 5/6*\r\n\r\n🟩⬛⬛⬛🟩\r\n🟩⬛🟩⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩⬛🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 11,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Connections\r\nPuzzle #329\r\n🟪🟪🟪🟪\r\n🟩🟩🟩🟩\r\n🟨🟦🟨🟨\r\n🟨🟨🟨🟨\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 12,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Strands #63\r\n“Tools for the job”\r\n🔵🔵🔵🔵\r\n🔵🟡🔵🔵\r\n"
    },
    {
        "id": 13,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/5/2024",
        "text": "Wordle 1,051 4/6*\r\n\r\n⬛⬛🟨⬛🟨\r\n🟨🟨🟨🟩⬛\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 14,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Strands #65\r\n“Can you dig it?”\r\n🔵💡🔵🔵\r\n🔵🔵🟡🔵\r\n"
    },
    {
        "id": 15,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Connections\r\nPuzzle #331\r\n🟨🟨🟨🟨\r\n🟦🟪🟩🟦\r\n🟦🟩🟦🟦\r\n🟩🟦🟩🟦\r\n🟦🟦🟪🟦\r\n"
    },
    {
        "id": 16,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/7/2024",
        "text": "Wordle 1,053 6/6*\r\n\r\n🟨🟨⬛⬛⬛\r\n🟨⬛⬛⬛🟨\r\n⬛🟩🟩🟩🟩\r\n⬛🟩🟩🟩🟩\r\n⬛🟩🟩🟩🟩\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 17,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/9/2024",
        "text": "Connections\r\nPuzzle #333\r\n🟨🟦🟨🟨\r\n🟪🟪🟪🟪\r\n🟩🟨🟦🟨\r\n🟨🟨🟨🟨\r\n🟩🟩🟩🟩\r\n🟦🟦🟦🟦\r\n"
    },
    {
        "id": 18,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Wordle 1,056 4/6\r\n\r\n⬜⬜🟨⬜🟨\r\n⬜🟩🟨⬜⬜\r\n🟩🟩🟩🟨⬜\r\n🟩🟩🟩🟩🟩\r\n"
    },
    {
        "id": 19,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟦🟦🟩🟨\r\n🟦🟪🟦🟦\r\n🟦🟦🟦🟦\r\n🟨🟨🟩🟨\r\n🟨🟨🟨🟨\r\n🟩🟩🟩🟩\r\n🟪🟪🟪🟪\r\n"
    },
    {
        "id": 20,
        "email": "william.lesser@gmail.com",
        "player": "William Lesser",
        "date": "5/10/2024",
        "text": "Strands #68\r\n“Like a rocket”\r\n🔵🔵🟡🔵\r\n🔵🔵\r\n"
    },
    {
        "id": 21,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟪🟩🟨🟨\r\n🟨🟨🟨🟨\r\n🟩🟦🟦🟦\r\n🟪🟩🟪🟪\r\n🟦🟪🟪🟪\r\n"
    },
    {
        "id": 22,
        "email": "arr213@gmail.com",
        "player": "Adam Reid",
        "date": "5/10/2024",
        "text": "Connections\r\nPuzzle #334\r\n🟪🟩🟨🟨\r\n🟨🟨🟨🟨\r\n🟩🟦🟦🟦\r\n🟪🟩🟪🟪\r\n🟦🟪🟪🟪\r\n"
    }
]
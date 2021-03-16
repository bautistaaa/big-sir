class History {
  currentIndex: number;
  list: string[];
  output: string[];

  constructor(index = 0) {
    this.currentIndex = index;
    this.list = [];
    this.output = [];
  }

  addCommand(command: string, output: string) {
    console.log([...this.list]);
    this.list.push(command);
    this.output.push(output);
    this.currentIndex++;
    console.log([...this.list]);
  }

  getList() {
    return [ ...this.list ];
  }

  getOutput(i: number) {
    return this.output[i];
  }

  getPreviousCommand() {
    return this.list[this.currentIndex - 1] ?? this.list[0];
  }

  getNextCommand() {
    return this.list[this.currentIndex + 1] ?? this.list[this.list.length - 1];
  }
}

export default History;

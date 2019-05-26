/** 录入一个 TODO List
 * - 输入标题
 * - 输入步骤
 *    - 步骤默认状态未完成
 *    - 步骤以单个空格开头, 则为完成状态
 *    - 步骤以两个空格结尾, 则结束
 *    - 步骤不输入直接回车, 则重新输入
 *      - 第三次输入空, 则结束
 *    - 步骤输入会进行trim, 不为空则加入
 *    - 每新增一个步骤, 序号 +1
 *      - 重新输入, 序号不增加
 */
var inquirer = require("inquirer");
var chalk = require("chalk");

async function askForTitle(retry) {
  const { title } = await inquirer.prompt({
    type: "input",
    name: "title",
    message: retry ? "! What?" : "Do:"
  });
  if (!title) {
    return askForTitle(true);
  }
  return title;
}

async function askForTodoItem() {
  var items = [];
  var i = 1;
  async function ask(i, retry = 0) {
    if (retry > 2) {
      return;
    }
    var questions = [
      {
        type: "input",
        name: "item",
        message: retry ? "- " : `${i}. `
      }
    ];
    const { item } = await inquirer.prompt(questions);
    if (!item) {
      return await ask(i, retry + 1);
    }
    var itemPayload = {
      status: item.startsWith(" "),
      text: item.trim()
    };
    if (itemPayload.text) {
      items.push(itemPayload);
    }
    if (!item.endsWith("  ")) {
      return await ask(++i);
    }
  }
  await ask(i);
  return items;
}

async function main() {
  var output = {
    title: "",
    items: []
  };

  const title = await askForTitle();
  output.title = title;
  const items = await askForTodoItem();
  output.items = [...items];
  console.info(
    `\n🌴  ${chalk.blue.underline.bold(output.title.toUpperCase())}`
  );

  console.info(
    output.items
      .map(item => `- [${item.status ? "x" : " "}] ${item.text}`)
      .join("\n")
  );
  return output;
}

main();

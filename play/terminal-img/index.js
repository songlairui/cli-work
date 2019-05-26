const terminalImage = require("terminal-image");
const got = require("got");

const PIC_URL = `https://www.baidu.com/img/bd_logo1.png`;

(async () => {
  const { body } = await got(PIC_URL, { encoding: null });
  console.log(await terminalImage.buffer(body));
})();

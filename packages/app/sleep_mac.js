const { exec } = require('child_process');

function sleep_mac() {
  // 要执行的Bash脚本文件的路径
  const scriptPath = './yourscript.sh';

  // 执行Bash脚本
  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行脚本时发生错误：${error}`);
      return;
    }
    console.log(`脚本输出：${stdout}`);
  });
}

module.exports = { sleep_mac }

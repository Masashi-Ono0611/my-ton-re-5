import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { beginCell, toNano } from "ton-core";
import qs from "qs";

// 環境変数の読み込み
dotenv.config();

// ボットの初期化
const bot = new Telegraf(process.env.TG_BOT_TOKEN!);

// 開始コマンド
bot.start((ctx) =>
  ctx.reply("TONカウンターアプリへようこそ！", {
    reply_markup: {
      keyboard: [
        ["Increment by 10"],
        ["Deposit 0.5 TON"],
        ["Withdraw 0.1 TON"],
      ],
      resize_keyboard: true,
    },
  })
);

// インクリメントボタンのハンドラー
bot.hears("Increment by 10", (ctx) => {
  const msg_body = beginCell()
    .storeUint(1, 32) // OP code
    .storeUint(10, 32) // increment_by value
    .endCell();

  let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify(
    {
      text: "カウンターを10増加",
      amount: toNano("0.05").toString(10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"),
    }
  )}`;

  ctx.reply("カウンターを10増加するには、トランザクションに署名してください:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "トランザクションに署名",
            url: link,
          }
        ]
      ]
    }
  });
});

// デポジットボタンのハンドラー
bot.hears("Deposit 0.5 TON", (ctx) => {
  const msg_body = beginCell()
    .storeUint(2, 32) // OP code
    .endCell();

  let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify(
    {
      text: "0.5 TONをデポジット",
      amount: toNano("0.5").toString(10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"),
    }
  )}`;

  ctx.reply("0.5 TONをデポジットするには、トランザクションに署名してください:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "トランザクションに署名",
            url: link,
          }
        ]
      ]
    }
  });
});

// 出金ボタンのハンドラー
bot.hears("Withdraw 0.1 TON", (ctx) => {
  const msg_body = beginCell()
    .storeUint(3, 32) // OP code
    .storeCoins(toNano("0.1"))
    .endCell();

  let link = `https://app.tonkeeper.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify(
    {
      text: "0.1 TONを出金",
      amount: toNano("0.05").toString(10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"),
    }
  )}`;

  ctx.reply("0.1 TONを出金するには、トランザクションに署名してください:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "トランザクションに署名",
            url: link,
          }
        ]
      ]
    }
  });
});

// WebAppからのデータ受信
bot.on(message("web_app_data"), (ctx) => {
  const data = ctx.message.web_app_data;
  ctx.reply(`WebAppからデータを受信しました: ${data?.data}`);
});

// ボットの起動
bot.launch();

// 正常終了のための処理
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM")); 
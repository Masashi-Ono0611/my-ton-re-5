# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# TON DApp Development Environment Setup

このプロジェクトは、TON Connectを使用したDAppの開発環境をセットアップするためのものです。

## 環境構築手順

### 1. 依存関係のインストール

```bash
# 既存の依存関係をクリーンアップ
rm -rf node_modules package-lock.json

# 依存関係のインストール
npm install --legacy-peer-deps
```

### 2. 設定ファイルの更新

#### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto', 'stream', 'buffer']
    })
  ],
  base: './',
  server: {
    fs: {
      allow: ['./', '../'],
    },
    host: true,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',
      '*.ngrok-free.app'
    ]
  }
});
```

#### public/manifest.json

```json
{
  "url": "https://[your-ngrok-url]",
  "name": "TON Counter Tutorial",
  "iconUrl": "https://raw.githubusercontent.com/markokhman/func-course-chapter-5-code/master/public/tonco.png"
}
```

### 3. 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
```

### 4. ngrokの設定

別のターミナルウィンドウで以下を実行：

```bash
# ngrokをインストール（まだインストールしていない場合）
brew install ngrok

# ngrokを起動（ポート番号は開発サーバーの出力に合わせて調整）
ngrok http 5173  # または表示されているポート番号
```

### 5. manifest.jsonの更新

ngrokが生成したURLを`public/manifest.json`の`url`フィールドに設定します。

## トラブルシューティング

### ポートが使用中の場合

開発サーバーは自動的に利用可能な次のポートを試します（5173, 5174, 5175...）。
ngrokを起動する際は、実際に使用されているポート番号を指定してください。

### Blocked requestエラーが表示される場合

vite.config.tsの`allowedHosts`に、使用するngrokのドメインが含まれていることを確認してください。
デフォルトで`.ngrok-free.app`と`*.ngrok-free.app`が許可されています。

### 依存関係の競合が発生する場合

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

を実行して、依存関係を再インストールしてください。

## 注意事項

- 開発サーバーのポート番号は環境によって変わる可能性があります
- ngrokのURLは毎回変更されるため、新しいURLを`manifest.json`に反映する必要があります
- 本番環境では、固定のURLを使用することを推奨します

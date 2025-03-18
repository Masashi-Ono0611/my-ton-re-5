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

# TON DApp開発のトラブルシューティングガイド

## 発生した問題と解決策

### 1. コントラクトデータの取得エラー

#### 問題
- コントラクトのカウンター値が表示されず、`exit_code: 11`エラーが発生
- エラーメッセージ: `Error fetching contract data: Error: Unable to execute get method`

#### 原因
- コントラクトのメソッド名が間違っていた
  - 使用していた名前: `counter`
  - 正しい名前: `get_contract_storage_data`

#### 解決策
1. `MainContract.ts`のメソッド名を修正
```typescript
async getData(provider: ContractProvider) {
    try {
        console.log("Calling get method 'get_contract_storage_data'...");
        const { stack } = await provider.get("get_contract_storage_data", []);
        // ... 以下省略
    } catch (error) {
        console.error("Error in getData:", error);
        throw error;
    }
}
```

2. デバッグログの追加
- コントラクトの初期化
- データ取得プロセス
- エラーハンドリング

### 2. WalletConnect接続エラー

#### 問題
- WalletConnectボタンクリック時にHTMLドキュメントが返される
- JavaScriptの有効化を促すメッセージが表示

#### 原因
- マニフェストURLの設定が不適切
  - ローカルの`manifest.json`を使用していた
  - 正しい設定: 公式の外部マニフェストURLを使用する必要がある

#### 解決策
1. `main.tsx`のマニフェストURL設定を変更
```typescript
// 変更前
const manifestUrl = '/manifest.json';

// 変更後
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';
```

### 3. その他の改善点

#### デバッグ機能の強化
1. TONクライアントの初期化ログ追加
```typescript
console.log("Initializing TON client...");
console.log("Using endpoint:", endpoint);
console.log("TON client initialized successfully");
```

2. コントラクト操作のエラーハンドリング
```typescript
try {
    // 操作の実行
} catch (error) {
    console.error("Error details:", error);
}
```

## 開発環境のセットアップ

### 必要な依存関係
```json
{
  "dependencies": {
    "@orbs-network/ton-access": "^2.3.3",
    "@tonconnect/ui-react": "^1.0.0-beta.9",
    "ton": "^13.5.0",
    "ton-core": "^0.49.1",
    "ton-crypto": "^3.2.0"
  }
}
```

### 開発サーバーの起動
```bash
npm run dev -- --host
```

### 注意点
1. ポート番号の確認
   - デフォルト: 5173
   - 使用中の場合: 5174などの別ポートを使用

2. マニフェストURLの設定
   - 開発時は公式の外部マニフェストURLを使用することを推奨
   - 本番環境では自身のマニフェストURLに変更

3. コントラクトメソッド名
   - 正しいメソッド名（`get_contract_storage_data`）を使用していることを確認
   - メソッド名の変更時はデバッグログで動作を確認

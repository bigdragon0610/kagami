# kagami

シンプルで美しい、Web上の鏡アプリケーション

## 概要

kagamiはPC上でカメラを使って自分の顔を映すシンプルなWebアプリケーションです。本物の鏡のように左右反転表示され、ミニマルでモダンなデザインで没入感のある体験を提供します。

## 特徴

- 🪞 **鏡のような表示**: カメラ映像を左右反転して表示
- 🎨 **モノトーンデザイン**: 黒・白・グレーのミニマルな配色
- 📱 **レスポンシブ**: デスクトップでもモバイルでも動作
- ⚡ **高速**: シンプルなHTML/CSS/JavaScriptで軽量
- 🔒 **プライバシー重視**: すべての処理はローカルで完結

## 使い方

### ローカルで実行

1. リポジトリをクローンまたはダウンロード
2. `index.html`をブラウザで開く
3. カメラへのアクセスを許可

### HTTPサーバーで実行（推奨）

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのhttp-serverを使う場合
npx http-server
```

ブラウザで `http://localhost:8000` にアクセス

## 技術スタック

- HTML5
- CSS3
- Vanilla JavaScript
- WebRTC (getUserMedia API)

## ブラウザ互換性

以下のモダンブラウザで動作します：
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## セキュリティ

- getUserMedia APIはHTTPS環境またはlocalhostでのみ動作します
- 初回アクセス時、ブラウザがカメラアクセスの許可を求めます
- カメラ映像はすべてローカルで処理され、外部に送信されることはありません

## ライセンス

MIT License

## 今後の機能

- フィルター機能
- スクリーンショット撮影
- カメラ切り替え
- フルスクリーン切り替え
- 明るさ調整
- ズーム機能
